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
exports.findOrCreateInvite = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const meteor_1 = require("meteor/meteor");
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const roomCoordinator_1 = require("../../../../server/lib/rooms/roomCoordinator");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../settings/server");
const getURL_1 = require("../../../utils/server/getURL");
function getInviteUrl(invite) {
    const { _id } = invite;
    const useDirectLink = server_1.settings.get('Accounts_Registration_InviteUrlType') === 'direct';
    return (0, getURL_1.getURL)(`invite/${_id}`, {
        full: useDirectLink,
        cloud: !useDirectLink,
        cloud_route: 'invite',
    }, server_1.settings.get('DeepLink_Url'));
}
const possibleDays = [0, 1, 7, 15, 30];
const possibleUses = [0, 1, 5, 10, 25, 50, 100];
const findOrCreateInvite = (userId, invite) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || !invite) {
        return false;
    }
    if (!invite.rid) {
        throw new meteor_1.Meteor.Error('error-the-field-is-required', 'The field rid is required', {
            method: 'findOrCreateInvite',
            field: 'rid',
        });
    }
    if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'create-invite-links', invite.rid))) {
        throw new meteor_1.Meteor.Error('not_authorized');
    }
    const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(invite.rid, userId, {
        projection: { _id: 1 },
    });
    if (!subscription) {
        throw new meteor_1.Meteor.Error('error-invalid-room', 'The rid field is invalid', {
            method: 'findOrCreateInvite',
            field: 'rid',
        });
    }
    const room = yield models_1.Rooms.findOneById(invite.rid);
    if (!room) {
        throw new meteor_1.Meteor.Error('error-invalid-room', 'The rid field is invalid', {
            method: 'findOrCreateInvite',
            field: 'rid',
        });
    }
    if (!(yield roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t).allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.INVITE, userId))) {
        throw new meteor_1.Meteor.Error('error-room-type-not-allowed', 'Cannot create invite links for this room type', {
            method: 'findOrCreateInvite',
        });
    }
    const { days = 1, maxUses = 0 } = invite;
    if (!possibleDays.includes(days)) {
        throw new meteor_1.Meteor.Error('invalid-number-of-days', 'Invite should expire in 1, 7, 15 or 30 days, or send 0 to never expire.');
    }
    if (!possibleUses.includes(maxUses)) {
        throw new meteor_1.Meteor.Error('invalid-number-of-uses', 'Invite should be valid for 1, 5, 10, 25, 50, 100 or infinite (0) uses.');
    }
    // Before anything, let's check if there's an existing invite with the same settings for the same channel and user and that has not yet expired.
    const existing = yield models_1.Invites.findOneByUserRoomMaxUsesAndExpiration(userId, invite.rid, maxUses, days);
    // If an existing invite was found, return it's _id instead of creating a new one.
    if (existing) {
        existing.url = getInviteUrl(existing);
        return existing;
    }
    const _id = random_1.Random.id(6);
    // insert invite
    const createdAt = new Date();
    let expires = null;
    if (days > 0) {
        expires = new Date(createdAt);
        expires.setDate(expires.getDate() + days);
    }
    const createInvite = {
        _id,
        days,
        maxUses,
        rid: invite.rid,
        userId,
        createdAt,
        expires,
        url: '',
        uses: 0,
    };
    yield models_1.Invites.insertOne(createInvite);
    void core_services_1.api.broadcast('notify.updateInvites', userId, { invite: createInvite });
    createInvite.url = getInviteUrl(createInvite);
    return createInvite;
});
exports.findOrCreateInvite = findOrCreateInvite;
