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
exports.sendFileMessage = exports.parseFileIntoMessageAttachments = void 0;
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../lib/callbacks");
const getFileExtension_1 = require("../../../../lib/utils/getFileExtension");
const omit_1 = require("../../../../lib/utils/omit");
const system_1 = require("../../../../server/lib/logger/system");
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
const sendMessage_1 = require("../../../lib/server/methods/sendMessage");
const FileUpload_1 = require("../lib/FileUpload");
function validateFileRequiredFields(file) {
    const requiredFields = ['_id', 'name', 'type', 'size'];
    requiredFields.forEach((field) => {
        if (!Object.keys(file).includes(field)) {
            throw new meteor_1.Meteor.Error('error-invalid-file', 'Invalid file');
        }
    });
}
const parseFileIntoMessageAttachments = (file, roomId, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    validateFileRequiredFields(file);
    yield models_1.Uploads.updateFileComplete(file._id, user._id, (0, omit_1.omit)(file, '_id'));
    const fileUrl = FileUpload_1.FileUpload.getPath(`${file._id}/${encodeURI(file.name || '')}`);
    const attachments = [];
    const files = [
        {
            _id: file._id,
            name: file.name || '',
            type: file.type || 'file',
            size: file.size || 0,
            format: ((_a = file.identify) === null || _a === void 0 ? void 0 : _a.format) || '',
        },
    ];
    if (/^image\/.+/.test(file.type)) {
        const attachment = {
            title: file.name,
            type: 'file',
            description: file === null || file === void 0 ? void 0 : file.description,
            title_link: fileUrl,
            title_link_download: true,
            image_url: fileUrl,
            image_type: file.type,
            image_size: file.size,
        };
        if ((_b = file.identify) === null || _b === void 0 ? void 0 : _b.size) {
            attachment.image_dimensions = file.identify.size;
        }
        try {
            attachment.image_preview = yield FileUpload_1.FileUpload.resizeImagePreview(file);
            const thumbResult = yield FileUpload_1.FileUpload.createImageThumbnail(file);
            if (thumbResult) {
                const { data: thumbBuffer, width, height, thumbFileType, thumbFileName, originalFileId } = thumbResult;
                const thumbnail = yield FileUpload_1.FileUpload.uploadImageThumbnail({
                    thumbFileName,
                    thumbFileType,
                    originalFileId,
                }, thumbBuffer, roomId, user._id);
                const thumbUrl = FileUpload_1.FileUpload.getPath(`${thumbnail._id}/${encodeURI(file.name || '')}`);
                attachment.image_url = thumbUrl;
                attachment.image_type = thumbnail.type;
                attachment.image_dimensions = {
                    width,
                    height,
                };
                files.push({
                    _id: thumbnail._id,
                    name: thumbnail.name || '',
                    type: thumbnail.type || 'file',
                    size: thumbnail.size || 0,
                    format: ((_c = thumbnail.identify) === null || _c === void 0 ? void 0 : _c.format) || '',
                });
            }
        }
        catch (e) {
            system_1.SystemLogger.error(e);
        }
        attachments.push(attachment);
    }
    else if (/^audio\/.+/.test(file.type)) {
        const attachment = {
            title: file.name,
            type: 'file',
            description: file.description,
            title_link: fileUrl,
            title_link_download: true,
            audio_url: fileUrl,
            audio_type: file.type,
            audio_size: file.size,
        };
        attachments.push(attachment);
    }
    else if (/^video\/.+/.test(file.type)) {
        const attachment = {
            title: file.name,
            type: 'file',
            description: file.description,
            title_link: fileUrl,
            title_link_download: true,
            video_url: fileUrl,
            video_type: file.type,
            video_size: file.size,
        };
        attachments.push(attachment);
    }
    else {
        const attachment = {
            title: file.name,
            type: 'file',
            format: (0, getFileExtension_1.getFileExtension)(file.name),
            description: file.description,
            title_link: fileUrl,
            title_link_download: true,
            size: file.size,
        };
        attachments.push(attachment);
    }
    return { files, attachments };
});
exports.parseFileIntoMessageAttachments = parseFileIntoMessageAttachments;
const sendFileMessage = (userId_1, _a, ...args_1) => __awaiter(void 0, [userId_1, _a, ...args_1], void 0, function* (userId, { roomId, file, msgData, }, { parseAttachmentsForE2EE, } = {
    parseAttachmentsForE2EE: true,
}) {
    var _b, _c;
    const user = yield models_1.Users.findOneById(userId, { projection: { services: 0 } });
    if (!user) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
            method: 'sendFileMessage',
        });
    }
    const room = yield models_1.Rooms.findOneById(roomId);
    if (!room) {
        return false;
    }
    if ((user === null || user === void 0 ? void 0 : user.type) !== 'app' && !(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, user))) {
        return false;
    }
    (0, check_1.check)(msgData, check_1.Match.Maybe({
        avatar: check_1.Match.Optional(String),
        emoji: check_1.Match.Optional(String),
        alias: check_1.Match.Optional(String),
        groupable: check_1.Match.Optional(Boolean),
        msg: check_1.Match.Optional(String),
        tmid: check_1.Match.Optional(String),
        customFields: check_1.Match.Optional(String),
        t: check_1.Match.Optional(String),
        content: check_1.Match.Optional(check_1.Match.ObjectIncluding({
            algorithm: String,
            ciphertext: String,
        })),
    }));
    const data = Object.assign(Object.assign(Object.assign({ rid: roomId, ts: new Date() }, msgData), ((msgData === null || msgData === void 0 ? void 0 : msgData.customFields) && { customFields: JSON.parse(msgData.customFields) })), { msg: (_b = msgData === null || msgData === void 0 ? void 0 : msgData.msg) !== null && _b !== void 0 ? _b : '', groupable: (_c = msgData === null || msgData === void 0 ? void 0 : msgData.groupable) !== null && _c !== void 0 ? _c : false });
    if (parseAttachmentsForE2EE || (msgData === null || msgData === void 0 ? void 0 : msgData.t) !== 'e2e') {
        const { files, attachments } = yield (0, exports.parseFileIntoMessageAttachments)(file, roomId, user);
        data.file = files[0];
        data.files = files;
        data.attachments = attachments;
    }
    const msg = yield (0, sendMessage_1.executeSendMessage)(userId, data);
    callbacks_1.callbacks.runAsync('afterFileUpload', { user, room, message: msg });
    return msg;
});
exports.sendFileMessage = sendFileMessage;
meteor_1.Meteor.methods({
    sendFileMessage(roomId_1, _store_1, file_1) {
        return __awaiter(this, arguments, void 0, function* (roomId, _store, file, msgData = {}) {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'sendFileMessage',
                });
            }
            return (0, exports.sendFileMessage)(userId, { roomId, file, msgData });
        });
    },
});
