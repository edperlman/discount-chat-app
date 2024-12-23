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
exports.NotificationsModule = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const Presence_1 = require("../../../app/notifications/server/lib/Presence");
const system_1 = require("../../lib/logger/system");
class NotificationsModule {
    constructor(Streamer) {
        this.Streamer = Streamer;
        this.streamAll = new this.Streamer('notify-all');
        this.streamLogged = new this.Streamer('notify-logged');
        this.streamRoom = new this.Streamer('notify-room');
        this.streamRoomUsers = new this.Streamer('notify-room-users');
        this.streamImporters = new this.Streamer('importers', { retransmit: false });
        this.streamRoles = new this.Streamer('roles');
        this.streamApps = new this.Streamer('apps', { retransmit: false });
        this.streamAppsEngine = new this.Streamer('apps-engine', { retransmit: false });
        this.streamCannedResponses = new this.Streamer('canned-responses');
        this.streamIntegrationHistory = new this.Streamer('integrationHistory');
        this.streamLivechatRoom = new this.Streamer('livechat-room');
        this.streamLivechatQueueData = new this.Streamer('livechat-inquiry-queue-observer');
        this.streamStdout = new this.Streamer('stdout');
        this.streamRoomData = new this.Streamer('room-data');
        this.streamPresence = Presence_1.StreamPresence.getInstance(Streamer, 'user-presence');
        this.streamRoomMessage = new this.Streamer('room-messages');
        this.streamRoomMessage.on('_afterPublish', (streamer, publication, eventName) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = publication._session;
            if (!userId) {
                return;
            }
            const userEvent = (clientAction, { rid }) => {
                switch (clientAction) {
                    case 'removed':
                        streamer.removeListener(userId, userEvent);
                        const sub = [...streamer.subscriptions].find((sub) => sub.eventName === rid && sub.subscription.userId === userId);
                        sub && streamer.removeSubscription(sub, eventName);
                        break;
                }
            };
            streamer.on(userId, userEvent);
            publication.onStop(() => streamer.removeListener(userId, userEvent));
        }));
        this.streamUser = new this.Streamer('notify-user');
        this.streamLocal = new this.Streamer('local');
    }
    configure() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        this.streamRoomMessage.allowWrite('none');
        this.streamRoomMessage.allowRead(function (eventName, extraData) {
            return __awaiter(this, void 0, void 0, function* () {
                const room = yield models_1.Rooms.findOneById(eventName);
                if (!room) {
                    return false;
                }
                const canAccess = yield core_services_1.Authorization.canAccessRoom(room, { _id: this.userId || '' }, extraData);
                if (!canAccess) {
                    // verify if can preview messages from public channels
                    if (room.t === 'c' && this.userId) {
                        return core_services_1.Authorization.hasPermission(this.userId, 'preview-c-room');
                    }
                    return false;
                }
                return true;
            });
        });
        this.streamRoomMessage.allowRead('__my_messages__', 'all');
        this.streamRoomMessage.allowEmit('__my_messages__', function (_eventName_1, _a) {
            return __awaiter(this, arguments, void 0, function* (_eventName, { rid }) {
                if (!this.userId) {
                    return false;
                }
                try {
                    const room = yield models_1.Rooms.findOneById(rid);
                    if (!room) {
                        return false;
                    }
                    const canAccess = yield core_services_1.Authorization.canAccessRoom(room, { _id: this.userId });
                    if (!canAccess) {
                        return false;
                    }
                    const roomParticipant = yield models_1.Subscriptions.countByRoomIdAndUserId(room._id, this.userId);
                    return {
                        roomParticipant: roomParticipant > 0,
                        roomType: room.t,
                        roomName: room.name,
                    };
                }
                catch (error) {
                    /* error*/
                    return false;
                }
            });
        });
        this.streamAll.allowWrite('none');
        this.streamAll.allowRead('all');
        this.streamLogged.allowRead('private-settings-changed', function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.userId == null) {
                    return false;
                }
                return core_services_1.Authorization.hasAtLeastOnePermission(this.userId, [
                    'view-privileged-setting',
                    'edit-privileged-setting',
                    'manage-selected-settings',
                ]);
            });
        });
        this.streamLogged.allowWrite('none');
        this.streamLogged.allowRead('logged');
        this.streamRoom.allowRead(function (eventName, extraData) {
            return __awaiter(this, void 0, void 0, function* () {
                const [rid, e] = eventName.split('/');
                if (e === 'webrtc') {
                    return true;
                }
                const room = yield models_1.Rooms.findOneById(rid, {
                    projection: { 't': 1, 'v.token': 1 },
                });
                if (!room) {
                    return false;
                }
                // typing from livechat widget
                if (extraData === null || extraData === void 0 ? void 0 : extraData.token) {
                    // TODO improve this to make a query 'v.token'
                    const room = yield models_1.Rooms.findOneById(rid, {
                        projection: { 't': 1, 'v.token': 1 },
                    });
                    return !!room && room.t === 'l' && room.v.token === extraData.token;
                }
                if (!this.userId) {
                    return false;
                }
                const canAccess = yield core_services_1.Authorization.canAccessRoomId(room._id, this.userId);
                return canAccess;
            });
        });
        function canType(_a) {
            return __awaiter(this, arguments, void 0, function* ({ userId, username, extraData, rid, }) {
                try {
                    // typing from livechat widget
                    if (extraData === null || extraData === void 0 ? void 0 : extraData.token) {
                        // TODO improve this to make a query 'v.token'
                        const room = yield models_1.Rooms.findOneById(rid, {
                            projection: { 't': 1, 'v.token': 1 },
                        });
                        return !!room && room.t === 'l' && room.v.token === extraData.token;
                    }
                    if (!userId) {
                        return false;
                    }
                    // TODO consider using something to cache settings
                    const key = (yield models_1.Settings.getValueById('UI_Use_Real_Name')) ? 'name' : 'username';
                    const user = yield models_1.Users.findOneById(userId, {
                        projection: {
                            [key]: 1,
                        },
                    });
                    if (!user) {
                        return false;
                    }
                    return user[key] === username;
                }
                catch (e) {
                    system_1.SystemLogger.error(e);
                    return false;
                }
            });
        }
        this.streamRoom.allowWrite(function (eventName, username, _activity, extraData) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                const [rid, e] = eventName.split('/');
                // TODO should this use WEB_RTC_EVENTS enum?
                if (e === 'webrtc') {
                    return true;
                }
                if (e !== 'user-activity') {
                    return false;
                }
                if (!(yield canType({ extraData, rid, username, userId: (_a = this.userId) !== null && _a !== void 0 ? _a : undefined }))) {
                    return false;
                }
                return true;
            });
        });
        this.streamRoomUsers.allowRead('none');
        this.streamRoomUsers.allowWrite(function (eventName, ...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const [roomId, e] = eventName.split('/');
                if (!this.userId) {
                    const room = yield models_1.Rooms.findOneById(roomId, {
                        projection: { 't': 1, 'servedBy._id': 1 },
                    });
                    if (room && room.t === 'l' && e === 'webrtc' && room.servedBy) {
                        self.notifyUser(room.servedBy._id, e, ...args);
                        return false;
                    }
                }
                else if ((yield models_1.Subscriptions.countByRoomIdAndUserId(roomId, this.userId)) > 0) {
                    const livechatSubscriptions = yield models_1.Subscriptions.findByLivechatRoomIdAndNotUserId(roomId, this.userId, {
                        projection: { 'v._id': 1, '_id': 0 },
                    }).toArray();
                    if (livechatSubscriptions && e === 'webrtc') {
                        livechatSubscriptions.forEach((subscription) => subscription.v && self.notifyUser(subscription.v._id, e, ...args));
                        return false;
                    }
                    const subscriptions = yield models_1.Subscriptions.findByRoomIdAndNotUserId(roomId, this.userId, {
                        projection: { 'u._id': 1, '_id': 0 },
                    }).toArray();
                    subscriptions.forEach((subscription) => self.notifyUser(subscription.u._id, e, ...args));
                }
                return false;
            });
        });
        this.streamUser.allowWrite(function (eventName, data) {
            return __awaiter(this, void 0, void 0, function* () {
                const [, e] = eventName.split('/');
                if (e === 'otr' && (data === 'handshake' || data === 'acknowledge')) {
                    const isEnable = yield models_1.Settings.getValueById('OTR_Enable');
                    return Boolean(this.userId) && (isEnable === 'true' || isEnable === true);
                }
                if (e === 'webrtc') {
                    return true;
                }
                if (e === 'video-conference') {
                    if (!this.userId || !data || typeof data !== 'object') {
                        return false;
                    }
                    const { action: videoAction, params } = data;
                    if (!videoAction || typeof videoAction !== 'string' || !params || typeof params !== 'object') {
                        return false;
                    }
                    const callId = 'callId' in params && typeof params.callId === 'string' ? params.callId : '';
                    const uid = 'uid' in params && typeof params.uid === 'string' ? params.uid : '';
                    const rid = 'rid' in params && typeof params.rid === 'string' ? params.rid : '';
                    return core_services_1.VideoConf.validateAction(videoAction, this.userId, {
                        callId,
                        uid,
                        rid,
                    });
                }
                return Boolean(this.userId);
            });
        });
        this.streamUser.allowRead(function (eventName) {
            return __awaiter(this, void 0, void 0, function* () {
                const [userId, e] = eventName.split('/');
                if (e === 'otr') {
                    const isEnable = yield models_1.Settings.getValueById('OTR_Enable');
                    return Boolean(this.userId) && this.userId === userId && (isEnable === 'true' || isEnable === true);
                }
                if (e === 'webrtc') {
                    return true;
                }
                return Boolean(this.userId) && this.userId === userId;
            });
        });
        this.streamImporters.allowRead('all');
        this.streamImporters.allowEmit('all');
        this.streamImporters.allowWrite('none');
        this.streamApps.serverOnly = true;
        this.streamApps.allowRead('all');
        this.streamApps.allowEmit('all');
        this.streamApps.allowWrite('none');
        this.streamAppsEngine.serverOnly = true;
        this.streamAppsEngine.allowRead('none');
        this.streamAppsEngine.allowEmit('all');
        this.streamAppsEngine.allowWrite('none');
        this.streamCannedResponses.allowWrite('none');
        this.streamCannedResponses.allowRead(function () {
            return __awaiter(this, void 0, void 0, function* () {
                return (!!this.userId &&
                    !!(yield models_1.Settings.getValueById('Canned_Responses_Enable')) &&
                    core_services_1.Authorization.hasPermission(this.userId, 'view-canned-responses'));
            });
        });
        this.streamIntegrationHistory.allowWrite('none');
        this.streamIntegrationHistory.allowRead(function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.userId) {
                    return false;
                }
                return core_services_1.Authorization.hasAtLeastOnePermission(this.userId, ['manage-outgoing-integrations', 'manage-own-outgoing-integrations']);
            });
        });
        this.streamLivechatRoom.allowRead((roomId, extraData) => __awaiter(this, void 0, void 0, function* () {
            const room = yield models_1.Rooms.findOneById(roomId, {
                projection: { _id: 0, t: 1, v: 1 },
            });
            if (!room) {
                console.warn(`Invalid eventName: "${roomId}"`);
                return false;
            }
            if (room.t === 'l' && (extraData === null || extraData === void 0 ? void 0 : extraData.visitorToken) && room.v.token === extraData.visitorToken) {
                return true;
            }
            return false;
        }));
        this.streamLivechatQueueData.allowWrite('none');
        this.streamLivechatQueueData.allowRead(function () {
            return __awaiter(this, void 0, void 0, function* () {
                return this.userId ? core_services_1.Authorization.hasPermission(this.userId, 'view-l-room') : false;
            });
        });
        this.streamStdout.allowWrite('none');
        this.streamStdout.allowRead(function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.userId) {
                    return false;
                }
                return core_services_1.Authorization.hasPermission(this.userId, 'view-logs');
            });
        });
        this.streamRoomData.allowWrite('none');
        this.streamRoomData.allowRead(function (rid) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.userId) {
                    return false;
                }
                try {
                    const room = yield models_1.Rooms.findOneById(rid);
                    if (!room) {
                        return false;
                    }
                    const canAccess = yield core_services_1.Authorization.canAccessRoom(room, { _id: this.userId });
                    if (!canAccess) {
                        return false;
                    }
                    return true;
                }
                catch (error) {
                    return false;
                }
            });
        });
        this.streamRoles.allowWrite('none');
        this.streamRoles.allowRead('logged');
        this.streamUser.on('_afterPublish', (streamer, publication, eventName) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = publication._session;
            if (!userId) {
                return;
            }
            if (/rooms-changed/.test(eventName)) {
                // TODO: change this to serialize only once
                const roomEvent = (...args) => {
                    var _a;
                    // TODO if receive a removed event could do => streamer.removeListener(rid, roomEvent);
                    const payload = streamer.changedPayload(streamer.subscriptionName, 'id', {
                        eventName: `${userId}/rooms-changed`,
                        args,
                    });
                    payload && ((_a = publication._session.socket) === null || _a === void 0 ? void 0 : _a.send(payload));
                };
                const subscriptions = yield models_1.Subscriptions.find({ 'u._id': userId }, { projection: { rid: 1 } }).toArray();
                subscriptions.forEach(({ rid }) => {
                    streamer.on(rid, roomEvent);
                });
                const userEvent = (clientAction_1, ...args_1) => __awaiter(this, [clientAction_1, ...args_1], void 0, function* (clientAction, { rid } = {}) {
                    if (!rid) {
                        return;
                    }
                    switch (clientAction) {
                        case 'inserted':
                            subscriptions.push({ rid });
                            streamer.on(rid, roomEvent);
                            // after a subscription is added need to emit the room again
                            roomEvent('inserted', yield models_1.Rooms.findOneById(rid));
                            break;
                        case 'removed':
                            streamer.removeListener(rid, roomEvent);
                            break;
                    }
                });
                streamer.on(userId, userEvent);
                publication.onStop(() => {
                    streamer.removeListener(userId, userEvent);
                    subscriptions.forEach(({ rid }) => streamer.removeListener(rid, roomEvent));
                });
            }
        }));
        this.streamLocal.serverOnly = true;
        this.streamLocal.allowRead('none');
        this.streamLocal.allowEmit('all');
        this.streamLocal.allowWrite('none');
        this.streamPresence.allowRead('logged');
        this.streamPresence.allowWrite('none');
    }
    // notifyAll<E extends StreamKeys<'notify-all'>>(eventName: E, ...args: StreamerCallbackArgs<'notify-all', E>): void {
    // 	return this.streamAll.emit(eventName, ...args);
    // }
    notifyLogged(eventName, ...args) {
        return this.streamLogged.emit(eventName, ...args);
    }
    notifyRoom(room, eventName, ...args) {
        return this.streamRoom.emit(`${room}/${eventName}`, ...args);
    }
    notifyUser(userId, eventName, ...args) {
        return this.streamUser.emit(`${userId}/${eventName}`, ...args);
    }
    notifyAllInThisInstance(eventName, ...args) {
        return this.streamAll.emitWithoutBroadcast(eventName, ...args);
    }
    notifyLoggedInThisInstance(eventName, ...args) {
        return this.streamLogged.emitWithoutBroadcast(eventName, ...args);
    }
    notifyRoomInThisInstance(room, eventName, ...args) {
        return this.streamRoom.emitWithoutBroadcast(`${room}/${eventName}`, ...args);
    }
    notifyUserInThisInstance(userId, eventName, ...args) {
        return this.streamUser.emitWithoutBroadcast(`${userId}/${eventName}`, ...args);
    }
    sendPresence(uid, ...args) {
        (0, Presence_1.emit)(uid, [args]);
        return this.streamPresence.emitWithoutBroadcast(uid, args);
    }
    progressUpdated(progress) {
        this.streamImporters.emit('progress', progress);
    }
}
exports.NotificationsModule = NotificationsModule;
