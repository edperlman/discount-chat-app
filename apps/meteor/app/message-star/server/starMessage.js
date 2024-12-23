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
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../authorization/server");
const isTheLastMessage_1 = require("../../lib/server/functions/isTheLastMessage");
const notifyListener_1 = require("../../lib/server/lib/notifyListener");
const server_2 = require("../../settings/server");
meteor_1.Meteor.methods({
    starMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'starMessage',
                });
            }
            if (!server_2.settings.get('Message_AllowStarring')) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Message starring not allowed', {
                    method: 'starMessage',
                    action: 'Message_starring',
                });
            }
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(message.rid, uid, {
                projection: { _id: 1 },
            });
            if (!subscription) {
                return false;
            }
            if (!(yield models_1.Messages.findOneByRoomIdAndMessageId(message.rid, message._id))) {
                return false;
            }
            const room = yield models_1.Rooms.findOneById(message.rid, { projection: Object.assign(Object.assign({}, server_1.roomAccessAttributes), { lastMessage: 1 }) });
            if (!room) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'starMessage' });
            }
            if (!(yield (0, server_1.canAccessRoomAsync)(room, { _id: uid }))) {
                throw new meteor_1.Meteor.Error('not-authorized', 'Not Authorized', { method: 'starMessage' });
            }
            if ((0, isTheLastMessage_1.isTheLastMessage)(room, message)) {
                yield models_1.Rooms.updateLastMessageStar(room._id, uid, message.starred);
                void (0, notifyListener_1.notifyOnRoomChangedById)(room._id);
            }
            yield ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPostMessageStarred, message, yield meteor_1.Meteor.userAsync(), message.starred));
            yield models_1.Messages.updateUserStarById(message._id, uid, message.starred);
            void (0, notifyListener_1.notifyOnMessageChange)({
                id: message._id,
            });
            return true;
        });
    },
});
