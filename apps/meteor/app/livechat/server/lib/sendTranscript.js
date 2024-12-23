"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.sendTranscript = sendTranscript;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const colors_1 = __importDefault(require("@rocket.chat/fuselage-tokens/colors"));
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const callbacks_1 = require("../../../../lib/callbacks");
const i18n_1 = require("../../../../server/lib/i18n");
const server_1 = require("../../../file-upload/server");
const Mailer = __importStar(require("../../../mailer/server/api"));
const server_2 = require("../../../settings/server");
const MessageTypes_1 = require("../../../ui-utils/lib/MessageTypes");
const getTimezone_1 = require("../../../utils/server/lib/getTimezone");
const logger = new logger_1.Logger('Livechat-SendTranscript');
function sendTranscript(_a) {
    return __awaiter(this, arguments, void 0, function* ({ token, rid, email, subject, user, }) {
        var _b, e_1, _c, _d, _e, e_2, _f, _g;
        var _h, _j;
        (0, check_1.check)(rid, String);
        (0, check_1.check)(email, String);
        logger.debug(`Sending conversation transcript of room ${rid} to user with token ${token}`);
        const room = yield models_1.LivechatRooms.findOneById(rid);
        const visitor = room === null || room === void 0 ? void 0 : room.v;
        if (token !== (visitor === null || visitor === void 0 ? void 0 : visitor.token)) {
            throw new Error('error-invalid-visitor');
        }
        const userLanguage = server_2.settings.get('Language') || 'en';
        const timezone = (0, getTimezone_1.getTimezone)(user);
        logger.debug(`Transcript will be sent using ${timezone} as timezone`);
        if (!room) {
            throw new Error('error-invalid-room');
        }
        // allow to only user to send transcripts from their own chats
        if (room.t !== 'l') {
            throw new Error('error-invalid-room');
        }
        const showAgentInfo = server_2.settings.get('Livechat_show_agent_info');
        const showSystemMessages = server_2.settings.get('Livechat_transcript_show_system_messages');
        const closingMessage = yield models_1.Messages.findLivechatClosingMessage(rid, { projection: { ts: 1 } });
        const ignoredMessageTypes = [
            'livechat_navigation_history',
            'livechat_transcript_history',
            'command',
            'livechat-close',
            'livechat-started',
            'livechat_video_call',
            'omnichannel_priority_change_history',
        ];
        const acceptableImageMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const messages = yield models_1.Messages.findVisibleByRoomIdNotContainingTypesBeforeTs(rid, ignoredMessageTypes, (closingMessage === null || closingMessage === void 0 ? void 0 : closingMessage.ts) ? new Date(closingMessage.ts) : new Date(), showSystemMessages, {
            sort: { ts: 1 },
        });
        let html = '<div> <hr>';
        const InvalidFileMessage = `<div style="background-color: ${colors_1.default.n100}; text-align: center; border-color: ${colors_1.default.n250}; border-width: 1px; border-style: solid; border-radius: 4px; padding-top: 8px; padding-bottom: 8px; margin-top: 4px;">${i18n_1.i18n.t('This_attachment_is_not_supported', { lng: userLanguage })}</div>`;
        try {
            for (var _k = true, messages_1 = __asyncValues(messages), messages_1_1; messages_1_1 = yield messages_1.next(), _b = messages_1_1.done, !_b; _k = true) {
                _d = messages_1_1.value;
                _k = false;
                const message = _d;
                let author;
                if (message.u._id === visitor._id) {
                    author = i18n_1.i18n.t('You', { lng: userLanguage });
                }
                else {
                    author = showAgentInfo ? message.u.name || message.u.username : i18n_1.i18n.t('Agent', { lng: userLanguage });
                }
                const isSystemMessage = MessageTypes_1.MessageTypes.isSystemMessage(message);
                const messageType = isSystemMessage && MessageTypes_1.MessageTypes.getType(message);
                let messageContent = messageType
                    ? `<i>${i18n_1.i18n.t(messageType.message, messageType.data
                        ? Object.assign(Object.assign({}, messageType.data(message)), { interpolation: { escapeValue: false } }) : { interpolation: { escapeValue: false } })}</i>`
                    : message.msg;
                let filesHTML = '';
                if (message.attachments && ((_h = message.attachments) === null || _h === void 0 ? void 0 : _h.length) > 0) {
                    messageContent = message.attachments[0].description || '';
                    try {
                        for (var _l = true, _m = (e_2 = void 0, __asyncValues(message.attachments)), _o; _o = yield _m.next(), _e = _o.done, !_e; _l = true) {
                            _g = _o.value;
                            _l = false;
                            const attachment = _g;
                            if (!(0, core_typings_1.isFileAttachment)(attachment)) {
                                // ignore other types of attachments
                                continue;
                            }
                            if (!(0, core_typings_1.isFileImageAttachment)(attachment)) {
                                filesHTML += `<div>${attachment.title || ''}${InvalidFileMessage}</div>`;
                                continue;
                            }
                            if (!attachment.image_type || !acceptableImageMimeTypes.includes(attachment.image_type)) {
                                filesHTML += `<div>${attachment.title || ''}${InvalidFileMessage}</div>`;
                                continue;
                            }
                            // Image attachment can be rendered in email body
                            const file = (_j = message.files) === null || _j === void 0 ? void 0 : _j.find((file) => file.name === attachment.title);
                            if (!file) {
                                filesHTML += `<div>${attachment.title || ''}${InvalidFileMessage}</div>`;
                                continue;
                            }
                            const uploadedFile = yield models_1.Uploads.findOneById(file._id);
                            if (!uploadedFile) {
                                filesHTML += `<div>${file.name}${InvalidFileMessage}</div>`;
                                continue;
                            }
                            const uploadedFileBuffer = yield server_1.FileUpload.getBuffer(uploadedFile);
                            filesHTML += `<div styles="color: ${colors_1.default.n700}; margin-top: 4px; flex-direction: "column";"><p>${file.name}</p><img src="data:${attachment.image_type};base64,${uploadedFileBuffer.toString('base64')}" style="width: 400px; max-height: 240px; object-fit: contain; object-position: 0;"/></div>`;
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (!_l && !_e && (_f = _m.return)) yield _f.call(_m);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                const datetime = moment_timezone_1.default.tz(message.ts, timezone).locale(userLanguage).format('LLL');
                const singleMessage = `
			<p><strong>${author}</strong>  <em>${datetime}</em></p>
			<p>${messageContent}</p>
			<p>${filesHTML}</p>
		`;
                html += singleMessage;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_k && !_b && (_c = messages_1.return)) yield _c.call(messages_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        html = `${html}</div>`;
        const fromEmail = server_2.settings.get('From_Email').match(/\b[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}\b/i);
        let emailFromRegexp = '';
        if (fromEmail) {
            emailFromRegexp = fromEmail[0];
        }
        else {
            emailFromRegexp = server_2.settings.get('From_Email');
        }
        // Some endpoints allow the caller to pass a different `subject` via parameter.
        // IF subject is passed, we'll use that one and treat it as an override
        // IF no subject is passed, we fallback to the setting `Livechat_transcript_email_subject`
        // IF that is not configured, we fallback to 'Transcript of your livechat conversation', which is the default value
        // As subject and setting value are user input, we don't translate them
        const mailSubject = subject ||
            server_2.settings.get('Livechat_transcript_email_subject') ||
            i18n_1.i18n.t('Transcript_of_your_livechat_conversation', { lng: userLanguage });
        yield Mailer.send({
            to: email,
            from: emailFromRegexp,
            replyTo: emailFromRegexp,
            subject: mailSubject,
            html,
        });
        setImmediate(() => {
            void callbacks_1.callbacks.run('livechat.sendTranscript', messages, email);
        });
        const requestData = {
            type: 'user',
            visitor,
            user,
        };
        if (!(user === null || user === void 0 ? void 0 : user.username)) {
            const cat = yield models_1.Users.findOneById('rocket.cat', { projection: { _id: 1, username: 1, name: 1 } });
            if (cat) {
                requestData.user = cat;
                requestData.type = 'visitor';
            }
        }
        if (!requestData.user) {
            logger.error('rocket.cat user not found');
            throw new Error('No user provided and rocket.cat not found');
        }
        yield core_services_1.Message.saveSystemMessage('livechat_transcript_history', room._id, '', requestData.user, {
            requestData,
        });
        return true;
    });
}
