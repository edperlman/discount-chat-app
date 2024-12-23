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
exports.mentionServer = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const Mentions_1 = require("../../../../app/mentions/server/Mentions");
const server_1 = require("../../../../app/settings/server");
const i18n_1 = require("../../../lib/i18n");
class MentionQueries {
    getUsers(usernames) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniqueUsernames = [...new Set(usernames)];
            const teams = yield core_services_1.Team.listByNames(uniqueUsernames, { projection: { name: 1 } });
            const users = yield models_1.Users.find({ username: { $in: uniqueUsernames } }, { projection: { _id: 1, username: 1, name: 1 } }).toArray();
            const taggedUsers = users.map((user) => (Object.assign(Object.assign({}, user), { type: 'user' })));
            if (server_1.settings.get('Troubleshoot_Disable_Teams_Mention')) {
                return taggedUsers;
            }
            const taggedTeams = teams.map((team) => (Object.assign(Object.assign({}, team), { type: 'team' })));
            return [...taggedUsers, ...taggedTeams];
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Users.findOneById(userId);
        });
    }
    getTotalChannelMembers(rid) {
        return models_1.Subscriptions.countByRoomId(rid);
    }
    getChannels(channels) {
        return models_1.Rooms.find({
            $and: [
                {
                    $or: [
                        { $and: [{ $or: [{ federated: { $exists: false } }, { federated: false }], name: { $in: [...new Set(channels)] } }] },
                        { federated: true, fname: { $in: [...new Set(channels)] } },
                    ],
                },
            ],
            t: { $in: ['c', 'p'] },
        }, { projection: { _id: 1, name: 1, fname: 1, federated: 1 } }).toArray();
    }
}
const queries = new MentionQueries();
exports.mentionServer = new Mentions_1.MentionsServer({
    pattern: () => server_1.settings.get('UTF8_User_Names_Validation'),
    messageMaxAll: () => server_1.settings.get('Message_MaxAll'),
    getUsers: (usernames) => __awaiter(void 0, void 0, void 0, function* () { return queries.getUsers(usernames); }),
    getUser: (userId) => __awaiter(void 0, void 0, void 0, function* () { return queries.getUser(userId); }),
    getTotalChannelMembers: (rid) => queries.getTotalChannelMembers(rid),
    getChannels: (channels) => queries.getChannels(channels),
    onMaxRoomMembersExceeded(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sender, rid }) {
            // Get the language of the user for the error notification.
            const { language } = (yield this.getUser(sender._id)) || {};
            const msg = i18n_1.i18n.t('Group_mentions_disabled_x_members', { total: this.messageMaxAll(), lng: language });
            void core_services_1.api.broadcast('notify.ephemeralMessage', sender._id, rid, {
                msg,
            });
            // Also throw to stop propagation of 'sendMessage'.
            throw new core_services_1.MeteorError('error-action-not-allowed', msg, {
                method: 'filterATAllTag',
                action: msg,
            });
        });
    },
});
