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
exports.requestTriggerMessages = exports.isInIframe = exports.hasTriggerCondition = exports.removeTriggerMessage = exports.removeMessage = exports.upsertMessage = exports.getAgent = void 0;
const api_1 = require("../api");
const upsert_1 = require("../helpers/upsert");
const store_1 = __importDefault(require("../store"));
const main_1 = require("./main");
let agentPromise = null;
const agentCacheExpiry = 3600000;
const isAgentWithInfo = (agent) => !agent.hiddenInfo;
const getNextAgentFromQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    const { defaultAgent, iframe: { defaultDepartment, guest: { department } = {} }, } = store_1.default.state;
    if ((defaultAgent === null || defaultAgent === void 0 ? void 0 : defaultAgent.ts) && Date.now() - defaultAgent.ts < agentCacheExpiry) {
        return defaultAgent; // cache valid for 1 hour
    }
    const dep = department || defaultDepartment;
    let agent = null;
    try {
        const tempAgent = yield api_1.Livechat.nextAgent({ department: dep });
        if (isAgentWithInfo(tempAgent === null || tempAgent === void 0 ? void 0 : tempAgent.agent)) {
            agent = tempAgent.agent;
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
    store_1.default.setState({ defaultAgent: Object.assign(Object.assign({}, agent), { department: dep, ts: Date.now() }) });
    return agent;
});
const getAgent = (triggerAction) => __awaiter(void 0, void 0, void 0, function* () {
    if (agentPromise) {
        return agentPromise;
    }
    agentPromise = new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const { sender, name = '' } = triggerAction.params || {};
        if (sender === 'custom') {
            resolve({ username: name });
        }
        if (sender === 'queue') {
            try {
                const agent = yield getNextAgentFromQueue();
                resolve(agent);
            }
            catch (_) {
                resolve({ username: 'rocket.cat' });
            }
        }
        return reject('Unknown sender type.');
    }));
    // expire the promise cache as well
    setTimeout(() => {
        agentPromise = null;
    }, agentCacheExpiry);
    return agentPromise;
});
exports.getAgent = getAgent;
const upsertMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    yield store_1.default.setState({
        messages: (0, upsert_1.upsert)(store_1.default.state.messages, message, ({ _id }) => _id === message._id, ({ ts }) => new Date(ts).getTime()),
    });
    yield (0, main_1.processUnread)();
});
exports.upsertMessage = upsertMessage;
const removeMessage = (messageId) => __awaiter(void 0, void 0, void 0, function* () {
    const { messages } = store_1.default.state;
    yield store_1.default.setState({ messages: messages.filter(({ _id }) => _id !== messageId) });
});
exports.removeMessage = removeMessage;
const removeTriggerMessage = (messageId) => __awaiter(void 0, void 0, void 0, function* () {
    const { renderedTriggers } = store_1.default.state;
    yield store_1.default.setState({ renderedTriggers: renderedTriggers.filter(({ _id }) => _id !== messageId) });
});
exports.removeTriggerMessage = removeTriggerMessage;
const hasTriggerCondition = (conditionName) => (trigger) => {
    return trigger.conditions.some((condition) => condition.name === conditionName);
};
exports.hasTriggerCondition = hasTriggerCondition;
const isInIframe = () => window.self !== window.top;
exports.isInIframe = isInIframe;
const requestTriggerMessages = (_a) => __awaiter(void 0, [_a], void 0, function* ({ triggerId, token, metadata = {}, fallbackMessage, }) {
    try {
        const extraData = Object.entries(metadata).reduce((acc, [key, value]) => [...acc, { key, value }], []);
        const { response } = yield api_1.Livechat.rest.post(`/v1/livechat/triggers/${triggerId}/external-service/call`, { extraData, token });
        return response.contents;
    }
    catch (_) {
        if (!fallbackMessage) {
            throw Error('Unable to fetch message from external service.');
        }
        return [{ msg: fallbackMessage, order: 0 }];
    }
});
exports.requestTriggerMessages = requestTriggerMessages;
