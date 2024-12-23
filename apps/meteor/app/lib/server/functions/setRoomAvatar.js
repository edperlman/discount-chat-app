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
exports.setRoomAvatar = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../file/server");
const server_2 = require("../../../file-upload/server");
const setRoomAvatar = function (rid, dataURI, user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, core_typings_1.isRegisterUser)(user)) {
            throw new meteor_1.Meteor.Error('invalid-user', 'Invalid user', {
                function: 'RocketChat.setRoomAvatar',
            });
        }
        const fileStore = server_2.FileUpload.getStore('Avatars');
        const current = yield models_1.Avatars.findOneByRoomId(rid);
        if (!dataURI) {
            yield fileStore.deleteByRoomId(rid);
            yield core_services_1.Message.saveSystemMessage('room_changed_avatar', rid, '', user);
            void core_services_1.api.broadcast('room.avatarUpdate', { _id: rid });
            yield models_1.Rooms.unsetAvatarData(rid);
            return;
        }
        const fileData = server_1.RocketChatFile.dataURIParse(dataURI);
        const buffer = Buffer.from(fileData.image, 'base64');
        const file = {
            rid,
            type: fileData.contentType,
            size: buffer.length,
            uid: user._id,
        };
        if (current) {
            yield fileStore.deleteById(current._id);
        }
        const result = yield fileStore.insert(file, buffer);
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            result.etag && (yield models_1.Rooms.setAvatarData(rid, 'upload', result.etag));
            yield core_services_1.Message.saveSystemMessage('room_changed_avatar', rid, '', user);
            void core_services_1.api.broadcast('room.avatarUpdate', { _id: rid, avatarETag: result.etag });
        }), 500);
    });
};
exports.setRoomAvatar = setRoomAvatar;
