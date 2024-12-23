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
const apps_1 = require("@rocket.chat/apps");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
const server_1 = require("../../../lib/server");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_2 = require("../../../settings/server");
const functions_1 = require("../functions");
meteor_1.Meteor.methods({
    followMessage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ mid }) {
            var _b;
            (0, check_1.check)(mid, String);
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'followMessage' });
            }
            if (mid && !server_2.settings.get('Threads_enabled')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'not-allowed', { method: 'followMessage' });
            }
            const message = yield models_1.Messages.findOneById(mid);
            if (!message) {
                throw new meteor_1.Meteor.Error('error-invalid-message', 'Invalid message', {
                    method: 'followMessage',
                });
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(message.rid, uid))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'not-allowed', { method: 'followMessage' });
            }
            const id = message.tmid || message._id;
            const followResult = yield (0, functions_1.follow)({ tmid: id, uid });
            void (0, notifyListener_1.notifyOnMessageChange)({
                id,
            });
            const isFollowed = true;
            yield ((_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.triggerEvent(apps_1.AppEvents.IPostMessageFollowed, message, yield meteor_1.Meteor.userAsync(), isFollowed));
            return followResult;
        });
    },
});
server_1.RateLimiter.limitMethod('followMessage', 5, 5000, {
    userId() {
        return true;
    },
});
