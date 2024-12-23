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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const deprecationWarningLogger_1 = require("../../../../../app/lib/server/lib/deprecationWarningLogger");
const RoutingManager_1 = require("../../../../../app/livechat/server/lib/RoutingManager");
const callbacks_1 = require("../../../../../lib/callbacks");
const i18n_1 = require("../../../../../server/lib/i18n");
function resolveOnHoldCommentInfo(options, room, onHoldChatResumedBy) {
    return __awaiter(this, void 0, void 0, function* () {
        if (options.clientAction) {
            return i18n_1.i18n.t('Omnichannel_on_hold_chat_resumed_manually', {
                user: onHoldChatResumedBy.name || onHoldChatResumedBy.username,
            });
        }
        const { v: { _id: visitorId }, } = room;
        const visitor = yield models_1.LivechatVisitors.findOneEnabledById(visitorId, {
            projection: { name: 1, username: 1 },
        });
        if (!visitor) {
            throw new meteor_1.Meteor.Error('error-invalid_visitor', 'Visitor Not found');
        }
        const guest = visitor.name || visitor.username;
        return i18n_1.i18n.t('Omnichannel_on_hold_chat_automatically', { guest });
    });
}
meteor_1.Meteor.methods({
    'livechat:resumeOnHold'(roomId_1) {
        return __awaiter(this, arguments, void 0, function* (roomId, options = { clientAction: false }) {
            deprecationWarningLogger_1.methodDeprecationLogger.warn('Method "livechat:resumeOnHold" is deprecated and will be removed in next major version. Please use "livechat/room.resumeOnHold" API instead.');
            const room = yield models_1.LivechatRooms.findOneById(roomId);
            if (!room || !(0, core_typings_1.isOmnichannelRoom)(room)) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                    method: 'livechat:resumeOnHold',
                });
            }
            if (!room.onHold) {
                throw new meteor_1.Meteor.Error('room-closed', 'Room is not OnHold', {
                    method: 'livechat:resumeOnHold',
                });
            }
            const inquiry = yield models_1.LivechatInquiry.findOneByRoomId(roomId, {});
            if (!inquiry) {
                throw new meteor_1.Meteor.Error('inquiry-not-found', 'Error! No inquiry found for this room', {
                    method: 'livechat:resumeOnHold',
                });
            }
            if (!room.servedBy) {
                throw new meteor_1.Meteor.Error('error-unserved-rooms-cannot-be-placed-onhold', 'Error! Un-served rooms cannot be placed OnHold', {
                    method: 'livechat:resumeOnHold',
                });
            }
            const { servedBy: { _id: agentId, username }, } = room;
            yield RoutingManager_1.RoutingManager.takeInquiry(inquiry, { agentId, username }, options, room);
            const onHoldChatResumedBy = options.clientAction ? yield meteor_1.Meteor.userAsync() : yield models_1.Users.findOneById('rocket.cat');
            if (!onHoldChatResumedBy) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'livechat:resumeOnHold',
                });
            }
            const comment = yield resolveOnHoldCommentInfo(options, room, onHoldChatResumedBy);
            yield core_services_1.Message.saveSystemMessage('omnichannel_on_hold_chat_resumed', roomId, '', onHoldChatResumedBy, {
                comment,
            });
            setImmediate(() => callbacks_1.callbacks.run('livechat:afterOnHoldChatResumed', room));
        });
    },
});
