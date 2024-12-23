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
exports.canAccessRoom = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const canAccessRoomLivechat_1 = require("./canAccessRoomLivechat");
const canAccessRoomVoip_1 = require("./canAccessRoomVoip");
function canAccessPublicRoom(user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            // TODO: it was using cached version from /app/settings/server/raw.js
            const anon = yield models_1.Settings.getValueById('Accounts_AllowAnonymousRead');
            return !!anon;
        }
        return core_services_1.Authorization.hasPermission(user._id, 'view-c-room');
    });
}
const roomAccessValidators = [
    function _validateAccessToPublicRoomsInTeams(room, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!room) {
                return false;
            }
            if (!room._id || !room.teamId || room.t !== 'c') {
                // if the room doesn't belongs to a team || is not a public channel - skip
                return false;
            }
            // if team is public, access is allowed if the user can access public rooms
            const team = yield models_1.Team.findOneById(room.teamId, {
                projection: { type: 1 },
            });
            if ((team === null || team === void 0 ? void 0 : team.type) === core_typings_1.TEAM_TYPE.PUBLIC) {
                return canAccessPublicRoom(user);
            }
            // otherwise access is allowed only to members of the team
            const membership = (user === null || user === void 0 ? void 0 : user._id) &&
                (yield models_1.TeamMember.findOneByUserIdAndTeamId(user._id, room.teamId, {
                    projection: { _id: 1 },
                }));
            return !!membership;
        });
    },
    function _validateAccessToPublicRooms(room, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(room === null || room === void 0 ? void 0 : room._id) || room.t !== 'c' || (room === null || room === void 0 ? void 0 : room.teamId)) {
                return false;
            }
            return canAccessPublicRoom(user);
        });
    },
    function _validateIfAlreadyJoined(room, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(room === null || room === void 0 ? void 0 : room._id) || !(user === null || user === void 0 ? void 0 : user._id)) {
                return false;
            }
            if (!(yield models_1.Subscriptions.countByRoomIdAndUserId(room._id, user._id))) {
                return false;
            }
            if (yield core_services_1.Authorization.hasPermission(user._id, 'view-joined-room')) {
                return true;
            }
            return core_services_1.Authorization.hasPermission(user._id, `view-${room.t}-room`);
        });
    },
    function _validateAccessToDiscussionsParentRoom(room, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(room === null || room === void 0 ? void 0 : room.prid)) {
                return false;
            }
            const parentRoom = yield models_1.Rooms.findOneById(room.prid);
            if (!parentRoom) {
                return false;
            }
            return core_services_1.Authorization.canAccessRoom(parentRoom, user);
        });
    },
    canAccessRoomLivechat_1.canAccessRoomLivechat,
    canAccessRoomVoip_1.canAccessRoomVoip,
];
const canAccessRoom = (room, user, extraData) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO livechat can send both as null, so they we need to validate nevertheless
    // if (!room || !user) {
    // 	return false;
    // }
    var _a, e_1, _b, _c;
    try {
        for (var _d = true, roomAccessValidators_1 = __asyncValues(roomAccessValidators), roomAccessValidators_1_1; roomAccessValidators_1_1 = yield roomAccessValidators_1.next(), _a = roomAccessValidators_1_1.done, !_a; _d = true) {
            _c = roomAccessValidators_1_1.value;
            _d = false;
            const roomAccessValidator = _c;
            if (yield roomAccessValidator(room, user, extraData)) {
                return true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = roomAccessValidators_1.return)) yield _b.call(roomAccessValidators_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
});
exports.canAccessRoom = canAccessRoom;
