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
exports.sendFileLivechatMessage = void 0;
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const sendMessageLivechat_1 = require("./sendMessageLivechat");
const server_1 = require("../../../file-upload/server");
const sendFileLivechatMessage = (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, visitorToken, file, msgData = {} }) {
    var _b;
    const visitor = yield models_1.LivechatVisitors.getVisitorByToken(visitorToken);
    if (!visitor) {
        return false;
    }
    const room = yield models_1.LivechatRooms.findOneOpenByRoomIdAndVisitorToken(roomId, visitorToken);
    if (!room) {
        return false;
    }
    (0, check_1.check)(msgData, {
        avatar: check_1.Match.Optional(String),
        emoji: check_1.Match.Optional(String),
        alias: check_1.Match.Optional(String),
        groupable: check_1.Match.Optional(Boolean),
        msg: check_1.Match.Optional(String),
    });
    const fileUrl = file.name && server_1.FileUpload.getPath(`${file._id}/${encodeURI(file.name)}`);
    const attachment = {
        title: file.name,
        type: 'file',
        description: file.description,
        title_link: fileUrl,
        title_link_download: true,
    };
    if (file.type && /^image\/.+/.test(file.type)) {
        attachment.image_url = fileUrl || '';
        attachment.image_type = file.type;
        attachment.image_size = file.size;
        if ((_b = file.identify) === null || _b === void 0 ? void 0 : _b.size) {
            attachment.image_dimensions = file.identify.size;
        }
        attachment.image_preview = yield server_1.FileUpload.resizeImagePreview(file);
    }
    else if (file.type && /^audio\/.+/.test(file.type)) {
        attachment.audio_url = fileUrl || '';
        attachment.audio_type = file.type;
        attachment.audio_size = file.size;
    }
    else if (file.type && /^video\/.+/.test(file.type)) {
        attachment.video_url = fileUrl || '';
        attachment.video_type = file.type;
        attachment.video_size = file.size || 0;
    }
    const msg = Object.assign({
        _id: random_1.Random.id(),
        rid: roomId,
        ts: new Date(),
        msg: '',
        file: {
            _id: file._id,
            name: file.name,
            type: file.type,
        },
        files: [
            {
                _id: file._id,
                name: file.name,
                type: file.type,
            },
        ],
        groupable: false,
        attachments: [attachment],
        token: visitorToken,
    }, msgData);
    return (0, sendMessageLivechat_1.sendMessageLivechat)({ message: msg });
});
exports.sendFileLivechatMessage = sendFileLivechatMessage;
meteor_1.Meteor.methods({
    sendFileLivechatMessage(roomId_1, visitorToken_1, file_1) {
        return __awaiter(this, arguments, void 0, function* (roomId, visitorToken, file, msgData = {}) {
            return (0, exports.sendFileLivechatMessage)({ roomId, visitorToken, file, msgData });
        });
    },
});
