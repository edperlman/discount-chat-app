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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsolatedVMScriptEngine = void 0;
const tools_1 = require("@rocket.chat/tools");
const isolated_vm_1 = __importDefault(require("isolated-vm"));
const ScriptEngine_1 = require("../ScriptEngine");
const buildSandbox_1 = require("./buildSandbox");
const getCompatibilityScript_1 = require("./getCompatibilityScript");
const DISABLE_INTEGRATION_SCRIPTS = ['yes', 'true', 'ivm'].includes(String(process.env.DISABLE_INTEGRATION_SCRIPTS).toLowerCase());
class IsolatedVMScriptEngine extends ScriptEngine_1.IntegrationScriptEngine {
    isDisabled() {
        return DISABLE_INTEGRATION_SCRIPTS;
    }
    callScriptFunction(scriptReference, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            return scriptReference.applySync(undefined, params, {
                arguments: { copy: true },
                result: { copy: true, promise: true },
            });
        });
    }
    runScriptMethod(_a) {
        return __awaiter(this, arguments, void 0, function* ({ script, method, params, }) {
            const fn = script[method];
            if (typeof fn !== 'function') {
                throw new Error('integration-method-not-found');
            }
            return fn(params);
        });
    }
    getIntegrationScript(integration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.disabled) {
                throw new Error('integration-scripts-disabled');
            }
            const compiledScript = this.compiledScripts[integration._id];
            if (compiledScript && +compiledScript._updatedAt === +integration._updatedAt) {
                return compiledScript.script;
            }
            const script = integration.scriptCompiled;
            try {
                this.logger.info({ msg: 'Will evaluate the integration script', integration: (0, tools_1.pick)(integration, 'name', '_id') });
                this.logger.debug(script);
                const isolate = new isolated_vm_1.default.Isolate({ memoryLimit: 8 });
                const ivmScript = yield isolate.compileScript((0, getCompatibilityScript_1.getCompatibilityScript)(script));
                const ivmContext = isolate.createContextSync();
                (0, buildSandbox_1.buildSandbox)(ivmContext);
                const ivmResult = yield ivmScript.run(ivmContext, {
                    reference: true,
                    timeout: 3000,
                });
                const availableFunctions = yield ivmResult.get('availableFunctions', { copy: true });
                const scriptFunctions = Object.fromEntries(availableFunctions.map((functionName) => {
                    const fnReference = ivmResult.getSync(functionName, { reference: true });
                    return [functionName, (...params) => this.callScriptFunction(fnReference, ...params)];
                }));
                this.compiledScripts[integration._id] = {
                    script: scriptFunctions,
                    store: {},
                    _updatedAt: integration._updatedAt,
                };
                return scriptFunctions;
            }
            catch (err) {
                this.logger.error({
                    msg: 'Error evaluating integration script',
                    integration: integration.name,
                    script,
                    err,
                });
                throw new Error('error-evaluating-script');
            }
        });
    }
}
exports.IsolatedVMScriptEngine = IsolatedVMScriptEngine;
