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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const logger_1 = __importDefault(require("./logger"));
const notifyListener_1 = require("../../lib/server/lib/notifyListener");
meteor_1.Meteor.methods({
    unreadMessages(firstUnreadMessage, room) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'unreadMessages',
                });
            }
            if (room && typeof room === 'string') {
                const lastMessage = (yield models_1.Messages.findVisibleByRoomId(room, {
                    limit: 1,
                    sort: { ts: -1 },
                }).toArray())[0];
                if (!lastMessage) {
                    throw new meteor_1.Meteor.Error('error-no-message-for-unread', 'There are no messages to mark unread', {
                        method: 'unreadMessages',
                        action: 'Unread_messages',
                    });
                }
                const setAsUnreadResponse = yield models_1.Subscriptions.setAsUnreadByRoomIdAndUserId(lastMessage.rid, userId, lastMessage.ts);
                if (setAsUnreadResponse.modifiedCount) {
                    void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserId)(lastMessage.rid, userId);
                }
                return;
            }
            if (typeof (firstUnreadMessage === null || firstUnreadMessage === void 0 ? void 0 : firstUnreadMessage._id) !== 'string') {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Not allowed', {
                    method: 'unreadMessages',
                    action: 'Unread_messages',
                });
            }
            const originalMessage = yield models_1.Messages.findOneById(firstUnreadMessage._id, {
                projection: {
                    u: 1,
                    rid: 1,
                    file: 1,
                    ts: 1,
                },
            });
            if (!originalMessage || userId === originalMessage.u._id) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Not allowed', {
                    method: 'unreadMessages',
                    action: 'Unread_messages',
                });
            }
            const lastSeen = (_a = (yield models_1.Subscriptions.findOneByRoomIdAndUserId(originalMessage.rid, userId))) === null || _a === void 0 ? void 0 : _a.ls;
            if (!lastSeen) {
                throw new meteor_1.Meteor.Error('error-subscription-not-found', 'Subscription not found', {
                    method: 'unreadMessages',
                    action: 'Unread_messages',
                });
            }
            if (firstUnreadMessage.ts >= lastSeen) {
                return logger_1.default.debug('Provided message is already marked as unread');
            }
            logger_1.default.debug(`Updating unread message of ${originalMessage.ts} as the first unread`);
            const setAsUnreadResponse = yield models_1.Subscriptions.setAsUnreadByRoomIdAndUserId(originalMessage.rid, userId, originalMessage.ts);
            if (setAsUnreadResponse.modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserId)(originalMessage.rid, userId);
            }
        });
    },
});
