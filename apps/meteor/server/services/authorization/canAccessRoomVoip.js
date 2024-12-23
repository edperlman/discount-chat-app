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
exports.canAccessRoomVoip = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const AuthorizationVoip = (0, core_services_1.proxify)('authorization-livechat');
const canAccessRoomVoip = (room, user, extraData) => __awaiter(void 0, void 0, void 0, function* () {
    // room can be sent as `null` but in that case a `rid` is also sent on extraData
    // this is the case for file uploads
    const voipRoom = room || ((extraData === null || extraData === void 0 ? void 0 : extraData.rid) && (yield models_1.Rooms.findOneById(extraData === null || extraData === void 0 ? void 0 : extraData.rid)));
    if ((voipRoom === null || voipRoom === void 0 ? void 0 : voipRoom.t) !== 'v') {
        return false;
    }
    // Call back core temporarily
    return AuthorizationVoip.canAccessRoom(voipRoom, user, extraData);
});
exports.canAccessRoomVoip = canAccessRoomVoip;
