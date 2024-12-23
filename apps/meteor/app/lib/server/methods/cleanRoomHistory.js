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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const rooms_1 = require("../../../api/server/v1/rooms");
const server_1 = require("../../../authorization/server");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const cleanRoomHistory_1 = require("../functions/cleanRoomHistory");
meteor_1.Meteor.methods({
    cleanRoomHistory(_a) {
        return __awaiter(this, arguments, void 0, function* ({ roomId, latest, oldest, inclusive = true, limit, excludePinned = false, ignoreDiscussion = true, filesOnly = false, fromUsers = [], ignoreThreads, }) {
            (0, check_1.check)(roomId, String);
            (0, check_1.check)(latest, Date);
            (0, check_1.check)(oldest, Date);
            (0, check_1.check)(inclusive, Boolean);
            (0, check_1.check)(limit, check_1.Match.Maybe(Number));
            (0, check_1.check)(excludePinned, check_1.Match.Maybe(Boolean));
            (0, check_1.check)(filesOnly, check_1.Match.Maybe(Boolean));
            (0, check_1.check)(ignoreThreads, check_1.Match.Maybe(Boolean));
            (0, check_1.check)(fromUsers, check_1.Match.Maybe([String]));
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'cleanRoomHistory' });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'clean-channel-history', roomId))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'cleanRoomHistory' });
            }
            const room = yield (0, rooms_1.findRoomByIdOrName)({ params: { roomId } });
            if (!room || !(yield (0, server_1.canAccessRoomAsync)(room, { _id: userId }))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'cleanRoomHistory' });
            }
            return (0, cleanRoomHistory_1.cleanRoomHistory)({
                rid: roomId,
                latest,
                oldest,
                inclusive,
                limit,
                excludePinned,
                ignoreDiscussion,
                filesOnly,
                fromUsers,
                ignoreThreads,
            });
        });
    },
});
