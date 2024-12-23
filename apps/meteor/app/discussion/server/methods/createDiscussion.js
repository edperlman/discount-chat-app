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
exports.createDiscussion = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const i18n_1 = require("../../../../server/lib/i18n");
const roomCoordinator_1 = require("../../../../server/lib/rooms/roomCoordinator");
const canSendMessage_1 = require("../../../authorization/server/functions/canSendMessage");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const addUserToRoom_1 = require("../../../lib/server/functions/addUserToRoom");
const attachMessage_1 = require("../../../lib/server/functions/attachMessage");
const createRoom_1 = require("../../../lib/server/functions/createRoom");
const sendMessage_1 = require("../../../lib/server/functions/sendMessage");
const afterSaveMessage_1 = require("../../../lib/server/lib/afterSaveMessage");
const server_1 = require("../../../settings/server");
const getParentRoom = (rid) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield models_1.Rooms.findOne(rid);
    return room && (room.prid ? models_1.Rooms.findOne(room.prid, { projection: { _id: 1 } }) : room);
});
function createDiscussionMessage(rid, user, drid, msg, messageEmbedded) {
    return __awaiter(this, void 0, void 0, function* () {
        return core_services_1.Message.saveSystemMessage('discussion-created', rid, msg, user, Object.assign({ drid }, (messageEmbedded && { attachments: [messageEmbedded] })));
    });
}
function mentionMessage(rid_1, _a, messageEmbedded_1) {
    return __awaiter(this, arguments, void 0, function* (rid, { _id, username, name }, messageEmbedded) {
        if (!username) {
            return null;
        }
        yield models_1.Messages.insertOne(Object.assign({ rid, msg: '', u: { _id, username, name }, ts: new Date(), _updatedAt: new Date() }, (messageEmbedded && { attachments: [messageEmbedded] })));
    });
}
const create = (_a) => __awaiter(void 0, [_a], void 0, function* ({ prid, pmid, t_name: discussionName, reply, users, user, encrypted, topic, }) {
    // if you set both, prid and pmid, and the rooms dont match... should throw an error)
    let message = null;
    if (pmid) {
        message = yield models_1.Messages.findOneById(pmid);
        if (!message) {
            throw new meteor_1.Meteor.Error('error-invalid-message', 'Invalid message', {
                method: 'DiscussionCreation',
            });
        }
        if (prid) {
            const parentRoom = yield getParentRoom(message.rid);
            if (!parentRoom || prid !== parentRoom._id) {
                throw new meteor_1.Meteor.Error('error-invalid-arguments', 'Root message room ID does not match parent room ID ', {
                    method: 'DiscussionCreation',
                });
            }
        }
        else {
            prid = message.rid;
        }
    }
    if (!prid) {
        throw new meteor_1.Meteor.Error('error-invalid-arguments', 'Missing parent room ID', { method: 'DiscussionCreation' });
    }
    let parentRoom;
    try {
        parentRoom = yield (0, canSendMessage_1.canSendMessageAsync)(prid, { uid: user._id, username: user.username, type: user.type });
    }
    catch (error) {
        throw new meteor_1.Meteor.Error(error.message);
    }
    if (parentRoom.prid) {
        throw new meteor_1.Meteor.Error('error-nested-discussion', 'Cannot create nested discussions', {
            method: 'DiscussionCreation',
        });
    }
    if (typeof encrypted !== 'boolean') {
        encrypted = Boolean(parentRoom.encrypted);
    }
    if (encrypted && reply) {
        throw new meteor_1.Meteor.Error('error-invalid-arguments', 'Encrypted discussions must not receive an initial reply.', {
            method: 'DiscussionCreation',
        });
    }
    if (pmid) {
        const discussionAlreadyExists = yield models_1.Rooms.findOne({
            prid,
            pmid,
        }, {
            projection: { _id: 1 },
        });
        if (discussionAlreadyExists) {
            // do not allow multiple discussions to the same message'\
            yield (0, addUserToRoom_1.addUserToRoom)(discussionAlreadyExists._id, user);
            return Object.assign(Object.assign({}, discussionAlreadyExists), { rid: discussionAlreadyExists._id });
        }
    }
    const name = random_1.Random.id();
    // auto invite the replied message owner
    const invitedUsers = message ? [message.u.username, ...users] : users;
    const type = yield roomCoordinator_1.roomCoordinator.getRoomDirectives(parentRoom.t).getDiscussionType(parentRoom);
    const description = parentRoom.encrypted ? '' : message === null || message === void 0 ? void 0 : message.msg;
    const discussionTopic = topic || parentRoom.name;
    if (!type) {
        throw new meteor_1.Meteor.Error('error-invalid-type', 'Cannot define discussion room type', {
            method: 'DiscussionCreation',
        });
    }
    const discussion = yield (0, createRoom_1.createRoom)(type, name, user, [...new Set(invitedUsers)].filter(Boolean), false, false, {
        fname: discussionName,
        description, // TODO discussions remove
        topic: discussionTopic,
        prid,
        encrypted,
    }, {
        creator: user._id,
    });
    let discussionMsg;
    if (message) {
        if (parentRoom.encrypted) {
            message.msg = i18n_1.i18n.t('Encrypted_message');
        }
        yield mentionMessage(discussion._id, user, (0, attachMessage_1.attachMessage)(message, parentRoom));
        discussionMsg = yield createDiscussionMessage(message.rid, user, discussion._id, discussionName, (0, attachMessage_1.attachMessage)(message, parentRoom));
    }
    else {
        discussionMsg = yield createDiscussionMessage(prid, user, discussion._id, discussionName);
    }
    if (reply) {
        yield (0, sendMessage_1.sendMessage)(user, { msg: reply }, discussion);
    }
    if (discussionMsg) {
        (0, afterSaveMessage_1.afterSaveMessageAsync)(discussionMsg, parentRoom);
    }
    return discussion;
});
const createDiscussion = (userId_1, _a) => __awaiter(void 0, [userId_1, _a], void 0, function* (userId, { prid, pmid, t_name: discussionName, reply, users, encrypted, topic }) {
    if (!server_1.settings.get('Discussion_enabled')) {
        throw new meteor_1.Meteor.Error('error-action-not-allowed', 'You are not allowed to create a discussion', { method: 'createDiscussion' });
    }
    if (!userId) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
            method: 'DiscussionCreation',
        });
    }
    if (!(yield (0, hasPermission_1.hasAtLeastOnePermissionAsync)(userId, ['start-discussion', 'start-discussion-other-user'], prid))) {
        throw new meteor_1.Meteor.Error('error-action-not-allowed', 'You are not allowed to create a discussion', { method: 'createDiscussion' });
    }
    const user = yield models_1.Users.findOneById(userId, { projection: { services: 0 } });
    if (!user) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
            method: 'createDiscussion',
        });
    }
    return create({ prid, pmid, t_name: discussionName, reply, users, user, encrypted, topic });
});
exports.createDiscussion = createDiscussion;
meteor_1.Meteor.methods({
    /**
     * Create discussion by room or message
     * @constructor
     * @param {string} prid - Parent Room Id - The room id, optional if you send pmid.
     * @param {string} pmid - Parent Message Id - Create the discussion by a message, optional.
     * @param {string} reply - The reply, optional
     * @param {string} t_name - discussion name
     * @param {string[]} users - users to be added
     * @param {boolean} encrypted - if the discussion's e2e encryption should be enabled.
     */
    createDiscussion(_a) {
        return __awaiter(this, arguments, void 0, function* ({ prid, pmid, t_name: discussionName, reply, users, encrypted }) {
            (0, check_1.check)(prid, check_1.Match.Maybe(String));
            (0, check_1.check)(pmid, check_1.Match.Maybe(String));
            (0, check_1.check)(reply, check_1.Match.Maybe(String));
            (0, check_1.check)(discussionName, String);
            (0, check_1.check)(users, [String]);
            (0, check_1.check)(encrypted, check_1.Match.Maybe(Boolean));
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'DiscussionCreation',
                });
            }
            return (0, exports.createDiscussion)(uid, { prid, pmid, t_name: discussionName, reply, users, encrypted });
        });
    },
});
