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
const readMessages_1 = require("../lib/readMessages");
meteor_1.Meteor.methods({
    readMessages(rid_1) {
        return __awaiter(this, arguments, void 0, function* (rid, readThreads = false) {
            var _a;
            (0, check_1.check)(rid, String);
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'readMessages',
                });
            }
            const user = (_a = (yield meteor_1.Meteor.userAsync())) !== null && _a !== void 0 ? _a : undefined;
            const room = yield models_1.Rooms.findOneById(rid);
            if (!room) {
                throw new meteor_1.Meteor.Error('error-room-does-not-exist', 'This room does not exist', { method: 'readMessages' });
            }
            if (!(yield (0, server_1.canAccessRoomAsync)(room, user))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'readMessages' });
            }
            yield (0, readMessages_1.readMessages)(rid, userId, readThreads);
        });
    },
});
