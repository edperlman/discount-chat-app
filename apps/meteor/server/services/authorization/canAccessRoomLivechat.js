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
exports.canAccessRoomLivechat = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const AuthorizationLivechat = (0, core_services_1.proxify)('authorization-livechat');
const canAccessRoomLivechat = (room, user, extraData) => __awaiter(void 0, void 0, void 0, function* () {
    // If we received a partial room and its type is not `l` or `v`, skip all checks.
    if (room && !['v', 'l'].includes(room.t)) {
        return false;
    }
    // if we received a partial room, load the full IOmnichannelRoom data for it
    // Otherwise, try to load the data from the extraData (this is the case for file uploads)
    const rid = (room === null || room === void 0 ? void 0 : room._id) || (extraData === null || extraData === void 0 ? void 0 : extraData.rid);
    const livechatRoom = rid && (yield models_1.Rooms.findOneById(rid));
    // if the roomId is invalid skip checks and fail
    if (!livechatRoom) {
        return false;
    }
    // Check the type again in case the room parameter was not received
    if (!['v', 'l'].includes(livechatRoom.t)) {
        return false;
    }
    // Call back core temporarily
    return AuthorizationLivechat.canAccessRoom(livechatRoom, user, extraData);
});
exports.canAccessRoomLivechat = canAccessRoomLivechat;
