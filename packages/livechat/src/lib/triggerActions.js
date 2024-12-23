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
exports.actions = exports.sendMessageExternalServiceAction = exports.sendMessageAction = void 0;
const preact_router_1 = require("preact-router");
const store_1 = __importDefault(require("../store"));
const api_1 = require("./api");
const parentCall_1 = require("./parentCall");
const random_1 = require("./random");
const triggerUtils_1 = require("./triggerUtils");
const triggers_1 = __importDefault(require("./triggers"));
const sendMessageAction = (_, action, condition) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { token, minimized } = store_1.default.state;
    const agent = yield (0, triggerUtils_1.getAgent)(action);
    const message = {
        msg: (_a = action.params) === null || _a === void 0 ? void 0 : _a.msg,
        token,
        u: agent,
        ts: new Date().toISOString(),
        _id: (0, random_1.createToken)(),
        trigger: true,
    };
    yield (0, triggerUtils_1.upsertMessage)(message);
    // Save the triggers for subsequent renders
    if (condition.name === 'after-guest-registration') {
        store_1.default.setState({
            renderedTriggers: [...store_1.default.state.renderedTriggers, message],
        });
    }
    if (agent && '_id' in agent) {
        yield store_1.default.setState({ agent });
        (0, parentCall_1.parentCall)('callback', 'assign-agent', (0, api_1.normalizeAgent)(agent));
    }
    if (minimized) {
        (0, preact_router_1.route)('/trigger-messages');
        store_1.default.setState({ minimized: false });
    }
    if (condition.name !== 'after-guest-registration') {
        const onVisitorRegistered = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield (0, triggerUtils_1.removeMessage)(message._id);
            (_a = triggers_1.default.callbacks) === null || _a === void 0 ? void 0 : _a.off('chat-visitor-registered', onVisitorRegistered);
        });
        (_b = triggers_1.default.callbacks) === null || _b === void 0 ? void 0 : _b.on('chat-visitor-registered', onVisitorRegistered);
    }
});
exports.sendMessageAction = sendMessageAction;
const sendMessageExternalServiceAction = (triggerId, action, condition) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { token, minimized, typing, iframe } = store_1.default.state;
    const metadata = iframe.guestMetadata || {};
    const agent = yield (0, triggerUtils_1.getAgent)(action);
    if (agent === null || agent === void 0 ? void 0 : agent.username) {
        store_1.default.setState({ typing: [...typing, agent.username] });
    }
    try {
        const { serviceFallbackMessage: fallbackMessage } = action.params || {};
        const triggerMessages = yield (0, triggerUtils_1.requestTriggerMessages)({
            token,
            triggerId,
            metadata,
            fallbackMessage,
        });
        const messages = triggerMessages
            .sort((a, b) => a.order - b.order)
            .map((item) => item.msg)
            .map((msg) => ({
            msg,
            token,
            u: agent,
            ts: new Date().toISOString(),
            _id: (0, random_1.createToken)(),
            trigger: true,
        }));
        yield Promise.all(messages.map((message) => {
            if (condition.name === 'after-guest-registration') {
                store_1.default.setState({
                    renderedTriggers: [...store_1.default.state.renderedTriggers, message],
                });
            }
            return (0, triggerUtils_1.upsertMessage)(message);
        }));
        if (agent && '_id' in agent) {
            yield store_1.default.setState({ agent });
            (0, parentCall_1.parentCall)('callback', 'assign-agent', (0, api_1.normalizeAgent)(agent));
        }
        if (minimized) {
            (0, preact_router_1.route)('/trigger-messages');
            store_1.default.setState({ minimized: false });
        }
        if (condition.name !== 'after-guest-registration') {
            const onVisitorRegistered = () => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                yield Promise.all(messages.map((message) => (0, triggerUtils_1.removeMessage)(message._id)));
                (_a = triggers_1.default.callbacks) === null || _a === void 0 ? void 0 : _a.off('chat-visitor-registered', onVisitorRegistered);
            });
            (_a = triggers_1.default.callbacks) === null || _a === void 0 ? void 0 : _a.on('chat-visitor-registered', onVisitorRegistered);
        }
    }
    finally {
        store_1.default.setState({
            typing: store_1.default.state.typing.filter((u) => u !== (agent === null || agent === void 0 ? void 0 : agent.username)),
        });
    }
});
exports.sendMessageExternalServiceAction = sendMessageExternalServiceAction;
exports.actions = {
    'send-message': exports.sendMessageAction,
    'use-external-service': exports.sendMessageExternalServiceAction,
};
