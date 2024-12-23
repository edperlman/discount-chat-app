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
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportRoomMessagesToFile = exports.exportRoomMessages = exports.exportMessageObject = exports.getMessageData = void 0;
const promises_1 = require("fs/promises");
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../app/settings/server");
const readSecondaryPreferred_1 = require("../../database/readSecondaryPreferred");
const fileUtils_1 = require("../fileUtils");
const i18n_1 = require("../i18n");
const hideUserName = (username, userData, usersMap) => {
    if (!usersMap.userNameTable) {
        usersMap.userNameTable = {};
    }
    if (!usersMap.userNameTable[username]) {
        if (userData && username === userData.username) {
            usersMap.userNameTable[username] = username;
        }
        else {
            usersMap.userNameTable[username] = `User_${Object.keys(usersMap.userNameTable).length + 1}`;
        }
    }
    return usersMap.userNameTable[username];
};
const getAttachmentData = (attachment, message) => {
    var _a, _b, _c;
    return {
        type: 'type' in attachment ? attachment.type : undefined,
        title: attachment.title,
        title_link: attachment.title_link,
        image_url: 'image_url' in attachment ? attachment.image_url : undefined,
        audio_url: 'audio_url' in attachment ? attachment.audio_url : undefined,
        video_url: 'video_url' in attachment ? attachment.video_url : undefined,
        message_link: 'message_link' in attachment ? attachment.message_link : undefined,
        image_type: 'image_type' in attachment ? attachment.image_type : undefined,
        image_size: 'image_size' in attachment ? attachment.image_size : undefined,
        video_size: 'video_size' in attachment ? attachment.video_size : undefined,
        video_type: 'video_type' in attachment ? attachment.video_type : undefined,
        audio_size: 'audio_size' in attachment ? attachment.audio_size : undefined,
        audio_type: 'audio_type' in attachment ? attachment.audio_type : undefined,
        url: attachment.title_link ||
            ('image_url' in attachment ? attachment.image_url : undefined) ||
            ('audio_url' in attachment ? attachment.audio_url : undefined) ||
            ('video_url' in attachment ? attachment.video_url : undefined) ||
            ('message_link' in attachment ? attachment.message_link : undefined) ||
            null,
        remote: !((_a = message.file) === null || _a === void 0 ? void 0 : _a._id),
        fileId: (_b = message.file) === null || _b === void 0 ? void 0 : _b._id,
        fileName: (_c = message.file) === null || _c === void 0 ? void 0 : _c.name,
    };
};
const getMessageData = (msg, hideUsers, userData, usersMap) => {
    const username = hideUsers ? hideUserName(msg.u.username || msg.u.name || '', userData, usersMap) : msg.u.username;
    const messageObject = Object.assign(Object.assign({ msg: msg.msg, username, ts: msg.ts }, (msg.attachments && {
        attachments: msg.attachments.map((attachment) => getAttachmentData(attachment, msg)),
    })), (msg.t && { type: msg.t }));
    switch (msg.t) {
        case 'uj':
            messageObject.msg = i18n_1.i18n.t('User_joined_the_channel');
            break;
        case 'ul':
            messageObject.msg = i18n_1.i18n.t('User_left_this_channel');
            break;
        case 'ult':
            messageObject.msg = i18n_1.i18n.t('User_left_this_team');
            break;
        case 'user-added-room-to-team':
            messageObject.msg = i18n_1.i18n.t('added__roomName__to_this_team', {
                roomName: msg.msg,
            });
            break;
        case 'user-converted-to-team':
            messageObject.msg = i18n_1.i18n.t('Converted__roomName__to_a_team', {
                roomName: msg.msg,
            });
            break;
        case 'user-converted-to-channel':
            messageObject.msg = i18n_1.i18n.t('Converted__roomName__to_a_channel', {
                roomName: msg.msg,
            });
            break;
        case 'user-deleted-room-from-team':
            messageObject.msg = i18n_1.i18n.t('Deleted__roomName__room', {
                roomName: msg.msg,
            });
            break;
        case 'user-removed-room-from-team':
            messageObject.msg = i18n_1.i18n.t('Removed__roomName__from_the_team', {
                roomName: msg.msg,
            });
            break;
        case 'ujt':
            messageObject.msg = i18n_1.i18n.t('User_joined_the_team');
            break;
        case 'au':
            messageObject.msg = i18n_1.i18n.t('User_added_to', {
                user_added: hideUserName(msg.msg, userData, usersMap),
                user_by: username,
            });
            break;
        case 'added-user-to-team':
            messageObject.msg = i18n_1.i18n.t('Added__username__to_this_team', {
                user_added: msg.msg,
            });
            break;
        case 'r':
            messageObject.msg = i18n_1.i18n.t('Room_name_changed_to', {
                room_name: msg.msg,
                user_by: username,
            });
            break;
        case 'ru':
            messageObject.msg = i18n_1.i18n.t('User_has_been_removed', {
                user_removed: hideUserName(msg.msg, userData, usersMap),
                user_by: username,
            });
            break;
        case 'removed-user-from-team':
            messageObject.msg = i18n_1.i18n.t('Removed__username__from_the_team', {
                user_removed: hideUserName(msg.msg, userData, usersMap),
            });
            break;
        case 'wm':
            messageObject.msg = i18n_1.i18n.t('Welcome', { user: username });
            break;
        case 'livechat-close':
            messageObject.msg = i18n_1.i18n.t('Conversation_finished');
            break;
        case 'livechat-started':
            messageObject.msg = i18n_1.i18n.t('Chat_started');
            break;
    }
    return messageObject;
};
exports.getMessageData = getMessageData;
const exportMessageObject = (type, messageObject, messageFile) => {
    var _a;
    if (type === 'json') {
        return JSON.stringify(messageObject);
    }
    const file = [];
    const messageType = messageObject.type;
    const timestamp = messageObject.ts ? new Date(messageObject.ts).toUTCString() : '';
    const italicTypes = ['uj', 'ul', 'au', 'r', 'ru', 'wm', 'livechat-close'];
    const message = italicTypes.includes(messageType) ? `<i>${messageObject.msg}</i>` : messageObject.msg;
    file.push(`<p><strong>${messageObject.username}</strong> (${timestamp}):<br/>`);
    file.push(message);
    if (messageFile === null || messageFile === void 0 ? void 0 : messageFile._id) {
        const attachment = (_a = messageObject.attachments) === null || _a === void 0 ? void 0 : _a.find((att) => { var _a; return att.type === 'file' && ((_a = att.title_link) === null || _a === void 0 ? void 0 : _a.includes(messageFile._id)); });
        const description = (attachment === null || attachment === void 0 ? void 0 : attachment.title) || i18n_1.i18n.t('Message_Attachments');
        const assetUrl = `./assets/${messageFile._id}-${messageFile.name}`;
        const link = `<br/><a href="${assetUrl}">${description}</a>`;
        file.push(link);
    }
    file.push('</p>');
    return file.join('\n');
};
exports.exportMessageObject = exportMessageObject;
const exportRoomMessages = (rid_1, exportType_1, skip_1, limit_1, userData_1, ...args_1) => __awaiter(void 0, [rid_1, exportType_1, skip_1, limit_1, userData_1, ...args_1], void 0, function* (rid, exportType, skip, limit, userData, filter = {}, usersMap = {}, hideUsers = true) {
    const readPreference = (0, readSecondaryPreferred_1.readSecondaryPreferred)();
    const { cursor, totalCount } = models_1.Messages.findPaginated(Object.assign(Object.assign({}, filter), { rid }), {
        sort: { ts: 1 },
        skip,
        limit,
        readPreference,
    });
    const [results, total] = yield Promise.all([cursor.toArray(), totalCount]);
    const result = {
        total,
        exported: results.length,
        messages: [],
        uploads: [],
    };
    results.forEach((msg) => {
        const messageObject = (0, exports.getMessageData)(msg, hideUsers, userData, usersMap);
        if (msg.file) {
            result.uploads.push(msg.file);
        }
        result.messages.push((0, exports.exportMessageObject)(exportType, messageObject, msg.file));
    });
    return result;
});
exports.exportRoomMessages = exportRoomMessages;
const exportRoomMessagesToFile = function (exportPath_1, assetsPath_1, exportType_1, roomList_1, userData_1) {
    return __awaiter(this, arguments, void 0, function* (exportPath, assetsPath, exportType, roomList, userData, messagesFilter = {}, usersMap = {}, hideUsers = true) {
        var _a, roomList_2, roomList_2_1;
        var _b, e_1, _c, _d;
        yield (0, promises_1.mkdir)(exportPath, { recursive: true });
        yield (0, promises_1.mkdir)(assetsPath, { recursive: true });
        const result = {
            fileList: [],
        };
        const limit = server_1.settings.get('UserData_MessageLimitPerRequest') > 0 ? server_1.settings.get('UserData_MessageLimitPerRequest') : 1000;
        try {
            for (_a = true, roomList_2 = __asyncValues(roomList); roomList_2_1 = yield roomList_2.next(), _b = roomList_2_1.done, !_b; _a = true) {
                _d = roomList_2_1.value;
                _a = false;
                const exportOpRoomData = _d;
                if (!('targetFile' in exportOpRoomData)) {
                    continue;
                }
                const filePath = (0, fileUtils_1.joinPath)(exportPath, exportOpRoomData.targetFile);
                if (exportOpRoomData.status === 'pending') {
                    exportOpRoomData.status = 'exporting';
                    if (exportType === 'html') {
                        yield (0, promises_1.writeFile)(filePath, '<meta http-equiv="content-type" content="text/html; charset=utf-8">', { encoding: 'utf8' });
                    }
                }
                const skip = exportOpRoomData.exportedCount;
                const { total, exported, uploads, messages } = yield (0, exports.exportRoomMessages)(exportOpRoomData.roomId, exportType, skip, limit, userData, messagesFilter, usersMap, hideUsers);
                result.fileList.push(...uploads);
                exportOpRoomData.exportedCount += exported;
                if (total <= exportOpRoomData.exportedCount) {
                    exportOpRoomData.status = 'completed';
                }
                yield (0, promises_1.writeFile)(filePath, `${messages.join('\n')}\n`, { encoding: 'utf8', flag: 'a' });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = roomList_2.return)) yield _c.call(roomList_2);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    });
};
exports.exportRoomMessagesToFile = exportRoomMessagesToFile;
