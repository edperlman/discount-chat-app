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
const server_1 = require("../../../authorization/server");
meteor_1.Meteor.methods({
    getUserMentionsByChannel(_a) {
        return __awaiter(this, arguments, void 0, function* ({ roomId, options }) {
            (0, check_1.check)(roomId, String);
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'getUserMentionsByChannel',
                });
            }
            const user = yield models_1.Users.findOneById(uid);
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user');
            }
            const room = yield models_1.Rooms.findOneById(roomId);
            if (!room || !(yield (0, server_1.canAccessRoomAsync)(room, user))) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                    method: 'getUserMentionsByChannel',
                });
            }
            return models_1.Messages.findVisibleByMentionAndRoomId(user.username, roomId, options).toArray();
        });
    },
});
