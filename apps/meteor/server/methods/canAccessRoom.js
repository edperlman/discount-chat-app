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
const server_2 = require("../../app/settings/server");
if (['yes', 'true'].includes(String(process.env.ALLOW_CANACCESSROOM_METHOD).toLowerCase())) {
    console.warn('Method canAccessRoom is deprecated and will be removed after version 5.0');
    meteor_1.Meteor.methods({
        canAccessRoom(rid, userId, extraData) {
            return __awaiter(this, void 0, void 0, function* () {
                (0, check_1.check)(rid, String);
                (0, check_1.check)(userId, check_1.Match.Maybe(String));
                let user;
                if (userId) {
                    user = yield models_1.Users.findOneById(userId, {
                        projection: {
                            username: 1,
                        },
                    });
                    if (!(user === null || user === void 0 ? void 0 : user.username)) {
                        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                            method: 'canAccessRoom',
                        });
                    }
                }
                if (!rid) {
                    throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                        method: 'canAccessRoom',
                    });
                }
                const room = yield models_1.Rooms.findOneById(rid);
                if (!room) {
                    throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                        method: 'canAccessRoom',
                    });
                }
                if (yield (0, server_1.canAccessRoomAsync)(room, user, extraData)) {
                    if (user) {
                        return Object.assign(Object.assign({}, room), { username: user.username });
                    }
                    return room;
                }
                if (!userId && server_2.settings.get('Accounts_AllowAnonymousRead') === false) {
                    throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                        method: 'canAccessRoom',
                    });
                }
                return false;
            });
        },
    });
}
