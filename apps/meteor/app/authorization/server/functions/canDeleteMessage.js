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
exports.canDeleteMessageAsync = void 0;
const models_1 = require("@rocket.chat/models");
const canAccessRoom_1 = require("./canAccessRoom");
const hasPermission_1 = require("./hasPermission");
const raw_1 = require("../../../settings/server/raw");
const elapsedTime = (ts) => {
    const dif = Date.now() - ts.getTime();
    return Math.round(dif / 1000 / 60);
};
const canDeleteMessageAsync = (uid_1, _a) => __awaiter(void 0, [uid_1, _a], void 0, function* (uid, { u, rid, ts }) {
    const room = yield models_1.Rooms.findOneById(rid, {
        projection: {
            _id: 1,
            ro: 1,
            unmuted: 1,
            t: 1,
            teamId: 1,
            prid: 1,
        },
    });
    if (!room) {
        return false;
    }
    if (!(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, { _id: uid }))) {
        return false;
    }
    const forceDelete = yield (0, hasPermission_1.hasPermissionAsync)(uid, 'force-delete-message', rid);
    if (forceDelete) {
        return true;
    }
    if (!ts) {
        return false;
    }
    const deleteAllowed = yield (0, raw_1.getValue)('Message_AllowDeleting');
    if (!deleteAllowed) {
        return false;
    }
    const allowedToDeleteAny = yield (0, hasPermission_1.hasPermissionAsync)(uid, 'delete-message', rid);
    const allowed = allowedToDeleteAny || (uid === u._id && (yield (0, hasPermission_1.hasPermissionAsync)(uid, 'delete-own-message', rid)));
    if (!allowed) {
        return false;
    }
    const bypassBlockTimeLimit = yield (0, hasPermission_1.hasPermissionAsync)(uid, 'bypass-time-limit-edit-and-delete', rid);
    if (!bypassBlockTimeLimit) {
        const blockDeleteInMinutes = yield (0, raw_1.getValue)('Message_AllowDeleting_BlockDeleteInMinutes');
        if (blockDeleteInMinutes) {
            const timeElapsedForMessage = elapsedTime(ts);
            return timeElapsedForMessage <= blockDeleteInMinutes;
        }
    }
    if (room.ro === true && !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'post-readonly', rid))) {
        // Unless the user was manually unmuted
        if (u.username && !(room.unmuted || []).includes(u.username)) {
            throw new Error("You can't delete messages because the room is readonly.");
        }
    }
    return true;
});
exports.canDeleteMessageAsync = canDeleteMessageAsync;
