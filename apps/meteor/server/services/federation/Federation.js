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
exports.Federation = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const IRoomTypeConfig_1 = require("../../../definition/IRoomTypeConfig");
const federation_id_escape_helper_1 = require("./infrastructure/rocket-chat/adapters/federation-id-escape-helper");
const allowedActionsInFederatedRooms = [
    IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER,
    IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER,
    IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR,
    IRoomTypeConfig_1.RoomMemberActions.INVITE,
    IRoomTypeConfig_1.RoomMemberActions.JOIN,
    IRoomTypeConfig_1.RoomMemberActions.LEAVE,
];
const allowedActionsForModerators = allowedActionsInFederatedRooms.filter((action) => action !== IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER);
const allowedRoomSettingsChangesInFederatedRooms = [IRoomTypeConfig_1.RoomSettingsEnum.NAME, IRoomTypeConfig_1.RoomSettingsEnum.TOPIC];
class Federation {
    static actionAllowed(room, action, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!(0, core_typings_1.isRoomFederated)(room)) {
                return false;
            }
            if ((0, core_typings_1.isDirectMessageRoom)(room)) {
                return false;
            }
            if (!userId) {
                return true;
            }
            const userSubscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(room._id, userId);
            if (!userSubscription) {
                return true;
            }
            if (action === IRoomTypeConfig_1.RoomMemberActions.LEAVE) {
                return true;
            }
            if ((_a = userSubscription.roles) === null || _a === void 0 ? void 0 : _a.includes('owner')) {
                return allowedActionsInFederatedRooms.includes(action);
            }
            if ((_b = userSubscription.roles) === null || _b === void 0 ? void 0 : _b.includes('moderator')) {
                return allowedActionsForModerators.includes(action);
            }
            return false;
        });
    }
    static isAFederatedUsername(username) {
        return username.includes('@') && username.includes(':');
    }
    static escapeExternalFederationEventId(externalEventId) {
        return (0, federation_id_escape_helper_1.escapeExternalFederationEventId)(externalEventId);
    }
    static unescapeExternalFederationEventId(externalEventId) {
        return (0, federation_id_escape_helper_1.unescapeExternalFederationEventId)(externalEventId);
    }
    static isRoomSettingAllowed(room, setting) {
        if (!(0, core_typings_1.isRoomFederated)(room)) {
            return false;
        }
        if ((0, core_typings_1.isDirectMessageRoom)(room)) {
            return false;
        }
        return allowedRoomSettingsChangesInFederatedRooms.includes(setting);
    }
}
exports.Federation = Federation;
