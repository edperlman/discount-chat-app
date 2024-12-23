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
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../lib/server");
const sendTranscript_1 = require("../lib/sendTranscript");
meteor_1.Meteor.methods({
    'livechat:sendTranscript'(token, rid, email, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(rid, String);
            (0, check_1.check)(email, String);
            const uid = meteor_1.Meteor.userId();
            if (!uid || !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'send-omnichannel-chat-transcript'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'livechat:sendTranscript',
                });
            }
            const user = yield models_1.Users.findOneById(uid, {
                projection: { _id: 1, username: 1, name: 1, utcOffset: 1 },
            });
            const room = yield models_1.LivechatRooms.findOneById(rid, { projection: { activity: 1 } });
            if (!room) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'livechat:sendTranscript' });
            }
            if (!(yield core_services_1.Omnichannel.isWithinMACLimit(room))) {
                throw new meteor_1.Meteor.Error('error-mac-limit-reached', 'MAC limit reached', { method: 'livechat:sendTranscript' });
            }
            return (0, sendTranscript_1.sendTranscript)({ token, rid, email, subject, user });
        });
    },
});
server_1.RateLimiter.limitMethod('livechat:sendTranscript', 1, 5000, {
    connectionId() {
        return true;
    },
});
