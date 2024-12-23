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
exports.createChannelMethod = void 0;
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const createRoom_1 = require("../functions/createRoom");
const createChannelMethod = (userId_1, name_1, members_1, ...args_1) => __awaiter(void 0, [userId_1, name_1, members_1, ...args_1], void 0, function* (userId, name, members, readOnly = false, customFields = {}, extraData = {}, excludeSelf = false) {
    (0, check_1.check)(name, String);
    (0, check_1.check)(members, check_1.Match.Optional([String]));
    if (!userId) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'createChannel' });
    }
    const user = yield models_1.Users.findOneById(userId, { projection: { services: 0 } });
    if (!(user === null || user === void 0 ? void 0 : user.username)) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'createChannel' });
    }
    if (extraData.teamId) {
        const team = yield models_1.Team.findOneById(extraData.teamId, { projection: { roomId: 1 } });
        if (!team) {
            throw new meteor_1.Meteor.Error('error-team-not-found', 'The "teamId" param provided does not match any team', { method: 'createChannel' });
        }
        if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'create-team-channel', team.roomId))) {
            throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'createChannel' });
        }
    }
    else if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'create-c'))) {
        throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'createChannel' });
    }
    return (0, createRoom_1.createRoom)('c', name, user, members, excludeSelf, readOnly, Object.assign({ customFields }, extraData));
});
exports.createChannelMethod = createChannelMethod;
meteor_1.Meteor.methods({
    createChannel(name_1, members_1) {
        return __awaiter(this, arguments, void 0, function* (name, members, readOnly = false, customFields = {}, extraData = {}) {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'createChannel' });
            }
            return (0, exports.createChannelMethod)(uid, name, members, readOnly, customFields, extraData);
        });
    },
});
