"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldHideSystemMessage = exports.isMutedUnmuted = void 0;
const isMutedUnmuted = (messageType) => {
    return messageType === 'user-muted' || messageType === 'user-unmuted';
};
exports.isMutedUnmuted = isMutedUnmuted;
const shouldHideSystemMessage = (messageType, hideSystemMessage) => {
    if (!(hideSystemMessage === null || hideSystemMessage === void 0 ? void 0 : hideSystemMessage.length)) {
        return false;
    }
    return hideSystemMessage.includes(messageType) || ((0, exports.isMutedUnmuted)(messageType) && hideSystemMessage.includes('mute_unmute'));
};
exports.shouldHideSystemMessage = shouldHideSystemMessage;
