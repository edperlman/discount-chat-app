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
exports.shouldRemoveOrChangeOwner = shouldRemoveOrChangeOwner;
exports.getSubscribedRoomsForUserWithDetails = getSubscribedRoomsForUserWithDetails;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../authorization/server");
function shouldRemoveOrChangeOwner(subscribedRooms) {
    return subscribedRooms.some(({ shouldBeRemoved, shouldChangeOwner }) => shouldBeRemoved || shouldChangeOwner);
}
function getSubscribedRoomsForUserWithDetails(userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, assignNewOwner = true, roomIds = []) {
        var _a, e_1, _b, _c, _d, e_2, _e, _f;
        const subscribedRooms = [];
        const cursor = roomIds.length > 0 ? models_1.Subscriptions.findByUserIdAndRoomIds(userId, roomIds) : models_1.Subscriptions.findByUserIdExceptType(userId, 'd');
        try {
            // Iterate through all the rooms the user is subscribed to, to check if he is the last owner of any of them.
            for (var _g = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _a = cursor_1_1.done, !_a; _g = true) {
                _c = cursor_1_1.value;
                _g = false;
                const subscription = _c;
                const roomData = {
                    rid: subscription.rid,
                    t: subscription.t,
                    shouldBeRemoved: false,
                    shouldChangeOwner: false,
                    userIsLastOwner: false,
                    newOwner: null,
                };
                if ((0, server_1.subscriptionHasRole)(subscription, 'owner')) {
                    // Fetch the number of owners
                    const numOwners = yield models_1.Subscriptions.countByRoomIdAndRoles(subscription.rid, ['owner']);
                    // If it's only one, then this user is the only owner.
                    roomData.userIsLastOwner = numOwners === 1;
                    if (numOwners === 1 && assignNewOwner) {
                        // Let's check how many subscribers the room has.
                        const options = { projection: { 'u._id': 1 }, sort: { ts: 1 } };
                        const subscribersCursor = models_1.Subscriptions.findByRoomId(subscription.rid, options);
                        try {
                            for (var _h = true, subscribersCursor_1 = (e_2 = void 0, __asyncValues(subscribersCursor)), subscribersCursor_1_1; subscribersCursor_1_1 = yield subscribersCursor_1.next(), _d = subscribersCursor_1_1.done, !_d; _h = true) {
                                _f = subscribersCursor_1_1.value;
                                _h = false;
                                const { u: { _id: uid }, } = _f;
                                // If we already changed the owner or this subscription is for the user we are removing, then don't try to give it ownership
                                if (roomData.shouldChangeOwner || uid === userId) {
                                    continue;
                                }
                                const newOwner = yield models_1.Users.findOneActiveById(uid, { projection: { _id: 1 } });
                                if (!newOwner) {
                                    continue;
                                }
                                roomData.newOwner = uid;
                                roomData.shouldChangeOwner = true;
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (!_h && !_d && (_e = subscribersCursor_1.return)) yield _e.call(subscribersCursor_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        // If there's no subscriber available to be the new owner and it's not a public room, we can remove it.
                        if (!roomData.shouldChangeOwner && roomData.t !== 'c') {
                            roomData.shouldBeRemoved = true;
                        }
                    }
                }
                else if (roomData.t !== 'c') {
                    // If the user is not an owner, remove the room if the user is the only subscriber
                    roomData.shouldBeRemoved = (yield models_1.Subscriptions.countByRoomId(roomData.rid)) === 1;
                }
                subscribedRooms.push(roomData);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_g && !_a && (_b = cursor_1.return)) yield _b.call(cursor_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return subscribedRooms;
    });
}
