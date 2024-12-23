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
exports.MentionModule = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const processWebhookMessage_1 = require("../../../app/lib/server/functions/processWebhookMessage");
const addUsersToRoom_1 = require("../../../app/lib/server/methods/addUsersToRoom");
const i18n_1 = require("../../lib/i18n");
const roomCoordinator_1 = require("../../lib/rooms/roomCoordinator");
const retrieveMentionsFromPayload = (stringifiedMentions) => {
    try {
        const mentions = JSON.parse(stringifiedMentions);
        if (!Array.isArray(mentions) || !mentions.length || !('username' in mentions[0])) {
            throw new Error('Invalid payload');
        }
        return mentions;
    }
    catch (error) {
        throw new Error('Invalid payload');
    }
};
class MentionModule {
    constructor() {
        this.appId = 'mention-core';
    }
    blockAction(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { actionId, payload: { value: stringifiedMentions, blockId: referenceMessageId }, } = payload;
            const mentions = retrieveMentionsFromPayload(stringifiedMentions);
            const usernames = mentions.map(({ username }) => username);
            const message = yield models_1.Messages.findOneById(referenceMessageId, { projection: { _id: 1, tmid: 1 } });
            if (!message) {
                throw new Error('Mention bot - Failed to retrieve message information');
            }
            const joinedUsernames = `@${usernames.join(', @')}`;
            if (actionId === 'dismiss') {
                void core_services_1.api.broadcast('notify.ephemeralMessage', payload.user._id, payload.room, {
                    msg: i18n_1.i18n.t('You_mentioned___mentions__but_theyre_not_in_this_room', {
                        mentions: joinedUsernames,
                        lng: payload.user.language,
                    }),
                    _id: payload.message,
                    tmid: message.tmid,
                    mentions,
                });
                return;
            }
            if (actionId === 'add-users') {
                void (0, addUsersToRoom_1.addUsersToRoomMethod)(payload.user._id, { rid: payload.room, users: usernames }, payload.user);
                void core_services_1.api.broadcast('notify.ephemeralMessage', payload.user._id, payload.room, {
                    msg: i18n_1.i18n.t('You_mentioned___mentions__but_theyre_not_in_this_room', {
                        mentions: joinedUsernames,
                        lng: payload.user.language,
                    }),
                    tmid: message.tmid,
                    _id: payload.message,
                    mentions,
                });
                return;
            }
            if (actionId === 'share-message') {
                const sub = yield models_1.Subscriptions.findOneByRoomIdAndUserId(payload.room, payload.user._id, { projection: { t: 1, rid: 1, name: 1 } });
                // this should exist since the event is fired from withing the room (e.g the user sent a message)
                if (!sub) {
                    throw new Error('Mention bot - Failed to retrieve room information');
                }
                const roomPath = roomCoordinator_1.roomCoordinator.getRouteLink(sub.t, { rid: sub.rid, name: sub.name });
                if (!roomPath) {
                    throw new Error('Mention bot - Failed to retrieve path to room');
                }
                const messageText = i18n_1.i18n.t('Youre_not_a_part_of__channel__and_I_mentioned_you_there', {
                    channel: `#${sub.name}`,
                    lng: payload.user.language,
                });
                const link = new URL(meteor_1.Meteor.absoluteUrl(roomPath));
                link.searchParams.set('msg', message._id);
                const text = `[ ](${link.toString()})\n${messageText}`;
                // forwards message to all DMs
                yield (0, processWebhookMessage_1.processWebhookMessage)({
                    roomId: mentions.map(({ _id }) => _id),
                    text,
                }, payload.user);
                void core_services_1.api.broadcast('notify.ephemeralMessage', payload.user._id, payload.room, {
                    msg: i18n_1.i18n.t('You_mentioned___mentions__but_theyre_not_in_this_room_You_let_them_know_via_dm', {
                        mentions: joinedUsernames,
                        lng: payload.user.language,
                    }),
                    tmid: message.tmid,
                    _id: payload.message,
                    mentions,
                });
            }
        });
    }
}
exports.MentionModule = MentionModule;
