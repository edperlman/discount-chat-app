"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const accounts_base_1 = require("meteor/accounts-base");
const stringUtils_1 = require("../../../lib/utils/stringUtils");
const i18n_1 = require("../../../server/lib/i18n");
const server_1 = require("../../settings/server");
const MessageTypes_1 = require("../lib/MessageTypes");
exports.Message = {
    parse(msg, language) {
        const messageType = MessageTypes_1.MessageTypes.getType(msg);
        if (messageType) {
            if (messageType.template) {
                // Render message
                return;
            }
            if (messageType.message) {
                if (!language) {
                    language = accounts_base_1.Accounts.storageLocation.getItem('userLanguage') || 'en';
                }
                const data = (typeof messageType.data === 'function' && messageType.data(msg)) || {};
                return i18n_1.i18n.t(messageType.message, Object.assign(Object.assign({}, data), { lng: language }));
            }
        }
        if (msg.u && msg.u.username === server_1.settings.get('Chatops_Username')) {
            msg.html = msg.msg;
            return msg.html;
        }
        msg.html = msg.msg;
        if ((0, stringUtils_1.trim)(msg.html) !== '') {
            msg.html = (0, string_helpers_1.escapeHTML)(msg.html);
        }
        msg.html = msg.html.replace(/\n/gm, '<br/>');
        return msg.html;
    },
};
