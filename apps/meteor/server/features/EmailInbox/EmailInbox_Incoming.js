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
exports.onEmailReceived = onEmailReceived;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const string_strip_html_1 = __importDefault(require("string-strip-html"));
const logger_1 = require("./logger");
const server_1 = require("../../../app/file-upload/server");
const notifyListener_1 = require("../../../app/lib/server/lib/notifyListener");
const LivechatTyped_1 = require("../../../app/livechat/server/lib/LivechatTyped");
const QueueManager_1 = require("../../../app/livechat/server/lib/QueueManager");
const departmentsLib_1 = require("../../../app/livechat/server/lib/departmentsLib");
const server_2 = require("../../../app/settings/server");
const i18n_1 = require("../../lib/i18n");
const language = server_2.settings.get('Language') || 'en';
const t = i18n_1.i18n.getFixedT(language);
function getGuestByEmail(email_1, name_1) {
    return __awaiter(this, arguments, void 0, function* (email, name, department = '') {
        const guest = yield models_1.LivechatVisitors.findOneGuestByEmailAddress(email);
        if (guest) {
            if (guest.department !== department) {
                if (!department) {
                    yield models_1.LivechatVisitors.removeDepartmentById(guest._id);
                    delete guest.department;
                    return guest;
                }
                yield (0, departmentsLib_1.setDepartmentForGuest)({ token: guest.token, department });
                return models_1.LivechatVisitors.findOneEnabledById(guest._id, {});
            }
            return guest;
        }
        const livechatVisitor = yield LivechatTyped_1.Livechat.registerGuest({
            token: random_1.Random.id(),
            name: name || email,
            email,
            department,
        });
        if (!livechatVisitor) {
            throw new Error('Error getting guest');
        }
        return livechatVisitor;
    });
}
function uploadAttachment(attachmentParam, rid, visitorToken) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const details = {
            name: attachmentParam.filename,
            size: attachmentParam.size,
            type: attachmentParam.contentType,
            rid,
            visitorToken,
        };
        const fileStore = server_1.FileUpload.getStore('Uploads');
        const file = yield fileStore.insert(details, attachmentParam.content);
        const url = server_1.FileUpload.getPath(`${file._id}/${encodeURI(file.name || '')}`);
        const attachment = {
            title: file.name || '',
            title_link: url,
        };
        if (file.type && /^image\/.+/.test(file.type)) {
            attachment.image_url = url;
            attachment.image_type = file.type;
            attachment.image_size = file.size;
            attachment.image_dimensions = ((_a = file.identify) === null || _a === void 0 ? void 0 : _a.size) != null ? file.identify.size : undefined;
        }
        if (file.type && /^audio\/.+/.test(file.type)) {
            attachment.audio_url = url;
            attachment.audio_type = file.type;
            attachment.audio_size = file.size;
        }
        if (file.type && /^video\/.+/.test(file.type)) {
            attachment.video_url = url;
            attachment.video_type = file.type;
            attachment.video_size = file.size;
        }
        return attachment;
    });
}
function onEmailReceived(email_1, inbox_1) {
    return __awaiter(this, arguments, void 0, function* (email, inbox, department = '') {
        var _a, _b, _c, _d;
        logger_1.logger.info(`New email conversation received on inbox ${inbox}. Will be assigned to department ${department}`);
        if (!((_c = (_b = (_a = email.from) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.address)) {
            return;
        }
        const references = typeof email.references === 'string' ? [email.references] : email.references;
        const initialRef = [email.messageId, email.inReplyTo].filter(Boolean);
        const thread = ((references === null || references === void 0 ? void 0 : references.length) ? references : []).flatMap((t) => t.split(',')).concat(initialRef);
        const guest = yield getGuestByEmail(email.from.value[0].address, email.from.value[0].name, department);
        if (!guest) {
            logger_1.logger.error(`No visitor found for ${email.from.value[0].address}`);
            return;
        }
        let room = yield models_1.LivechatRooms.findOneByVisitorTokenAndEmailThreadAndDepartment(guest.token, thread, department, {});
        logger_1.logger.debug({
            msg: 'Room found for guest',
            room,
            guest,
        });
        if (room === null || room === void 0 ? void 0 : room.closedAt) {
            room = yield QueueManager_1.QueueManager.unarchiveRoom(room);
        }
        // TODO: html => md with turndown
        const msg = email.html
            ? (0, string_strip_html_1.default)(email.html, {
                dumpLinkHrefsNearby: {
                    enabled: true,
                    putOnNewLine: false,
                    wrapHeads: '(',
                    wrapTails: ')',
                },
                skipHtmlDecoding: false,
            }).result
            : email.text || '';
        const rid = (_d = room === null || room === void 0 ? void 0 : room._id) !== null && _d !== void 0 ? _d : random_1.Random.id();
        const msgId = random_1.Random.id();
        LivechatTyped_1.Livechat.sendMessage({
            guest,
            message: {
                _id: msgId,
                groupable: false,
                msg,
                token: guest.token,
                attachments: [
                    {
                        actions: [
                            {
                                type: 'button',
                                text: t('Reply_via_Email'),
                                msg: 'msg',
                                msgId,
                                msg_in_chat_window: true,
                                msg_processing_type: 'respondWithQuotedMessage',
                            },
                        ],
                    },
                ],
                blocks: [
                    {
                        type: 'context',
                        elements: [
                            {
                                type: 'mrkdwn',
                                text: `**${t('From')}:** ${email.from.text}\n**${t('Subject')}:** ${email.subject}`,
                            },
                        ],
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: msg,
                        },
                    },
                ],
                rid,
                email: {
                    thread,
                    messageId: email.messageId,
                },
            },
            roomInfo: {
                email: {
                    inbox,
                    thread,
                    replyTo: email.from.value[0].address,
                    subject: email.subject,
                },
                source: {
                    type: core_typings_1.OmnichannelSourceType.EMAIL,
                    id: inbox,
                    alias: 'email-inbox',
                },
            },
            agent: undefined,
        })
            .then(() => __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            if (!email.attachments.length) {
                return;
            }
            const attachments = [];
            try {
                for (var _d = true, _e = __asyncValues(email.attachments), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const attachment = _c;
                    if (attachment.type !== 'attachment') {
                        continue;
                    }
                    try {
                        attachments.push(yield uploadAttachment(attachment, rid, guest.token));
                    }
                    catch (err) {
                        logger_1.logger.error({ msg: 'Error uploading attachment from email', err });
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            yield models_1.Messages.updateOne({ _id: msgId }, {
                $addToSet: {
                    attachments: {
                        $each: attachments,
                    },
                },
            });
            room && (yield models_1.LivechatRooms.updateEmailThreadByRoomId(room._id, thread));
            void (0, notifyListener_1.notifyOnMessageChange)({
                id: msgId,
            });
        }))
            .catch((err) => {
            logger_1.logger.error({
                msg: 'Error receiving email',
                err,
            });
        });
    });
}
