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
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../lib/callbacks");
const server_1 = require("../../../authorization/server");
const server_2 = require("../../../settings/server");
const functions_1 = require("../functions");
const MAX_LIMIT = 100;
meteor_1.Meteor.methods({
    getThreadMessages(_a) {
        return __awaiter(this, arguments, void 0, function* ({ tmid, limit, skip }) {
            if ((limit !== null && limit !== void 0 ? limit : 0) > MAX_LIMIT) {
                throw new meteor_1.Meteor.Error('error-not-allowed', `max limit: ${MAX_LIMIT}`, {
                    method: 'getThreadMessages',
                });
            }
            if (!meteor_1.Meteor.userId() || !server_2.settings.get('Threads_enabled')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Threads Disabled', {
                    method: 'getThreadMessages',
                });
            }
            const thread = yield models_1.Messages.findOneById(tmid);
            if (!thread) {
                return [];
            }
            const user = yield meteor_1.Meteor.userAsync();
            const room = yield models_1.Rooms.findOneById(thread.rid);
            if (!user || !room || !(yield (0, server_1.canAccessRoomAsync)(room, user))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'getThreadMessages' });
            }
            if (!thread.tcount) {
                return [];
            }
            yield callbacks_1.callbacks.run('beforeReadMessages', thread.rid, user._id);
            yield (0, functions_1.readThread)({ userId: user._id, rid: thread.rid, tmid });
            const result = yield models_1.Messages.findVisibleThreadByThreadId(tmid, Object.assign(Object.assign(Object.assign({}, (skip && { skip })), (limit && { limit })), { sort: { ts: -1 } })).toArray();
            callbacks_1.callbacks.runAsync('afterReadMessages', room._id, { uid: user._id, tmid });
            return [thread, ...result];
        });
    },
});
