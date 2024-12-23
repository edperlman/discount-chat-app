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
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../app/authorization/server");
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const findUsersOfRoom_1 = require("../lib/findUsersOfRoom");
meteor_1.Meteor.methods({
    getUsersOfRoom(rid_1, showAll_1) {
        return __awaiter(this, arguments, void 0, function* (rid, showAll, { limit, skip } = {}, filter) {
            if (!rid) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'getUsersOfRoom' });
            }
            (0, check_1.check)(rid, String);
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'getUsersOfRoom' });
            }
            const room = yield models_1.Rooms.findOneById(rid, { projection: Object.assign(Object.assign({}, server_1.roomAccessAttributes), { broadcast: 1 }) });
            if (!room) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'getUsersOfRoom' });
            }
            if (!(yield (0, server_1.canAccessRoomAsync)(room, { _id: userId }))) {
                throw new meteor_1.Meteor.Error('not-authorized', 'Not Authorized', { method: 'getUsersOfRoom' });
            }
            if (room.broadcast && !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-broadcast-member-list', rid))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'getUsersOfRoom' });
            }
            // TODO this is currently counting deactivated users
            const total = yield models_1.Subscriptions.countByRoomIdWhenUsernameExists(rid);
            const { cursor } = (0, findUsersOfRoom_1.findUsersOfRoom)({
                rid,
                status: !showAll ? { $ne: 'offline' } : undefined,
                limit,
                skip,
                filter,
            });
            return {
                total,
                records: yield cursor.toArray(),
            };
        });
    },
});
