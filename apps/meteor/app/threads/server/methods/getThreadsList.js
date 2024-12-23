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
const server_1 = require("../../../authorization/server");
const server_2 = require("../../../settings/server");
const MAX_LIMIT = 100;
meteor_1.Meteor.methods({
    getThreadsList(_a) {
        return __awaiter(this, arguments, void 0, function* ({ rid, limit = 50, skip = 0 }) {
            if (limit > MAX_LIMIT) {
                throw new meteor_1.Meteor.Error('error-not-allowed', `max limit: ${MAX_LIMIT}`, {
                    method: 'getThreadsList',
                });
            }
            if (!meteor_1.Meteor.userId() || !server_2.settings.get('Threads_enabled')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Threads Disabled', { method: 'getThreadsList' });
            }
            const user = yield meteor_1.Meteor.userAsync();
            const room = yield models_1.Rooms.findOneById(rid);
            if (!user || !room || !(yield (0, server_1.canAccessRoomAsync)(room, user))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not Allowed', { method: 'getThreadsList' });
            }
            return models_1.Messages.findThreadsByRoomId(rid, skip, limit).toArray();
        });
    },
});
