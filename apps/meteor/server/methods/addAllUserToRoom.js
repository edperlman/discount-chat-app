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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const notifyListener_1 = require("../../app/lib/server/lib/notifyListener");
const server_1 = require("../../app/settings/server");
const getDefaultSubscriptionPref_1 = require("../../app/utils/lib/getDefaultSubscriptionPref");
const callbacks_1 = require("../../lib/callbacks");
const getSubscriptionAutotranslateDefaultConfig_1 = require("../lib/getSubscriptionAutotranslateDefaultConfig");
meteor_1.Meteor.methods({
    addAllUserToRoom(rid_1) {
        return __awaiter(this, arguments, void 0, function* (rid, activeUsersOnly = false) {
            var _a, e_1, _b, _c;
            (0, check_1.check)(rid, String);
            (0, check_1.check)(activeUsersOnly, Boolean);
            if (!this.userId || !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'add-all-to-room'))) {
                throw new meteor_1.Meteor.Error(403, 'Access to Method Forbidden', {
                    method: 'addAllToRoom',
                });
            }
            const userFilter = {};
            if (activeUsersOnly === true) {
                userFilter.active = true;
            }
            const users = yield models_1.Users.find(userFilter).toArray();
            if (users.length > server_1.settings.get('API_User_Limit')) {
                throw new meteor_1.Meteor.Error('error-user-limit-exceeded', 'User Limit Exceeded', {
                    method: 'addAllToRoom',
                });
            }
            const room = yield models_1.Rooms.findOneById(rid);
            if (!room) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                    method: 'addAllToRoom',
                });
            }
            const now = new Date();
            try {
                for (var _d = true, users_1 = __asyncValues(users), users_1_1; users_1_1 = yield users_1.next(), _a = users_1_1.done, !_a; _d = true) {
                    _c = users_1_1.value;
                    _d = false;
                    const user = _c;
                    const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, user._id);
                    if (subscription != null) {
                        continue;
                    }
                    yield callbacks_1.callbacks.run('beforeJoinRoom', user, room);
                    const autoTranslateConfig = (0, getSubscriptionAutotranslateDefaultConfig_1.getSubscriptionAutotranslateDefaultConfig)(user);
                    const { insertedId } = yield models_1.Subscriptions.createWithRoomAndUser(room, user, Object.assign(Object.assign({ ts: now, open: true, alert: true, unread: 1, userMentions: 1, groupMentions: 0 }, autoTranslateConfig), (0, getDefaultSubscriptionPref_1.getDefaultSubscriptionPref)(user)));
                    if (insertedId) {
                        void (0, notifyListener_1.notifyOnSubscriptionChangedById)(insertedId, 'inserted');
                    }
                    yield core_services_1.Message.saveSystemMessage('uj', rid, user.username || '', user, { ts: now });
                    yield callbacks_1.callbacks.run('afterJoinRoom', user, room);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = users_1.return)) yield _b.call(users_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return true;
        });
    },
});
