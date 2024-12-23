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
const functions_1 = require("../../app/threads/server/functions");
const callbacks_1 = require("../../lib/callbacks");
meteor_1.Meteor.methods({
    readThreads(tmid) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (0, check_1.check)(tmid, String);
            if (!meteor_1.Meteor.userId() || !server_2.settings.get('Threads_enabled')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Threads Disabled', {
                    method: 'getThreadMessages',
                });
            }
            const thread = yield models_1.Messages.findOneById(tmid);
            if (!thread) {
                return;
            }
            const user = (_a = (yield meteor_1.Meteor.userAsync())) !== null && _a !== void 0 ? _a : undefined;
            const room = yield models_1.Rooms.findOneById(thread.rid);
            if (!room) {
                throw new meteor_1.Meteor.Error('error-room-does-not-exist', 'This room does not exist', { method: 'getThreadMessages' });
            }
            if (!(yield (0, server_1.canAccessRoomAsync)(room, user))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'getThreadMessages' });
            }
            yield callbacks_1.callbacks.run('beforeReadMessages', thread.rid, user === null || user === void 0 ? void 0 : user._id);
            if (user === null || user === void 0 ? void 0 : user._id) {
                yield (0, functions_1.readThread)({ userId: user._id, rid: thread.rid, tmid });
                callbacks_1.callbacks.runAsync('afterReadMessages', room._id, { uid: user._id, tmid });
            }
        });
    },
});
