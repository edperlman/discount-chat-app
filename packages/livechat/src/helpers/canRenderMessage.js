"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canRenderMessage = exports.getHiddenSystemMessages = void 0;
const constants_1 = require("../components/Messages/constants");
const store_1 = __importDefault(require("../store"));
const msgTypesNotRendered = [
    constants_1.MESSAGE_TYPE_WELCOME,
    constants_1.MESSAGE_TYPE_ROOM_NAME_CHANGED,
    constants_1.MESSAGE_TYPE_USER_ADDED,
    constants_1.MESSAGE_TYPE_USER_REMOVED,
    constants_1.MESSAGE_VIDEO_CALL,
    constants_1.MESSAGE_WEBRTC_CALL,
    constants_1.MESSAGE_TYPE_LIVECHAT_NAVIGATION_HISTORY,
    constants_1.MESSAGE_TYPE_COMMAND,
    constants_1.MESSAGE_TYPE_PRIORITY_CHANGE,
    constants_1.MESSAGE_TYPE_SLA_CHANGE,
];
const getHiddenSystemMessages = () => {
    const { config, iframe } = store_1.default.state;
    const configHiddenSystemMessages = (config === null || config === void 0 ? void 0 : config.settings.hiddenSystemMessages) || [];
    const localHiddenSystemMessages = (iframe === null || iframe === void 0 ? void 0 : iframe.hiddenSystemMessages) || [];
    return [...configHiddenSystemMessages, ...localHiddenSystemMessages];
};
exports.getHiddenSystemMessages = getHiddenSystemMessages;
const canRenderMessage = ({ t }) => {
    const hiddenSystemMessages = (0, exports.getHiddenSystemMessages)();
    return !msgTypesNotRendered.includes(t) && !hiddenSystemMessages.includes(t);
};
exports.canRenderMessage = canRenderMessage;
