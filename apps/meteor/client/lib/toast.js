"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToToastMessages = exports.dispatchToastMessage = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const emitter = new emitter_1.Emitter();
const dispatchToastMessage = (payload) => {
    // TODO: buffer it if there is no subscriber
    emitter.emit('notify', payload);
};
exports.dispatchToastMessage = dispatchToastMessage;
const subscribeToToastMessages = (callback) => emitter.on('notify', callback);
exports.subscribeToToastMessages = subscribeToToastMessages;
