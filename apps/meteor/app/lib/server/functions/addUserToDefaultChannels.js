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
exports.addUserToDefaultChannels = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const getDefaultChannels_1 = require("./getDefaultChannels");
const callbacks_1 = require("../../../../lib/callbacks");
const getSubscriptionAutotranslateDefaultConfig_1 = require("../../../../server/lib/getSubscriptionAutotranslateDefaultConfig");
const getDefaultSubscriptionPref_1 = require("../../../utils/lib/getDefaultSubscriptionPref");
const notifyListener_1 = require("../lib/notifyListener");
const addUserToDefaultChannels = function (user, silenced) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        yield callbacks_1.callbacks.run('beforeJoinDefaultChannels', user);
        const defaultRooms = yield (0, getDefaultChannels_1.getDefaultChannels)();
        try {
            for (var _d = true, defaultRooms_1 = __asyncValues(defaultRooms), defaultRooms_1_1; defaultRooms_1_1 = yield defaultRooms_1.next(), _a = defaultRooms_1_1.done, !_a; _d = true) {
                _c = defaultRooms_1_1.value;
                _d = false;
                const room = _c;
                if (!(yield models_1.Subscriptions.findOneByRoomIdAndUserId(room._id, user._id, { projection: { _id: 1 } }))) {
                    const autoTranslateConfig = (0, getSubscriptionAutotranslateDefaultConfig_1.getSubscriptionAutotranslateDefaultConfig)(user);
                    // Add a subscription to this user
                    const { insertedId } = yield models_1.Subscriptions.createWithRoomAndUser(room, user, Object.assign(Object.assign(Object.assign({ ts: new Date(), open: true, alert: true, unread: 1, userMentions: 1, groupMentions: 0 }, (room.favorite && { f: true })), autoTranslateConfig), (0, getDefaultSubscriptionPref_1.getDefaultSubscriptionPref)(user)));
                    if (insertedId) {
                        void (0, notifyListener_1.notifyOnSubscriptionChangedById)(insertedId, 'inserted');
                    }
                    // Insert user joined message
                    if (!silenced) {
                        yield core_services_1.Message.saveSystemMessage('uj', room._id, user.username || '', user);
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = defaultRooms_1.return)) yield _b.call(defaultRooms_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
};
exports.addUserToDefaultChannels = addUserToDefaultChannels;
