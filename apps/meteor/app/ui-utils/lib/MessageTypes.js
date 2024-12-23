"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageTypes = void 0;
class MessageTypes {
    constructor() {
        this.types = new Map();
    }
    registerType(options) {
        if ('render' in options) {
            console.warn('MessageType.render is deprecated. Use MessageType.message instead.', options.id);
        }
        if ('template' in options) {
            console.warn('MessageType.template is deprecated. Use MessageType.message instead.', options.id);
        }
        this.types.set(options.id, options);
        return options;
    }
    getType(message) {
        return message.t && this.types.get(message.t);
    }
    isSystemMessage(message) {
        const type = this.getType(message);
        return Boolean(type === null || type === void 0 ? void 0 : type.system);
    }
}
const instance = new MessageTypes();
exports.MessageTypes = instance;
