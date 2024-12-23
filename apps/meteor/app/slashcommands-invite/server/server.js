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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const i18n_1 = require("../../../server/lib/i18n");
const addUsersToRoom_1 = require("../../lib/server/methods/addUsersToRoom");
const server_1 = require("../../settings/server");
const slashCommand_1 = require("../../utils/server/slashCommand");
/*
 * Invite is a named function that will replace /invite commands
 * @param {Object} message - The message object
 */
slashCommand_1.slashCommands.add({
    command: 'invite',
    callback: (_a) => __awaiter(void 0, [_a], void 0, function* ({ params, message, userId }) {
        var _b, e_1, _c, _d;
        const usernames = params
            .split(/[\s,]/)
            .map((username) => username.replace(/(^@)|( @)/, ''))
            .filter((a) => a !== '');
        if (usernames.length === 0) {
            return;
        }
        const users = yield models_1.Users.find({
            username: {
                $in: usernames,
            },
        }).toArray();
        if (users.length === 0) {
            void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                msg: i18n_1.i18n.t('User_doesnt_exist', {
                    postProcess: 'sprintf',
                    sprintf: [usernames.join(' @')],
                    lng: server_1.settings.get('Language') || 'en',
                }),
            });
            return;
        }
        const usersFiltered = [];
        try {
            for (var _e = true, users_1 = __asyncValues(users), users_1_1; users_1_1 = yield users_1.next(), _b = users_1_1.done, !_b; _e = true) {
                _d = users_1_1.value;
                _e = false;
                const user = _d;
                const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(message.rid, user._id, {
                    projection: { _id: 1 },
                });
                if (subscription == null) {
                    usersFiltered.push(user);
                    continue;
                }
                const usernameStr = user.username;
                void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                    msg: i18n_1.i18n.t('Username_is_already_in_here', {
                        postProcess: 'sprintf',
                        sprintf: [usernameStr],
                        lng: server_1.settings.get('Language') || 'en',
                    }),
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_b && (_c = users_1.return)) yield _c.call(users_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const inviter = yield models_1.Users.findOneById(userId);
        if (!inviter) {
            throw new meteor_1.Meteor.Error('error-user-not-found', 'Inviter not found', {
                method: 'slashcommand-invite',
            });
        }
        yield Promise.all(usersFiltered.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                return yield (0, addUsersToRoom_1.addUsersToRoomMethod)(userId, {
                    rid: message.rid,
                    users: [user.username || ''],
                }, inviter);
            }
            catch ({ error }) {
                if (typeof error !== 'string') {
                    return;
                }
                if (error === 'cant-invite-for-direct-room') {
                    void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                        msg: i18n_1.i18n.t('Cannot_invite_users_to_direct_rooms', { lng: server_1.settings.get('Language') || 'en' }),
                    });
                }
                else {
                    void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                        msg: i18n_1.i18n.t(error, { lng: server_1.settings.get('Language') || 'en' }),
                    });
                }
            }
        })));
    }),
    options: {
        description: 'Invite_user_to_join_channel',
        params: '@username',
        permission: 'add-user-to-joined-room',
    },
});
