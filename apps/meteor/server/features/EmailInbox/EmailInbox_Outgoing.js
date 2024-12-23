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
exports.sendTestEmailToInbox = sendTestEmailToInbox;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const EmailInbox_1 = require("./EmailInbox");
const logger_1 = require("./logger");
const server_1 = require("../../../app/file-upload/server");
const sendMessage_1 = require("../../../app/lib/server/functions/sendMessage");
const notifyListener_1 = require("../../../app/lib/server/lib/notifyListener");
const server_2 = require("../../../app/settings/server");
const slashCommand_1 = require("../../../app/utils/server/slashCommand");
const callbacks_1 = require("../../../lib/callbacks");
const i18n_1 = require("../../lib/i18n");
const livechatQuoteRegExp = /^\[\s\]\(https?:\/\/.+\/live\/.+\?msg=(?<id>.+?)\)\s(?<text>.+)/s;
const getRocketCatUser = () => __awaiter(void 0, void 0, void 0, function* () { return models_1.Users.findOneById('rocket.cat'); });
const language = server_2.settings.get('Language') || 'en';
const t = i18n_1.i18n.getFixedT(language);
// TODO: change these messages with room notifications
const sendErrorReplyMessage = (error, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(options === null || options === void 0 ? void 0 : options.rid) || !(options === null || options === void 0 ? void 0 : options.msgId)) {
        return;
    }
    const message = {
        groupable: false,
        msg: `@${options.sender} something went wrong when replying email, sorry. **Error:**: ${error}`,
        _id: String(Date.now()),
        rid: options.rid,
        ts: new Date(),
    };
    const user = yield getRocketCatUser();
    if (!user) {
        return;
    }
    return (0, sendMessage_1.sendMessage)(user, message, { _id: options.rid });
});
const sendSuccessReplyMessage = (options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = options === null || options === void 0 ? void 0 : options.room) === null || _a === void 0 ? void 0 : _a._id) || !(options === null || options === void 0 ? void 0 : options.msgId)) {
        return;
    }
    const message = {
        groupable: false,
        msg: `@${options.sender} Attachment was sent successfully`,
        _id: String(Date.now()),
        rid: options.room._id,
        ts: new Date(),
    };
    const user = yield getRocketCatUser();
    if (!user) {
        return;
    }
    return (0, sendMessage_1.sendMessage)(user, message, options.room);
});
function sendEmail(inbox, mail, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return inbox.smtp
            .sendMail(Object.assign({ from: inbox.config.senderInfo
                ? {
                    name: inbox.config.senderInfo,
                    address: inbox.config.email,
                }
                : inbox.config.email }, mail))
            .then((info) => {
            logger_1.logger.info({ msg: 'Message sent', info });
            return info;
        })
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.error({ msg: 'Error sending Email reply', err });
            if (!(options === null || options === void 0 ? void 0 : options.msgId)) {
                return;
            }
            yield sendErrorReplyMessage(err.message, options);
        }));
    });
}
slashCommand_1.slashCommands.add({
    command: 'sendEmailAttachment',
    callback: (_a) => __awaiter(void 0, [_a], void 0, function* ({ command, params }) {
        var _b, _c, _d, _e, _f, _g, _h;
        if (command !== 'sendEmailAttachment' || !check_1.Match.test(params, String)) {
            return;
        }
        const message = yield models_1.Messages.findOneById(params.trim());
        if (!(message === null || message === void 0 ? void 0 : message.file)) {
            return;
        }
        const room = yield models_1.Rooms.findOneById(message.rid);
        if (!(room === null || room === void 0 ? void 0 : room.email)) {
            return;
        }
        const inbox = EmailInbox_1.inboxes.get(room.email.inbox);
        if (!inbox) {
            return sendErrorReplyMessage(`Email inbox ${room.email.inbox} not found or disabled.`, {
                msgId: message._id,
                sender: message.u.username,
                rid: room._id,
            });
        }
        const file = yield models_1.Uploads.findOneById(message.file._id);
        if (!file) {
            return;
        }
        const buffer = yield server_1.FileUpload.getBuffer(file);
        if (buffer) {
            void sendEmail(inbox, {
                to: (_b = room.email) === null || _b === void 0 ? void 0 : _b.replyTo,
                subject: (_c = room.email) === null || _c === void 0 ? void 0 : _c.subject,
                text: ((_d = message === null || message === void 0 ? void 0 : message.attachments) === null || _d === void 0 ? void 0 : _d[0].description) || '',
                attachments: [
                    {
                        content: buffer,
                        contentType: file.type,
                        filename: file.name,
                    },
                ],
                inReplyTo: Array.isArray((_e = room.email) === null || _e === void 0 ? void 0 : _e.thread) ? (_f = room.email) === null || _f === void 0 ? void 0 : _f.thread[0] : (_g = room.email) === null || _g === void 0 ? void 0 : _g.thread,
                references: [].concat(((_h = room.email) === null || _h === void 0 ? void 0 : _h.thread) || []),
            }, {
                msgId: message._id,
                sender: message.u.username,
                rid: message.rid,
            }).then((info) => models_1.LivechatRooms.updateEmailThreadByRoomId(room._id, info.messageId));
        }
        yield models_1.Messages.updateOne({ _id: message._id }, {
            $set: {
                blocks: [
                    {
                        type: 'context',
                        elements: [
                            {
                                type: 'mrkdwn',
                                text: `**${t('To')}:** ${room.email.replyTo}\n**${t('Subject')}:** ${room.email.subject}`,
                            },
                        ],
                    },
                ],
            },
            $pull: {
                attachments: { 'actions.0.type': 'button' },
            },
        });
        void (0, notifyListener_1.notifyOnMessageChange)({
            id: message._id,
        });
        return sendSuccessReplyMessage({
            msgId: message._id,
            sender: message.u.username,
            room,
        });
    }),
    options: {
        description: 'Send attachment as email',
        params: 'msg_id',
    },
    providesPreview: false,
});
callbacks_1.callbacks.add('afterSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room: omnichannelRoom }) {
    var _b, _c, _d, _e;
    const room = omnichannelRoom;
    if (!((_b = room === null || room === void 0 ? void 0 : room.email) === null || _b === void 0 ? void 0 : _b.inbox)) {
        return message;
    }
    const user = yield getRocketCatUser();
    if (!user) {
        return message;
    }
    if (((_c = message.files) === null || _c === void 0 ? void 0 : _c.length) && message.u.username !== 'rocket.cat') {
        yield (0, sendMessage_1.sendMessage)(user, {
            msg: '',
            attachments: [
                {
                    actions: [
                        {
                            type: 'button',
                            text: t('Send_via_Email_as_attachment'),
                            msg: `/sendEmailAttachment ${message._id}`,
                            msg_in_chat_window: true,
                            msg_processing_type: 'sendMessage',
                        },
                    ],
                },
            ],
        }, room, true);
        return message;
    }
    const { msg } = message;
    // Try to identify a quote in a livechat room
    const match = msg.match(livechatQuoteRegExp);
    if (!(match === null || match === void 0 ? void 0 : match.groups)) {
        return message;
    }
    const inbox = EmailInbox_1.inboxes.get(room.email.inbox);
    if (!inbox) {
        yield sendErrorReplyMessage(`Email inbox ${room.email.inbox} not found or disabled.`, {
            msgId: message._id,
            sender: message.u.username,
            rid: room._id,
        });
        return message;
    }
    if (!inbox) {
        return message;
    }
    const replyToMessage = yield models_1.Messages.findOneById(match.groups.id);
    if (!replyToMessage || !(0, core_typings_1.isIMessageInbox)(replyToMessage) || !((_d = replyToMessage.email) === null || _d === void 0 ? void 0 : _d.messageId)) {
        return message;
    }
    void sendEmail(inbox, {
        text: match.groups.text,
        inReplyTo: replyToMessage.email.messageId,
        references: [...((_e = replyToMessage.email.references) !== null && _e !== void 0 ? _e : []), replyToMessage.email.messageId],
        to: room.email.replyTo,
        subject: room.email.subject,
    }, {
        msgId: message._id,
        sender: message.u.username,
        rid: room._id,
    }).then((info) => models_1.LivechatRooms.updateEmailThreadByRoomId(room._id, info.messageId));
    message.msg = match.groups.text;
    message.groupable = false;
    message.blocks = [
        {
            type: 'context',
            elements: [
                {
                    type: 'mrkdwn',
                    text: `**${t('To')}:** ${room.email.replyTo}\n**${t('Subject')}:** ${room.email.subject}`,
                },
            ],
        },
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: message.msg,
            },
        },
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `> ---\n${replyToMessage.msg.replace(/^/gm, '> ')}`,
            },
        },
    ];
    delete message.urls;
    return message;
}), callbacks_1.callbacks.priority.LOW, 'ReplyEmail');
function sendTestEmailToInbox(emailInboxRecord, user) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const inbox = EmailInbox_1.inboxes.get(emailInboxRecord.email);
        if (!inbox) {
            throw new Error('inbox-not-found');
        }
        const address = (_b = (_a = user.emails) === null || _a === void 0 ? void 0 : _a.find((email) => email.verified)) === null || _b === void 0 ? void 0 : _b.address;
        if (!address) {
            throw new Error('user-without-verified-email');
        }
        void sendEmail(inbox, {
            to: address,
            subject: 'Test of inbox configuration',
            text: 'Test of inbox configuration successful',
        });
    });
}
