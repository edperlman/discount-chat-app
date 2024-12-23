"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationScriptEngine = void 0;
const tools_1 = require("@rocket.chat/tools");
const logger_1 = require("../logger");
const updateHistory_1 = require("./updateHistory");
class IntegrationScriptEngine {
    get disabled() {
        return this.isDisabled();
    }
    get incoming() {
        return this.isIncoming;
    }
    constructor(isIncoming) {
        this.isIncoming = isIncoming;
        this.compiledScripts = {};
    }
    integrationHasValidScript(integration) {
        return Boolean(!this.disabled && integration.scriptEnabled && integration.scriptCompiled && integration.scriptCompiled.trim() !== '');
    }
    // PrepareOutgoingRequest will execute a script to build the request object that will be used for the actual integration request
    // It may also return a message object to be sent to the room where the integration was triggered
    prepareOutgoingRequest(_a) {
        return __awaiter(this, arguments, void 0, function* ({ integration, data, historyId, url }) {
            const request = {
                params: {},
                method: 'POST',
                url,
                data,
                auth: undefined,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36',
                },
            };
            if (!(yield this.hasScriptAndMethod(integration, 'prepare_outgoing_request'))) {
                return request;
            }
            return this.executeOutgoingScript(integration, 'prepare_outgoing_request', { request }, historyId);
        });
    }
    processOutgoingResponse(_a) {
        return __awaiter(this, arguments, void 0, function* ({ integration, request, response, content, historyId, }) {
            if (!(yield this.hasScriptAndMethod(integration, 'process_outgoing_response'))) {
                return;
            }
            const sandbox = {
                request,
                response: {
                    error: null,
                    status_code: response.status,
                    content,
                    content_raw: content,
                    headers: Object.fromEntries(response.headers),
                },
            };
            const scriptResult = yield this.executeOutgoingScript(integration, 'process_outgoing_response', sandbox, historyId);
            if (scriptResult === false) {
                return scriptResult;
            }
            if (scriptResult === null || scriptResult === void 0 ? void 0 : scriptResult.content) {
                return scriptResult.content;
            }
        });
    }
    processIncomingRequest(_a) {
        return __awaiter(this, arguments, void 0, function* ({ integration, request, }) {
            return this.executeIncomingScript(integration, 'process_incoming_request', { request });
        });
    }
    get logger() {
        if (this.isIncoming) {
            return logger_1.incomingLogger;
        }
        return logger_1.outgoingLogger;
    }
    executeOutgoingScript(integration, method, params, historyId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.disabled) {
                return;
            }
            const script = yield (0, tools_1.wrapExceptions)(() => this.getIntegrationScript(integration)).suppress((e) => (0, updateHistory_1.updateHistory)({
                historyId,
                step: 'execute-script-getting-script',
                error: true,
                errorStack: e,
            }));
            if (!script) {
                return;
            }
            if (!script[method]) {
                this.logger.error(`Method "${method}" not found in the Integration "${integration.name}"`);
                yield (0, updateHistory_1.updateHistory)({ historyId, step: `execute-script-no-method-${method}` });
                return;
            }
            try {
                yield (0, updateHistory_1.updateHistory)({ historyId, step: `execute-script-before-running-${method}` });
                const result = yield this.runScriptMethod({
                    integrationId: integration._id,
                    script,
                    method,
                    params,
                });
                this.logger.debug({
                    msg: `Script method "${method}" result of the Integration "${integration.name}" is:`,
                    result,
                });
                return result;
            }
            catch (err) {
                yield (0, updateHistory_1.updateHistory)({
                    historyId,
                    step: `execute-script-error-running-${method}`,
                    error: true,
                    errorStack: err.stack.replace(/^/gm, '  '),
                });
                this.logger.error({
                    msg: 'Error running Script in the Integration',
                    integration: integration.name,
                    err,
                });
                this.logger.debug({
                    msg: 'Error running Script in the Integration',
                    integration: integration.name,
                    script: integration.scriptCompiled,
                });
            }
        });
    }
    executeIncomingScript(integration, method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.integrationHasValidScript(integration)) {
                return;
            }
            const script = yield (0, tools_1.wrapExceptions)(() => this.getIntegrationScript(integration)).catch((e) => {
                this.logger.error(e);
                throw e;
            });
            if (!script[method]) {
                this.logger.error(`Method "${method}" not found in the Integration "${integration.name}"`);
                return;
            }
            return (0, tools_1.wrapExceptions)(() => this.runScriptMethod({
                integrationId: integration._id,
                script,
                method,
                params,
            })).catch((err) => {
                this.logger.error({
                    msg: 'Error running Script in Trigger',
                    integration: integration.name,
                    script: integration.scriptCompiled,
                    err,
                });
                throw new Error('error-running-script');
            });
        });
    }
    hasScriptAndMethod(integration, method) {
        return __awaiter(this, void 0, void 0, function* () {
            const script = yield this.getScriptSafely(integration);
            return typeof (script === null || script === void 0 ? void 0 : script[method]) === 'function';
        });
    }
    getScriptSafely(integration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.disabled || integration.scriptEnabled !== true || !integration.scriptCompiled || integration.scriptCompiled.trim() === '') {
                return;
            }
            return (0, tools_1.wrapExceptions)(() => this.getIntegrationScript(integration)).suppress();
        });
    }
}
exports.IntegrationScriptEngine = IntegrationScriptEngine;
