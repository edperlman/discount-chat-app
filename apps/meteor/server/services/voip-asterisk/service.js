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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoipAsteriskService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const mem_1 = __importDefault(require("mem"));
const Command_1 = require("./connector/asterisk/Command");
const CommandHandler_1 = require("./connector/asterisk/CommandHandler");
const Commands_1 = require("./connector/asterisk/Commands");
const Helper_1 = require("./lib/Helper");
class VoipAsteriskService extends core_services_1.ServiceClassInternal {
    constructor(db) {
        super();
        this.name = 'voip-asterisk';
        this.active = false;
        this.logger = new logger_1.Logger('VoIPAsteriskService');
        this.commandHandler = new CommandHandler_1.CommandHandler(db);
        if (!(0, Helper_1.voipEnabled)()) {
            this.logger.warn({ msg: 'Voip is not enabled. Cant start the service' });
            return;
        }
        // Init from constructor if we already have
        // voip enabled by default while starting the server
        void this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info('Starting VoIP Asterisk service');
            if (this.active) {
                this.logger.warn({ msg: 'VoIP Asterisk service already started' });
                return;
            }
            try {
                yield this.commandHandler.initConnection(Command_1.CommandType.AMI);
                this.active = true;
                void core_services_1.api.broadcast('connector.statuschanged', true);
                this.logger.info('VoIP Asterisk service started');
            }
            catch (err) {
                this.logger.error({ msg: 'Error initializing VOIP Asterisk service', err });
            }
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info('Stopping VoIP Asterisk service');
            if (!this.active) {
                this.logger.warn({ msg: 'VoIP Asterisk service already stopped' });
                return;
            }
            try {
                this.commandHandler.stop();
                this.active = false;
                void core_services_1.api.broadcast('connector.statuschanged', false);
                this.logger.info('VoIP Asterisk service stopped');
            }
            catch (err) {
                this.logger.error({ msg: 'Error stopping VoIP Asterisk service', err });
            }
        });
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info('Restarting VoIP Asterisk service due to settings changes');
            try {
                // Disable voip service
                yield this.stop();
                // To then restart it
                yield this.init();
            }
            catch (err) {
                this.logger.error({ msg: 'Error refreshing VoIP Asterisk service', err });
            }
        });
    }
    getServerConfigData(type) {
        return (0, Helper_1.getServerConfigDataFromSettings)(type);
    }
    getQueueSummary() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.commandHandler.executeCommand(Commands_1.Commands.queue_summary);
        });
    }
    cachedQueueSummary() {
        // arbitrary 5 secs cache to prevent fetching this from asterisk too often
        return (0, mem_1.default)(this.getQueueSummary.bind(this), { maxAge: 5000 });
    }
    cachedQueueDetails() {
        return (0, mem_1.default)(this.getQueueDetails.bind(this), { maxAge: 5000 });
    }
    getQueueDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            var _d;
            const summary = yield this.cachedQueueSummary()();
            const queues = summary.result.map((q) => q.name);
            const queueInfo = [];
            try {
                for (var _e = true, queues_1 = __asyncValues(queues), queues_1_1; queues_1_1 = yield queues_1.next(), _a = queues_1_1.done, !_a; _e = true) {
                    _c = queues_1_1.value;
                    _e = false;
                    const queue = _c;
                    const queueDetails = (yield this.commandHandler.executeCommand(Commands_1.Commands.queue_details, {
                        queueName: queue,
                    }));
                    const details = queueDetails.result;
                    if (!((_d = details.members) === null || _d === void 0 ? void 0 : _d.length)) {
                        // Go to the next queue if queue does not have any
                        // memmbers.
                        continue;
                    }
                    queueInfo.push({
                        name: queue,
                        members: queueDetails.result.members.map((member) => member.name.replace('PJSIP/', '')),
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_e && !_a && (_b = queues_1.return)) yield _b.call(queues_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return queueInfo;
        });
    }
    getQueuedCallsForThisExtension(_a) {
        return __awaiter(this, arguments, void 0, function* ({ extension }) {
            var _b, e_2, _c, _d;
            const membershipDetails = {
                queueCount: 0,
                callWaitingCount: 0,
                extension,
            };
            const queueSummary = (yield this.commandHandler.executeCommand(Commands_1.Commands.queue_summary));
            try {
                for (var _e = true, _f = __asyncValues(queueSummary.result), _g; _g = yield _f.next(), _b = _g.done, !_b; _e = true) {
                    _d = _g.value;
                    _e = false;
                    const queue = _d;
                    const queueDetails = (yield this.commandHandler.executeCommand(Commands_1.Commands.queue_details, {
                        queueName: queue.name,
                    }));
                    const details = queueDetails.result;
                    if (!details.members.length) {
                        // Go to the next queue if queue does not have any
                        // memmbers.
                        continue;
                    }
                    const isAMember = details.members.some((element) => element.name.endsWith(extension));
                    if (!isAMember) {
                        // Current extension is not a member of queue in question.
                        // continue with next queue.
                        continue;
                    }
                    membershipDetails.callWaitingCount += Number(details.calls);
                    membershipDetails.queueCount++;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_e && !_b && (_c = _f.return)) yield _c.call(_f);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return { result: membershipDetails };
        });
    }
    getQueueMembership(_a) {
        return __awaiter(this, arguments, void 0, function* ({ extension }) {
            var _b, e_3, _c, _d;
            var _e;
            const membershipDetails = {
                queues: [],
                extension,
            };
            const queueSummary = (yield this.commandHandler.executeCommand(Commands_1.Commands.queue_summary));
            try {
                for (var _f = true, _g = __asyncValues(queueSummary.result), _h; _h = yield _g.next(), _b = _h.done, !_b; _f = true) {
                    _d = _h.value;
                    _f = false;
                    const queue = _d;
                    const queueDetails = (yield this.commandHandler.executeCommand(Commands_1.Commands.queue_details, {
                        queueName: queue.name,
                    }));
                    const details = queueDetails.result;
                    if (!((_e = details.members) === null || _e === void 0 ? void 0 : _e.length)) {
                        // Go to the next queue if queue does not have any
                        // memmbers.
                        continue;
                    }
                    const isAMember = details.members.some((element) => element.name.endsWith(extension));
                    if (!isAMember) {
                        // Current extension is not a member of queue in question.
                        // continue with next queue.
                        continue;
                    }
                    membershipDetails.queues.push(queue);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_f && !_b && (_c = _g.return)) yield _c.call(_g);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return { result: membershipDetails };
        });
    }
    getConnectorVersion() {
        return this.commandHandler.getVersion();
    }
    getExtensionList() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.commandHandler.executeCommand(Commands_1.Commands.extension_list, undefined);
        });
    }
    getExtensionDetails(requestParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.commandHandler.executeCommand(Commands_1.Commands.extension_info, requestParams);
        });
    }
    getRegistrationInfo(requestParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = this.getServerConfigData(core_typings_1.ServerType.CALL_SERVER);
            if (!config) {
                this.logger.warn({ msg: 'API = connector.extension.getRegistrationInfo callserver settings not found' });
                this.logger.warn('Check call server settings, without them you wont be be able to send/receive calls on RocketChat');
                throw new Error('Not found');
            }
            const endpointDetails = yield this.commandHandler.executeCommand(Commands_1.Commands.extension_info, requestParams);
            if (!(0, core_typings_1.isIExtensionDetails)(endpointDetails.result)) {
                throw new Error('getRegistrationInfo Invalid endpointDetails response');
            }
            if (!(0, core_typings_1.isICallServerConfigData)(config.configData)) {
                throw new Error('getRegistrationInfo Invalid configData response');
            }
            const result = {
                callServerConfig: config.configData,
                extensionDetails: endpointDetails.result,
            };
            return {
                result,
            };
        });
    }
    checkManagementConnection(host, port, userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug('Checking management server connection');
            return this.commandHandler.checkManagementConnection(host, port, userName, password);
        });
    }
    checkCallserverConnection(websocketUrl, protocol) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug('Checking call server connection');
            return this.commandHandler.checkCallserverConnection(websocketUrl, protocol);
        });
    }
}
exports.VoipAsteriskService = VoipAsteriskService;
