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
exports.saveRoomType = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const i18n_1 = require("../../../../server/lib/i18n");
const roomCoordinator_1 = require("../../../../server/lib/rooms/roomCoordinator");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_1 = require("../../../settings/server");
const saveRoomType = function (rid_1, roomType_1, user_1) {
    return __awaiter(this, arguments, void 0, function* (rid, roomType, user, sendMessage = true) {
        var _a, _b;
        if (!check_1.Match.test(rid, String)) {
            throw new meteor_1.Meteor.Error('invalid-room', 'Invalid room', {
                function: 'RocketChat.saveRoomType',
            });
        }
        if (roomType !== 'c' && roomType !== 'p') {
            throw new meteor_1.Meteor.Error('error-invalid-room-type', 'error-invalid-room-type', {
                function: 'RocketChat.saveRoomType',
                type: roomType,
            });
        }
        const room = yield models_1.Rooms.findOneById(rid);
        if (room == null) {
            throw new meteor_1.Meteor.Error('error-invalid-room', 'error-invalid-room', {
                function: 'RocketChat.saveRoomType',
                _id: rid,
            });
        }
        if (!(yield ((_a = roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t)) === null || _a === void 0 ? void 0 : _a.allowRoomSettingChange(room, IRoomTypeConfig_1.RoomSettingsEnum.TYPE)))) {
            throw new meteor_1.Meteor.Error('error-direct-room', "Can't change type of direct rooms", {
                function: 'RocketChat.saveRoomType',
            });
        }
        const result = yield Promise.all([models_1.Rooms.setTypeById(rid, roomType), models_1.Subscriptions.updateTypeByRoomId(rid, roomType)]);
        if (!result) {
            return result;
        }
        if ((_b = result[1]) === null || _b === void 0 ? void 0 : _b.modifiedCount) {
            void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(rid);
        }
        if (sendMessage) {
            let message;
            if (roomType === 'c') {
                message = i18n_1.i18n.t('public', {
                    lng: (user === null || user === void 0 ? void 0 : user.language) || server_1.settings.get('Language') || 'en',
                });
            }
            else {
                message = i18n_1.i18n.t('private', {
                    lng: (user === null || user === void 0 ? void 0 : user.language) || server_1.settings.get('Language') || 'en',
                });
            }
            yield core_services_1.Message.saveSystemMessage('room_changed_privacy', rid, message, user);
        }
        return result;
    });
};
exports.saveRoomType = saveRoomType;
