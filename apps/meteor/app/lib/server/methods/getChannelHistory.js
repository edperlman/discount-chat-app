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
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const cached_1 = require("../../../settings/server/cached");
const normalizeMessagesForUser_1 = require("../../../utils/server/lib/normalizeMessagesForUser");
const getHiddenSystemMessages_1 = require("../lib/getHiddenSystemMessages");
meteor_1.Meteor.methods({
    getChannelHistory(_a) {
        return __awaiter(this, arguments, void 0, function* ({ rid, latest, oldest, inclusive, offset = 0, count = 20, unreads, showThreadMessages = true }) {
            (0, check_1.check)(rid, String);
            if (!meteor_1.Meteor.userId()) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'getChannelHistory' });
            }
            const fromUserId = meteor_1.Meteor.userId();
            if (!fromUserId) {
                return false;
            }
            const room = yield models_1.Rooms.findOneById(rid);
            if (!room) {
                return false;
            }
            if (!(yield (0, server_1.canAccessRoomAsync)(room, { _id: fromUserId }))) {
                return false;
            }
            // Make sure they can access the room
            if (room.t === 'c' &&
                !(yield (0, hasPermission_1.hasPermissionAsync)(fromUserId, 'preview-c-room')) &&
                !(yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, fromUserId, { projection: { _id: 1 } }))) {
                return false;
            }
            // Ensure latest is always defined.
            if (latest === undefined) {
                latest = new Date();
            }
            // Verify oldest is a date if it exists
            if (oldest !== undefined && {}.toString.call(oldest) !== '[object Date]') {
                throw new meteor_1.Meteor.Error('error-invalid-date', 'Invalid date', { method: 'getChannelHistory' });
            }
            const hiddenSystemMessages = cached_1.settings.get('Hide_System_Messages');
            const hiddenMessageTypes = (0, getHiddenSystemMessages_1.getHiddenSystemMessages)(room, hiddenSystemMessages);
            const options = {
                sort: {
                    ts: -1,
                },
                skip: offset,
                limit: count,
            };
            const records = oldest === undefined
                ? yield models_1.Messages.findVisibleByRoomIdBeforeTimestampNotContainingTypes(rid, latest, hiddenMessageTypes, options, showThreadMessages, inclusive).toArray()
                : yield models_1.Messages.findVisibleByRoomIdBetweenTimestampsNotContainingTypes(rid, oldest, latest, hiddenMessageTypes, options, showThreadMessages, inclusive).toArray();
            const messages = yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)(records, fromUserId);
            if (unreads) {
                let unreadNotLoaded = 0;
                let firstUnread = undefined;
                if (oldest !== undefined) {
                    const firstMsg = messages[messages.length - 1];
                    if (firstMsg !== undefined && firstMsg.ts > oldest) {
                        const unreadMessages = models_1.Messages.findVisibleByRoomIdBetweenTimestampsNotContainingTypes(rid, oldest, firstMsg.ts, hiddenMessageTypes, {
                            limit: 1,
                            sort: {
                                ts: 1,
                            },
                        }, showThreadMessages);
                        const totalCursor = yield models_1.Messages.countVisibleByRoomIdBetweenTimestampsNotContainingTypes(rid, oldest, firstMsg.ts, hiddenMessageTypes, showThreadMessages);
                        firstUnread = (yield unreadMessages.toArray())[0];
                        unreadNotLoaded = totalCursor;
                    }
                }
                return {
                    messages: messages || [],
                    firstUnread,
                    unreadNotLoaded,
                };
            }
            return {
                messages: messages || [],
            };
        });
    },
});
