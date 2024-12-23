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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const unarchiveRoom_1 = require("../functions/unarchiveRoom");
meteor_1.Meteor.methods({
    unarchiveRoom(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(rid, String);
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'unarchiveRoom' });
            }
            const user = yield models_1.Users.findOneById(userId, { projection: { username: 1, name: 1 } });
            if (!user || !(0, core_typings_1.isRegisterUser)(user)) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'archiveRoom' });
            }
            const room = yield models_1.Rooms.findOneById(rid);
            if (!room) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'unarchiveRoom' });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'unarchive-room', room._id))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', { method: 'unarchiveRoom' });
            }
            return (0, unarchiveRoom_1.unarchiveRoom)(rid, user);
        });
    },
});
