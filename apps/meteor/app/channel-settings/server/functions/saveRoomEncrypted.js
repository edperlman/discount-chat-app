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
exports.saveRoomEncrypted = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const saveRoomEncrypted = function (rid_1, encrypted_1, user_1) {
    return __awaiter(this, arguments, void 0, function* (rid, encrypted, user, sendMessage = true) {
        if (!check_1.Match.test(rid, String)) {
            throw new meteor_1.Meteor.Error('invalid-room', 'Invalid room', {
                function: 'RocketChat.saveRoomEncrypted',
            });
        }
        if (!(0, core_typings_1.isRegisterUser)(user)) {
            throw new meteor_1.Meteor.Error('invalid-user', 'Invalid user', {
                function: 'RocketChat.saveRoomEncrypted',
            });
        }
        const update = yield models_1.Rooms.saveEncryptedById(rid, encrypted);
        if (update && sendMessage) {
            const type = encrypted ? 'room_e2e_enabled' : 'room_e2e_disabled';
            yield core_services_1.Message.saveSystemMessage(type, rid, user.username, user);
        }
        if (encrypted) {
            const { modifiedCount } = yield models_1.Subscriptions.disableAutoTranslateByRoomId(rid);
            if (modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(rid);
            }
        }
        return update;
    });
};
exports.saveRoomEncrypted = saveRoomEncrypted;
