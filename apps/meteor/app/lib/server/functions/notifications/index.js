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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMessageTextPerUser = parseMessageTextPerUser;
exports.replaceMentionedUsernamesWithFullNames = replaceMentionedUsernamesWithFullNames;
const core_typings_1 = require("@rocket.chat/core-typings");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const callbacks_1 = require("../../../../../lib/callbacks");
const i18n_1 = require("../../../../../server/lib/i18n");
const server_1 = require("../../../../settings/server");
/**
 * This function returns a string ready to be shown in the notification
 *
 * @param {object} message the message to be parsed
 */
function parseMessageTextPerUser(messageText, message, receiver) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const lng = receiver.language || server_1.settings.get('Language') || 'en';
        const firstAttachment = (_a = message.attachments) === null || _a === void 0 ? void 0 : _a[0];
        if (!message.msg && firstAttachment && (0, core_typings_1.isFileAttachment)(firstAttachment) && (0, core_typings_1.isFileImageAttachment)(firstAttachment)) {
            return firstAttachment.image_type ? i18n_1.i18n.t('User_uploaded_image', { lng }) : i18n_1.i18n.t('User_uploaded_file', { lng });
        }
        if (message.msg && message.t === 'e2e') {
            return i18n_1.i18n.t('Encrypted_message', { lng });
        }
        // perform processing required before sending message as notification such as markdown filtering
        return callbacks_1.callbacks.run('renderNotification', messageText);
    });
}
/**
 * Replaces @username with full name
 *
 * @param {string} message The message to replace
 * @param {object[]} mentions Array of mentions used to make replacements
 *
 * @returns {string}
 */
function replaceMentionedUsernamesWithFullNames(message, mentions) {
    mentions.forEach((mention) => {
        if (mention.name) {
            message = message.replace(new RegExp((0, string_helpers_1.escapeRegExp)(`@${mention.username}`), 'g'), mention.name);
        }
    });
    return message;
}
