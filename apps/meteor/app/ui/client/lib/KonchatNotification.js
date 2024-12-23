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
exports.KonchatNotification = void 0;
const random_1 = require("@rocket.chat/random");
const meteor_1 = require("meteor/meteor");
const reactive_var_1 = require("meteor/reactive-var");
const RoomManager_1 = require("../../../../client/lib/RoomManager");
const onClientMessageReceived_1 = require("../../../../client/lib/onClientMessageReceived");
const getAvatarAsPng_1 = require("../../../../client/lib/utils/getAvatarAsPng");
const RouterProvider_1 = require("../../../../client/providers/RouterProvider");
const stringUtils_1 = require("../../../../lib/utils/stringUtils");
const CustomSounds_1 = require("../../../custom-sounds/client/lib/CustomSounds");
const client_1 = require("../../../e2e/client");
const client_2 = require("../../../models/client");
const client_3 = require("../../../utils/client");
const getUserAvatarURL_1 = require("../../../utils/client/getUserAvatarURL");
const getUserNotificationsSoundVolume_1 = require("../../../utils/client/getUserNotificationsSoundVolume");
const SDKClient_1 = require("../../../utils/client/lib/SDKClient");
class KonchatNotification {
    constructor() {
        this.notificationStatus = new reactive_var_1.ReactiveVar(undefined);
    }
    getDesktopPermission() {
        if (window.Notification && Notification.permission !== 'granted') {
            return Notification.requestPermission((status) => {
                this.notificationStatus.set(status);
            });
        }
    }
    notify(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (typeof window.Notification === 'undefined' || Notification.permission !== 'granted') {
                return;
            }
            if (!notification.payload) {
                return;
            }
            const { rid } = notification.payload;
            if (!rid) {
                return;
            }
            const message = yield (0, onClientMessageReceived_1.onClientMessageReceived)({
                rid,
                msg: notification.text,
                notification: true,
            });
            const requireInteraction = (0, client_3.getUserPreference)(meteor_1.Meteor.userId(), 'desktopNotificationRequireInteraction');
            const n = new Notification(notification.title, {
                icon: notification.icon || (0, getUserAvatarURL_1.getUserAvatarURL)((_a = notification.payload.sender) === null || _a === void 0 ? void 0 : _a.username),
                body: (0, stringUtils_1.stripTags)(message.msg),
                tag: notification.payload._id,
                canReply: true,
                silent: true,
                requireInteraction,
            });
            const notificationDuration = !requireInteraction ? ((_b = notification.duration) !== null && _b !== void 0 ? _b : 0) - 0 || 10 : -1;
            if (notificationDuration > 0) {
                setTimeout(() => n.close(), notificationDuration * 1000);
            }
            if (n.addEventListener) {
                n.addEventListener('reply', ({ response }) => void SDKClient_1.sdk.call('sendMessage', {
                    _id: random_1.Random.id(),
                    rid,
                    msg: response,
                }));
            }
            n.onclick = function () {
                var _a;
                this.close();
                window.focus();
                if (!notification.payload._id || !notification.payload.rid || !notification.payload.name) {
                    return;
                }
                switch ((_a = notification.payload) === null || _a === void 0 ? void 0 : _a.type) {
                    case 'd':
                        return RouterProvider_1.router.navigate({
                            pattern: '/direct/:rid/:tab?/:context?',
                            params: Object.assign({ rid: notification.payload.rid }, (notification.payload.tmid && {
                                tab: 'thread',
                                context: notification.payload.tmid,
                            })),
                            search: Object.assign(Object.assign({}, RouterProvider_1.router.getSearchParameters()), { jump: notification.payload._id }),
                        });
                    case 'c':
                        return RouterProvider_1.router.navigate({
                            pattern: '/channel/:name/:tab?/:context?',
                            params: Object.assign({ name: notification.payload.name }, (notification.payload.tmid && {
                                tab: 'thread',
                                context: notification.payload.tmid,
                            })),
                            search: Object.assign(Object.assign({}, RouterProvider_1.router.getSearchParameters()), { jump: notification.payload._id }),
                        });
                    case 'p':
                        return RouterProvider_1.router.navigate({
                            pattern: '/group/:name/:tab?/:context?',
                            params: Object.assign({ name: notification.payload.name }, (notification.payload.tmid && {
                                tab: 'thread',
                                context: notification.payload.tmid,
                            })),
                            search: Object.assign(Object.assign({}, RouterProvider_1.router.getSearchParameters()), { jump: notification.payload._id }),
                        });
                    case 'l':
                        return RouterProvider_1.router.navigate({
                            pattern: '/live/:id/:tab?/:context?',
                            params: {
                                id: notification.payload.rid,
                                tab: 'room-info',
                            },
                            search: Object.assign(Object.assign({}, RouterProvider_1.router.getSearchParameters()), { jump: notification.payload._id }),
                        });
                }
            };
        });
    }
    showDesktop(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            if (!notification.payload.rid) {
                return;
            }
            if (((_a = notification.payload) === null || _a === void 0 ? void 0 : _a.rid) === RoomManager_1.RoomManager.opened &&
                (typeof window.document.hasFocus === 'function' ? window.document.hasFocus() : undefined)) {
                return;
            }
            if (((_b = meteor_1.Meteor.user()) === null || _b === void 0 ? void 0 : _b.status) === 'busy') {
                return;
            }
            if (((_d = (_c = notification.payload) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.t) === 'e2e') {
                const e2eRoom = yield client_1.e2e.getInstanceByRoomId(notification.payload.rid);
                if (e2eRoom) {
                    notification.text = (yield e2eRoom.decrypt(notification.payload.message.msg)).text;
                }
            }
            return (0, getAvatarAsPng_1.getAvatarAsPng)((_f = (_e = notification.payload) === null || _e === void 0 ? void 0 : _e.sender) === null || _f === void 0 ? void 0 : _f.username, (avatarAsPng) => {
                notification.icon = avatarAsPng;
                return this.notify(notification);
            });
        });
    }
    newMessage(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (((_a = meteor_1.Meteor.user()) === null || _a === void 0 ? void 0 : _a.status) === 'busy') {
                return;
            }
            const userId = meteor_1.Meteor.userId();
            const newMessageNotification = (0, client_3.getUserPreference)(userId, 'newMessageNotification');
            const audioVolume = (0, getUserNotificationsSoundVolume_1.getUserNotificationsSoundVolume)(userId);
            if (!rid) {
                return;
            }
            const sub = client_2.Subscriptions.findOne({ rid }, { fields: { audioNotificationValue: 1 } });
            if (!sub || sub.audioNotificationValue === 'none') {
                return;
            }
            try {
                if (sub.audioNotificationValue && sub.audioNotificationValue !== '0') {
                    void CustomSounds_1.CustomSounds.play(sub.audioNotificationValue, {
                        volume: Number((audioVolume / 100).toPrecision(2)),
                    });
                    return;
                }
                if (newMessageNotification && newMessageNotification !== 'none') {
                    void CustomSounds_1.CustomSounds.play(newMessageNotification, {
                        volume: Number((audioVolume / 100).toPrecision(2)),
                    });
                }
            }
            catch (e) {
                // do nothing
            }
        });
    }
    newRoom(rid) {
        Tracker.nonreactive(() => {
            let newRoomSound = Session.get('newRoomSound');
            if (newRoomSound) {
                newRoomSound = [...newRoomSound, rid];
            }
            else {
                newRoomSound = [rid];
            }
            return Session.set('newRoomSound', newRoomSound);
        });
    }
    removeRoomNotification(rid) {
        var _a;
        let newRoomSound = (_a = Session.get('newRoomSound')) !== null && _a !== void 0 ? _a : [];
        newRoomSound = newRoomSound.filter((_rid) => _rid !== rid);
        Tracker.nonreactive(() => Session.set('newRoomSound', newRoomSound));
        const link = document.querySelector(`.link-room-${rid}`);
        link === null || link === void 0 ? void 0 : link.classList.remove('new-room-highlight');
    }
}
const instance = new KonchatNotification();
exports.KonchatNotification = instance;
