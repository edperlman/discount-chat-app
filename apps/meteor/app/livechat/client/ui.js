"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../ui-utils/client");
client_1.MessageTypes.registerType({
    id: 'livechat-close',
    system: true,
    message: 'Conversation_closed',
    data(message) {
        return {
            comment: message.msg,
        };
    },
});
client_1.MessageTypes.registerType({
    id: 'livechat-started',
    system: true,
    message: 'Chat_started',
});
