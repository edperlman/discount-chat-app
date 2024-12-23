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
exports.removeUserReaction = void 0;
exports.setReaction = setReaction;
exports.executeSetReaction = executeSetReaction;
const apps_1 = require("@rocket.chat/apps");
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../lib/callbacks");
const i18n_1 = require("../../../server/lib/i18n");
const server_1 = require("../../authorization/server");
const hasPermission_1 = require("../../authorization/server/functions/hasPermission");
const server_2 = require("../../emoji/server");
const isTheLastMessage_1 = require("../../lib/server/functions/isTheLastMessage");
const notifyListener_1 = require("../../lib/server/lib/notifyListener");
const removeUserReaction = (message, reaction, username) => {
    if (!message.reactions) {
        return message;
    }
    const idx = message.reactions[reaction].usernames.indexOf(username);
    // user not found in reaction array
    if (idx === -1) {
        return message;
    }
    message.reactions[reaction].usernames.splice(idx, 1);
    if (!message.reactions[reaction].usernames.length) {
        delete message.reactions[reaction];
    }
    return message;
};
exports.removeUserReaction = removeUserReaction;
function setReaction(room, user, message, reaction, userAlreadyReacted) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        yield core_services_1.Message.beforeReacted(message, room);
        if (Array.isArray(room.muted) && room.muted.includes(user.username)) {
            throw new meteor_1.Meteor.Error('error-not-allowed', i18n_1.i18n.t('You_have_been_muted', { lng: user.language }), {
                rid: room._id,
            });
        }
        if (room.ro === true && !room.reactWhenReadOnly && !(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'post-readonly', room._id))) {
            // Unless the user was manually unmuted
            if (!(room.unmuted || []).includes(user.username)) {
                throw new Error("You can't send messages because the room is readonly.");
            }
        }
        let isReacted;
        if (userAlreadyReacted) {
            const oldMessage = JSON.parse(JSON.stringify(message));
            (0, exports.removeUserReaction)(message, reaction, user.username);
            if (Object.keys(message.reactions || {}).length === 0) {
                delete message.reactions;
                yield models_1.Messages.unsetReactions(message._id);
                if ((0, isTheLastMessage_1.isTheLastMessage)(room, message)) {
                    yield models_1.Rooms.unsetReactionsInLastMessage(room._id);
                }
            }
            else {
                yield models_1.Messages.setReactions(message._id, message.reactions);
                if ((0, isTheLastMessage_1.isTheLastMessage)(room, message)) {
                    yield models_1.Rooms.setReactionsInLastMessage(room._id, message.reactions);
                }
            }
            void callbacks_1.callbacks.run('afterUnsetReaction', message, { user, reaction, shouldReact: false, oldMessage });
            isReacted = false;
        }
        else {
            if (!message.reactions) {
                message.reactions = {};
            }
            if (!message.reactions[reaction]) {
                message.reactions[reaction] = {
                    usernames: [],
                };
            }
            message.reactions[reaction].usernames.push(user.username);
            yield models_1.Messages.setReactions(message._id, message.reactions);
            if ((0, isTheLastMessage_1.isTheLastMessage)(room, message)) {
                yield models_1.Rooms.setReactionsInLastMessage(room._id, message.reactions);
            }
            void callbacks_1.callbacks.run('afterSetReaction', message, { user, reaction, shouldReact: true });
            isReacted = true;
        }
        void ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPostMessageReacted, message, user, reaction, isReacted));
        void (0, notifyListener_1.notifyOnMessageChange)({
            id: message._id,
        });
    });
}
function executeSetReaction(userId, reaction, messageParam, shouldReact) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if the emoji is valid before proceeding
        const reactionWithoutColons = reaction.replace(/:/g, '');
        reaction = `:${reactionWithoutColons}:`;
        if (!server_2.emoji.list[reaction] && (yield models_1.EmojiCustom.countByNameOrAlias(reactionWithoutColons)) === 0) {
            throw new meteor_1.Meteor.Error('error-not-allowed', 'Invalid emoji provided.', {
                method: 'setReaction',
            });
        }
        const user = yield models_1.Users.findOneById(userId);
        if (!user) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'setReaction' });
        }
        const message = typeof messageParam === 'string' ? yield models_1.Messages.findOneById(messageParam) : messageParam;
        if (!message) {
            throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'setReaction' });
        }
        const userAlreadyReacted = message.reactions && Boolean(message.reactions[reaction]) && message.reactions[reaction].usernames.includes(user.username);
        // When shouldReact was not informed, toggle the reaction.
        if (shouldReact === undefined) {
            shouldReact = !userAlreadyReacted;
        }
        if (userAlreadyReacted === shouldReact) {
            return;
        }
        const room = yield models_1.Rooms.findOneById(message.rid, { projection: { _id: 1, ro: 1, muted: 1, reactWhenReadOnly: 1, lastMessage: 1, t: 1, prid: 1, federated: 1 } });
        if (!room) {
            throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'setReaction' });
        }
        if (!(yield (0, server_1.canAccessRoomAsync)(room, user))) {
            throw new meteor_1.Meteor.Error('not-authorized', 'Not Authorized', { method: 'setReaction' });
        }
        return setReaction(room, user, message, reaction, userAlreadyReacted);
    });
}
meteor_1.Meteor.methods({
    setReaction(reaction, messageId, shouldReact) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'setReaction' });
            }
            try {
                yield executeSetReaction(uid, reaction, messageId, shouldReact);
            }
            catch (e) {
                if (e.error === 'error-not-allowed' && e.reason && e.details && e.details.rid) {
                    void core_services_1.api.broadcast('notify.ephemeralMessage', uid, e.details.rid, {
                        msg: e.reason,
                    });
                    return false;
                }
                throw e;
            }
        });
    },
});
