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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoConfService = void 0;
const apps_1 = require("@rocket.chat/apps");
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const tools_1 = require("@rocket.chat/tools");
const mongo_1 = require("meteor/mongo");
const server_1 = require("../../../app/assets/server");
const canAccessRoom_1 = require("../../../app/authorization/server/functions/canAccessRoom");
const createRoom_1 = require("../../../app/lib/server/functions/createRoom");
const sendMessage_1 = require("../../../app/lib/server/functions/sendMessage");
const notifyListener_1 = require("../../../app/lib/server/lib/notifyListener");
const metrics_1 = require("../../../app/metrics/server/lib/metrics");
const push_1 = require("../../../app/push/server/push");
const PushNotification_1 = __importDefault(require("../../../app/push-notifications/server/lib/PushNotification"));
const server_2 = require("../../../app/settings/server");
const updateStatsCounter_1 = require("../../../app/statistics/server/functions/updateStatsCounter");
const getUserAvatarURL_1 = require("../../../app/utils/server/getUserAvatarURL");
const getUserPreference_1 = require("../../../app/utils/server/lib/getUserPreference");
const callbacks_1 = require("../../../lib/callbacks");
const constants_1 = require("../../../lib/videoConference/constants");
const readSecondaryPreferred_1 = require("../../database/readSecondaryPreferred");
const i18n_1 = require("../../lib/i18n");
const isRoomCompatibleWithVideoConfRinging_1 = require("../../lib/isRoomCompatibleWithVideoConfRinging");
const roomCoordinator_1 = require("../../lib/rooms/roomCoordinator");
const videoConfProviders_1 = require("../../lib/videoConfProviders");
const videoConfTypes_1 = require("../../lib/videoConfTypes");
const { db } = mongo_1.MongoInternals.defaultRemoteCollectionDriver().mongo;
const logger = new logger_1.Logger('VideoConference');
class VideoConfService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'video-conference';
    }
    // VideoConference.create: Start a video conference using the type and provider specified as arguments
    create(_a, useAppUser) {
        return __awaiter(this, void 0, void 0, function* () {
            var { type, rid, createdBy, providerName } = _a, data = __rest(_a, ["type", "rid", "createdBy", "providerName"]);
            if (useAppUser === void 0) { useAppUser = true; }
            return (0, tools_1.wrapExceptions)(() => __awaiter(this, void 0, void 0, function* () {
                const room = yield models_1.Rooms.findOneById(rid, {
                    projection: { t: 1, uids: 1, name: 1, fname: 1 },
                });
                if (!room) {
                    throw new Error('invalid-room');
                }
                const user = yield models_1.Users.findOneById(createdBy);
                if (!user) {
                    throw new Error('failed-to-load-own-data');
                }
                if (type === 'direct') {
                    if (!(0, isRoomCompatibleWithVideoConfRinging_1.isRoomCompatibleWithVideoConfRinging)(room.t, room.uids)) {
                        throw new Error('type-and-room-not-compatible');
                    }
                    return this.startDirect(providerName, user, room, data);
                }
                if (type === 'livechat') {
                    return this.startLivechat(providerName, user, rid);
                }
                const title = data.title || room.fname || room.name || '';
                return this.startGroup(providerName, user, room._id, title, data, useAppUser);
            })).catch((e) => {
                logger.error({
                    name: 'Error on VideoConf.create',
                    error: e,
                });
                throw e;
            });
        });
    }
    // VideoConference.start: Detect the desired type and provider then start a video conference using them
    start(caller_1, rid_1, _a) {
        return __awaiter(this, arguments, void 0, function* (caller, rid, { title, allowRinging }) {
            return (0, tools_1.wrapExceptions)(() => __awaiter(this, void 0, void 0, function* () {
                const providerName = yield this.getValidatedProvider();
                const initialData = yield this.getTypeForNewVideoConference(rid, Boolean(allowRinging));
                const data = Object.assign(Object.assign({}, initialData), { createdBy: caller, rid,
                    providerName });
                if (data.type === 'videoconference') {
                    data.title = title;
                }
                return this.create(data, false);
            })).catch((e) => {
                logger.error({
                    name: 'Error on VideoConf.start',
                    error: e,
                });
                throw e;
            });
        });
    }
    join(uid, callId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, tools_1.wrapExceptions)(() => __awaiter(this, void 0, void 0, function* () {
                const call = yield models_1.VideoConference.findOneById(callId);
                if (!call || call.endedAt) {
                    throw new Error('invalid-call');
                }
                let user = null;
                if (uid) {
                    user = yield models_1.Users.findOneById(uid, {
                        projection: { name: 1, username: 1, avatarETag: 1 },
                    });
                    if (!user) {
                        throw new Error('failed-to-load-own-data');
                    }
                }
                if (call.providerName === 'jitsi') {
                    (0, updateStatsCounter_1.updateCounter)({ settingsId: 'Jitsi_Click_To_Join_Count' });
                }
                return this.joinCall(call, user || undefined, options);
            })).catch((e) => {
                logger.error({
                    name: 'Error on VideoConf.join',
                    error: e,
                });
                throw e;
            });
        });
    }
    getInfo(callId, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield models_1.VideoConference.findOneById(callId);
            if (!call) {
                throw new Error('invalid-call');
            }
            if (!videoConfProviders_1.videoConfProviders.isProviderAvailable(call.providerName)) {
                throw new Error('video-conf-provider-unavailable');
            }
            let user = null;
            if (uid) {
                user = yield models_1.Users.findOneById(uid, {
                    projection: { name: 1, username: 1, avatarETag: 1 },
                });
                if (!user) {
                    throw new Error('failed-to-load-own-data');
                }
            }
            const blocks = yield (yield this.getProviderManager()).getVideoConferenceInfo(call.providerName, call, user || undefined).catch((e) => {
                throw new Error(e);
            });
            if (blocks === null || blocks === void 0 ? void 0 : blocks.length) {
                return blocks;
            }
            return [
                {
                    blockId: 'videoconf-info',
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `**${i18n_1.i18n.t('Video_Conference_Url')}**: ${call.url}`,
                    },
                },
            ];
        });
    }
    cancel(uid, callId) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield models_1.VideoConference.findOneById(callId);
            if (!call || !(0, core_typings_1.isDirectVideoConference)(call)) {
                throw new Error('invalid-call');
            }
            if (call.status !== core_typings_1.VideoConferenceStatus.CALLING || call.endedBy || call.endedAt) {
                throw new Error('invalid-call-status');
            }
            const user = yield models_1.Users.findOneById(uid);
            if (!user) {
                throw new Error('failed-to-load-own-data');
            }
            yield models_1.VideoConference.setDataById(callId, {
                ringing: false,
                status: core_typings_1.VideoConferenceStatus.DECLINED,
                endedAt: new Date(),
                endedBy: {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                },
            });
            yield this.runVideoConferenceChangedEvent(callId);
            this.notifyVideoConfUpdate(call.rid, call._id);
            yield this.sendAllPushNotifications(call._id);
        });
    }
    get(callId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.VideoConference.findOneById(callId, { projection: { providerData: 0 } });
        });
    }
    getUnfiltered(callId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.VideoConference.findOneById(callId);
        });
    }
    list(roomId_1) {
        return __awaiter(this, arguments, void 0, function* (roomId, pagination = {}) {
            const { cursor, totalCount } = models_1.VideoConference.findPaginatedByRoomId(roomId, pagination);
            const [data, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return {
                data,
                offset: pagination.offset || 0,
                count: data.length,
                total,
            };
        });
    }
    setProviderData(callId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.VideoConference.setProviderDataById(callId, data);
        });
    }
    setEndedBy(callId, endedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Users.findOneById(endedBy, {
                projection: { username: 1, name: 1 },
            });
            if (!user) {
                throw new Error('Invalid User');
            }
            yield models_1.VideoConference.setEndedById(callId, {
                _id: user._id,
                username: user.username,
                name: user.name,
            });
        });
    }
    setEndedAt(callId, endedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.VideoConference.setEndedById(callId, undefined, endedAt);
        });
    }
    setStatus(callId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (status) {
                case core_typings_1.VideoConferenceStatus.ENDED:
                    return this.endCall(callId);
                case core_typings_1.VideoConferenceStatus.EXPIRED:
                    return this.expireCall(callId);
            }
            yield models_1.VideoConference.setStatusById(callId, status);
        });
    }
    addUser(callId, userId, ts) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield this.get(callId);
            if (!call) {
                throw new Error('Invalid video conference');
            }
            if (!userId) {
                if (call.type === 'videoconference') {
                    return this.addAnonymousUser(call);
                }
                throw new Error('Invalid User');
            }
            const user = yield models_1.Users.findOneById(userId, {
                projection: { username: 1, name: 1, avatarETag: 1 },
            });
            if (!user) {
                throw new Error('Invalid User');
            }
            yield this.addUserToCall(call, {
                _id: user._id,
                username: user.username,
                name: user.name,
                avatarETag: user.avatarETag,
                ts: ts || new Date(),
            });
        });
    }
    listProviders() {
        return __awaiter(this, void 0, void 0, function* () {
            return videoConfProviders_1.videoConfProviders.getProviderList();
        });
    }
    listProviderCapabilities(providerName) {
        return __awaiter(this, void 0, void 0, function* () {
            return videoConfProviders_1.videoConfProviders.getProviderCapabilities(providerName) || {};
        });
    }
    listCapabilities() {
        return __awaiter(this, void 0, void 0, function* () {
            const providerName = yield this.getValidatedProvider();
            return {
                providerName,
                capabilities: videoConfProviders_1.videoConfProviders.getProviderCapabilities(providerName) || {},
            };
        });
    }
    declineLivechatCall(callId) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield this.getUnfiltered(callId);
            if (!(0, core_typings_1.isLivechatVideoConference)(call)) {
                return false;
            }
            if (call.messages.started) {
                const name = (server_2.settings.get('UI_Use_Real_Name') ? call.createdBy.name : call.createdBy.username) || call.createdBy.username || '';
                const text = i18n_1.i18n.t('video_livechat_missed', { username: name });
                yield models_1.Messages.setBlocksById(call.messages.started, [this.buildMessageBlock(text)]);
                yield (0, notifyListener_1.notifyOnMessageChange)({
                    id: call.messages.started,
                });
            }
            yield models_1.VideoConference.setDataById(call._id, {
                status: core_typings_1.VideoConferenceStatus.DECLINED,
                endedAt: new Date(),
            });
            return true;
        });
    }
    diagnoseProvider(uid, rid, providerName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (providerName) {
                    yield this.validateProvider(providerName);
                }
                else {
                    yield this.getValidatedProvider();
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    yield this.createEphemeralMessage(uid, rid, error.message);
                    return error.message;
                }
            }
        });
    }
    getStatistics() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)(db),
            };
            return {
                videoConference: {
                    started: yield models_1.VideoConference.countByTypeAndStatus('videoconference', core_typings_1.VideoConferenceStatus.STARTED, options),
                    ended: yield models_1.VideoConference.countByTypeAndStatus('videoconference', core_typings_1.VideoConferenceStatus.ENDED, options),
                },
                direct: {
                    calling: yield models_1.VideoConference.countByTypeAndStatus('direct', core_typings_1.VideoConferenceStatus.CALLING, options),
                    started: yield models_1.VideoConference.countByTypeAndStatus('direct', core_typings_1.VideoConferenceStatus.STARTED, options),
                    ended: yield models_1.VideoConference.countByTypeAndStatus('direct', core_typings_1.VideoConferenceStatus.ENDED, options),
                },
                livechat: {
                    started: yield models_1.VideoConference.countByTypeAndStatus('livechat', core_typings_1.VideoConferenceStatus.STARTED, options),
                    ended: yield models_1.VideoConference.countByTypeAndStatus('livechat', core_typings_1.VideoConferenceStatus.ENDED, options),
                },
                settings: {
                    provider: server_2.settings.get('VideoConf_Default_Provider'),
                    dms: server_2.settings.get('VideoConf_Enable_DMs'),
                    channels: server_2.settings.get('VideoConf_Enable_Channels'),
                    groups: server_2.settings.get('VideoConf_Enable_Groups'),
                    teams: server_2.settings.get('VideoConf_Enable_Teams'),
                },
            };
        });
    }
    validateAction(action_1, caller_1, _a) {
        return __awaiter(this, arguments, void 0, function* (action, caller, { callId, uid, rid }) {
            if (!callId || !uid || !rid) {
                return false;
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(rid, caller)) || (caller !== uid && !(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(rid, uid)))) {
                return false;
            }
            const call = yield models_1.VideoConference.findOneById(callId, {
                projection: { status: 1, endedAt: 1, createdBy: 1 },
            });
            if (!call) {
                return false;
            }
            if (action === 'end') {
                return true;
            }
            if (call.endedAt || call.status > core_typings_1.VideoConferenceStatus.STARTED) {
                // If the caller is still calling about a call that has already ended, notify it
                if (action === 'call' && caller === call.createdBy._id) {
                    this.notifyUser(call.createdBy._id, 'end', { rid, uid, callId });
                }
                return false;
            }
            return true;
        });
    }
    notifyUser(userId, action, params) {
        void core_services_1.api.broadcast('user.video-conference', { userId, action, params });
    }
    notifyVideoConfUpdate(rid, callId) {
        void core_services_1.api.broadcast('room.video-conference', { rid, callId });
    }
    endCall(callId) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield this.getUnfiltered(callId);
            if (!call) {
                return;
            }
            yield models_1.VideoConference.setDataById(call._id, { endedAt: new Date(), status: core_typings_1.VideoConferenceStatus.ENDED });
            yield this.runVideoConferenceChangedEvent(call._id);
            this.notifyVideoConfUpdate(call.rid, call._id);
            if (call.type === 'direct') {
                return this.endDirectCall(call);
            }
        });
    }
    expireCall(callId) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield models_1.VideoConference.findOneById(callId, { projection: { messages: 1 } });
            if (!call) {
                return;
            }
            yield models_1.VideoConference.setDataById(call._id, { endedAt: new Date(), status: core_typings_1.VideoConferenceStatus.EXPIRED });
        });
    }
    endDirectCall(call) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { rid: call.rid, uid: call.createdBy._id, callId: call._id };
            // Notify the caller that the call was ended by the server
            this.notifyUser(call.createdBy._id, 'end', params);
            // If the callee hasn't joined the call yet, notify them that it has already ended
            const subscriptions = yield models_1.Subscriptions.findByRoomIdAndNotUserId(call.rid, call.createdBy._id, {
                projection: { 'u._id': 1, '_id': 0 },
            }).toArray();
            for (const subscription of subscriptions) {
                // Skip notifying users that already joined the call
                if (call.users.find(({ _id }) => _id === subscription.u._id)) {
                    continue;
                }
                this.notifyUser(subscription.u._id, 'end', params);
            }
        });
    }
    getTypeForNewVideoConference(rid, allowRinging) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield models_1.Rooms.findOneById(rid, {
                projection: { t: 1 },
            });
            if (!room) {
                throw new Error('invalid-room');
            }
            return videoConfTypes_1.videoConfTypes.getTypeForRoom(room, allowRinging);
        });
    }
    createMessage(call, createdBy, customBlocks) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = {
                t: 'videoconf',
                msg: '',
                groupable: false,
                blocks: customBlocks || [this.buildVideoConfBlock(call._id)],
            };
            const room = yield models_1.Rooms.findOneById(call.rid);
            const appId = videoConfProviders_1.videoConfProviders.getProviderAppId(call.providerName);
            const user = createdBy || (appId && (yield models_1.Users.findOneByAppId(appId))) || (yield models_1.Users.findOneById('rocket.cat'));
            const message = yield (0, sendMessage_1.sendMessage)(user, record, room, false);
            if (!message) {
                throw new Error('failed-to-create-message');
            }
            return message._id;
        });
    }
    validateProvider(providerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const manager = yield this.getProviderManager();
            const configured = yield manager.isFullyConfigured(providerName).catch(() => false);
            if (!configured) {
                throw new Error(constants_1.availabilityErrors.NOT_CONFIGURED);
            }
        });
    }
    getValidatedProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!videoConfProviders_1.videoConfProviders.hasAnyProvider()) {
                throw new Error(constants_1.availabilityErrors.NO_APP);
            }
            const providerName = videoConfProviders_1.videoConfProviders.getActiveProvider();
            if (!providerName) {
                throw new Error(constants_1.availabilityErrors.NOT_ACTIVE);
            }
            yield this.validateProvider(providerName);
            return providerName;
        });
    }
    createEphemeralMessage(uid, rid, i18nKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Users.findOneById(uid, { projection: { language: 1, roles: 1 } });
            const language = (user === null || user === void 0 ? void 0 : user.language) || server_2.settings.get('Language') || 'en';
            const key = (user === null || user === void 0 ? void 0 : user.roles.includes('admin')) ? `admin-${i18nKey}` : i18nKey;
            const msg = i18n_1.i18n.t(key, {
                lng: language,
            });
            void core_services_1.api.broadcast('notify.ephemeralMessage', uid, rid, {
                msg,
            });
        });
    }
    createLivechatMessage(call, user, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = (server_2.settings.get('UI_Use_Real_Name') ? user.name : user.username) || user.username || '';
            const text = i18n_1.i18n.t('video_livechat_started', {
                username,
            });
            return this.createMessage(call, user, [
                this.buildMessageBlock(text),
                {
                    type: 'actions',
                    appId: 'videoconf-core',
                    blockId: call._id,
                    elements: [
                        {
                            appId: 'videoconf-core',
                            blockId: call._id,
                            actionId: 'joinLivechat',
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: i18n_1.i18n.t('Join_call'),
                                emoji: true,
                            },
                            url,
                        },
                    ],
                },
            ]);
        });
    }
    buildVideoConfBlock(callId) {
        return {
            type: 'video_conf',
            blockId: callId,
            callId,
            appId: 'videoconf-core',
        };
    }
    buildMessageBlock(text) {
        return {
            type: 'section',
            appId: 'videoconf-core',
            text: {
                type: 'mrkdwn',
                text: `${text}`,
            },
        };
    }
    sendPushNotification(call, calleeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (server_2.settings.get('Push_enable') !== true ||
                server_2.settings.get('VideoConf_Mobile_Ringing') !== true ||
                !(yield (0, getUserPreference_1.getUserPreference)(calleeId, 'enableMobileRinging'))) {
                return;
            }
            metrics_1.metrics.notificationsSent.inc({ notification_type: 'mobile' });
            yield push_1.Push.send({
                from: 'push',
                badge: 0,
                sound: 'ringtone.mp3',
                priority: 10,
                title: `@${call.createdBy.username}`,
                text: i18n_1.i18n.t('Video_Conference'),
                payload: {
                    host: Meteor.absoluteUrl(),
                    rid: call.rid,
                    notificationType: 'videoconf',
                    caller: call.createdBy,
                    avatar: (0, getUserAvatarURL_1.getUserAvatarURL)(call.createdBy.username),
                    status: call.status,
                    callId: call._id,
                },
                userId: calleeId,
                notId: PushNotification_1.default.getNotificationId(`${call.rid}|${call._id}`),
                gcm: {
                    style: 'inbox',
                    image: server_1.RocketChatAssets.getURL('Assets_favicon_192'),
                },
                apn: {
                    category: 'VIDEOCONF',
                },
            });
        });
    }
    sendAllPushNotifications(callId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            if (server_2.settings.get('Push_enable') !== true || server_2.settings.get('VideoConf_Mobile_Ringing') !== true) {
                return;
            }
            const call = yield models_1.VideoConference.findOneById(callId, {
                projection: { createdBy: 1, rid: 1, users: 1, status: 1 },
            });
            if (!call) {
                return;
            }
            const subscriptions = models_1.Subscriptions.findByRoomIdAndNotUserId(call.rid, call.createdBy._id, {
                projection: { 'u._id': 1, '_id': 0 },
            });
            try {
                for (var _d = true, subscriptions_1 = __asyncValues(subscriptions), subscriptions_1_1; subscriptions_1_1 = yield subscriptions_1.next(), _a = subscriptions_1_1.done, !_a; _d = true) {
                    _c = subscriptions_1_1.value;
                    _d = false;
                    const subscription = _c;
                    yield this.sendPushNotification(call, subscription.u._id);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = subscriptions_1.return)) yield _b.call(subscriptions_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    startDirect(providerName_1, user_1, _a, extraData_1) {
        return __awaiter(this, arguments, void 0, function* (providerName, user, { _id: rid, uids }, extraData) {
            const calleeId = uids === null || uids === void 0 ? void 0 : uids.filter((uid) => uid !== user._id).pop();
            if (!calleeId) {
                // Are you trying to call yourself?
                throw new Error('invalid-call-target');
            }
            const callId = yield models_1.VideoConference.createDirect(Object.assign(Object.assign({}, extraData), { rid, createdBy: {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                }, providerName }));
            yield this.runNewVideoConferenceEvent(callId);
            yield this.maybeCreateDiscussion(callId, user);
            const call = (yield this.getUnfiltered(callId));
            if (!call) {
                throw new Error('failed-to-create-direct-call');
            }
            const url = yield this.generateNewUrl(call);
            yield models_1.VideoConference.setUrlById(callId, url);
            const messageId = yield this.createMessage(call, user);
            call.messages.started = messageId;
            yield models_1.VideoConference.setMessageById(callId, 'started', messageId);
            // After 40 seconds if the status is still "calling", we cancel the call automatically.
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const call = yield models_1.VideoConference.findOneById(callId);
                    if (call) {
                        yield this.endDirectCall(call);
                        if (call.status !== core_typings_1.VideoConferenceStatus.CALLING) {
                            return;
                        }
                        yield this.cancel(user._id, callId);
                    }
                }
                catch (_a) {
                    // Ignore errors on this timeout
                }
            }), 40000);
            yield this.sendPushNotification(call, calleeId);
            return {
                type: 'direct',
                callId,
                calleeId,
            };
        });
    }
    notifyUsersOfRoom(rid, uid, action, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscriptions = models_1.Subscriptions.findByRoomIdAndNotUserId(rid, uid, {
                projection: { 'u._id': 1, '_id': 0 },
            });
            yield subscriptions.forEach((subscription) => this.notifyUser(subscription.u._id, action, params));
        });
    }
    startGroup(providerName_1, user_1, rid_1, title_1, extraData_1) {
        return __awaiter(this, arguments, void 0, function* (providerName, user, rid, title, extraData, useAppUser = true) {
            const callId = yield models_1.VideoConference.createGroup(Object.assign(Object.assign({}, extraData), { rid,
                title, createdBy: {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                }, providerName }));
            yield this.runNewVideoConferenceEvent(callId);
            yield this.maybeCreateDiscussion(callId, user);
            const call = (yield this.getUnfiltered(callId));
            if (!call) {
                throw new Error('failed-to-create-group-call');
            }
            const url = yield this.generateNewUrl(call);
            yield models_1.VideoConference.setUrlById(callId, url);
            call.url = url;
            const messageId = yield this.createMessage(call, useAppUser ? undefined : user);
            call.messages.started = messageId;
            yield models_1.VideoConference.setMessageById(callId, 'started', messageId);
            if (call.ringing) {
                yield this.notifyUsersOfRoom(rid, user._id, 'ring', { callId, rid, uid: call.createdBy._id });
            }
            return {
                type: 'videoconference',
                callId,
                rid,
            };
        });
    }
    startLivechat(providerName, user, rid) {
        return __awaiter(this, void 0, void 0, function* () {
            const callId = yield models_1.VideoConference.createLivechat({
                rid,
                createdBy: {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                },
                providerName,
            });
            const call = (yield this.getUnfiltered(callId));
            if (!call) {
                throw new Error('failed-to-create-livechat-call');
            }
            yield this.runNewVideoConferenceEvent(callId);
            // Livechat conferences do not use discussions
            const joinUrl = yield this.getUrl(call);
            const messageId = yield this.createLivechatMessage(call, user, joinUrl);
            call.messages.started = messageId;
            yield models_1.VideoConference.setMessageById(callId, 'started', messageId);
            return {
                type: 'livechat',
                callId,
            };
        });
    }
    joinCall(call, user, options) {
        return __awaiter(this, void 0, void 0, function* () {
            void callbacks_1.callbacks.runAsync('onJoinVideoConference', call._id, user === null || user === void 0 ? void 0 : user._id);
            yield this.runOnUserJoinEvent(call._id, user);
            return this.getUrl(call, user, options);
        });
    }
    getProviderManager() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.isLoaded())) {
                throw new Error('apps-engine-not-loaded');
            }
            const manager = (_c = (_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.getManager()) === null || _c === void 0 ? void 0 : _c.getVideoConfProviderManager();
            if (!manager) {
                throw new Error(constants_1.availabilityErrors.NO_APP);
            }
            return manager;
        });
    }
    getRoomName(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield models_1.Rooms.findOneById(rid, { projection: { name: 1, fname: 1 } });
            return (room === null || room === void 0 ? void 0 : room.fname) || (room === null || room === void 0 ? void 0 : room.name) || rid;
        });
    }
    generateNewUrl(call) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!videoConfProviders_1.videoConfProviders.isProviderAvailable(call.providerName)) {
                throw new Error('video-conf-provider-unavailable');
            }
            const title = (0, core_typings_1.isGroupVideoConference)(call) ? call.title || (yield this.getRoomName(call.rid)) : '';
            const callData = {
                _id: call._id,
                type: call.type,
                rid: call.rid,
                createdBy: call.createdBy,
                title,
                providerData: call.providerData,
                discussionRid: call.discussionRid,
            };
            return (yield this.getProviderManager()).generateUrl(call.providerName, callData);
        });
    }
    getCallTitleForUser(call, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (call.type === 'videoconference' && call.title) {
                return call.title;
            }
            if (userId) {
                const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(call.rid, userId, { projection: { fname: 1, name: 1 } });
                if (subscription) {
                    return subscription.fname || subscription.name;
                }
            }
            const room = yield models_1.Rooms.findOneById(call.rid);
            return (room === null || room === void 0 ? void 0 : room.fname) || (room === null || room === void 0 ? void 0 : room.name) || 'Rocket.Chat';
        });
    }
    getCallTitle(call) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (call.type === 'videoconference') {
                if (call.title) {
                    return call.title;
                }
            }
            const room = yield models_1.Rooms.findOneById(call.rid);
            if (room) {
                if (room.t === 'd') {
                    if ((_a = room.usernames) === null || _a === void 0 ? void 0 : _a.length) {
                        return room.usernames.join(', ');
                    }
                }
                else if (room.fname) {
                    return room.fname;
                }
                else if (room.name) {
                    return room.name;
                }
            }
            return 'Rocket.Chat';
        });
    }
    getUrl(call_1, user_1) {
        return __awaiter(this, arguments, void 0, function* (call, user, options = {}) {
            if (!videoConfProviders_1.videoConfProviders.isProviderAvailable(call.providerName)) {
                throw new Error('video-conf-provider-unavailable');
            }
            if (!call.url) {
                call.url = yield this.generateNewUrl(call);
                yield models_1.VideoConference.setUrlById(call._id, call.url);
            }
            const callData = {
                _id: call._id,
                type: call.type,
                rid: call.rid,
                url: call.url,
                createdBy: call.createdBy,
                providerData: Object.assign(Object.assign({}, (call.providerData || {})), { customCallTitle: yield this.getCallTitleForUser(call, user === null || user === void 0 ? void 0 : user._id) }),
                title: yield this.getCallTitle(call),
                discussionRid: call.discussionRid,
            };
            const userData = user && {
                _id: user._id,
                username: user.username,
                name: user.name,
            };
            return (yield this.getProviderManager()).customizeUrl(call.providerName, callData, userData, options);
        });
    }
    runNewVideoConferenceEvent(callId) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield models_1.VideoConference.findOneById(callId);
            if (!call) {
                throw new Error('video-conf-data-not-found');
            }
            if (!videoConfProviders_1.videoConfProviders.isProviderAvailable(call.providerName)) {
                throw new Error('video-conf-provider-unavailable');
            }
            return (yield this.getProviderManager()).onNewVideoConference(call.providerName, call);
        });
    }
    runVideoConferenceChangedEvent(callId) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield models_1.VideoConference.findOneById(callId);
            if (!call) {
                throw new Error('video-conf-data-not-found');
            }
            if (!videoConfProviders_1.videoConfProviders.isProviderAvailable(call.providerName)) {
                throw new Error('video-conf-provider-unavailable');
            }
            return (yield this.getProviderManager()).onVideoConferenceChanged(call.providerName, call);
        });
    }
    runOnUserJoinEvent(callId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield models_1.VideoConference.findOneById(callId);
            if (!call) {
                throw new Error('video-conf-data-not-found');
            }
            if (!videoConfProviders_1.videoConfProviders.isProviderAvailable(call.providerName)) {
                throw new Error('video-conf-provider-unavailable');
            }
            return (yield this.getProviderManager()).onUserJoin(call.providerName, call, user);
        });
    }
    addUserToCall(call_1, _a) {
        return __awaiter(this, arguments, void 0, function* (call, { _id, username, name, avatarETag, ts }) {
            // If the call has a discussion, ensure the user is subscribed to it;
            // This is done even if the user has already joined the call before, so they can be added back if they had left the discussion.
            if (call.discussionRid) {
                yield this.addUserToDiscussion(call.discussionRid, _id);
            }
            if (call.users.find((user) => user._id === _id)) {
                return;
            }
            yield models_1.VideoConference.addUserById(call._id, { _id, username, name, avatarETag, ts });
            if (call.type === 'direct') {
                return this.updateDirectCall(call, _id);
            }
            this.notifyVideoConfUpdate(call.rid, call._id);
        });
    }
    addAnonymousUser(call) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.VideoConference.increaseAnonymousCount(call._id);
        });
    }
    updateDirectCall(call, newUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            // If it's an user that hasn't joined yet
            if (call.ringing && !call.users.find(({ _id }) => _id === newUserId)) {
                this.notifyUser(call.createdBy._id, 'join', { rid: call.rid, uid: newUserId, callId: call._id });
                if (newUserId !== call.createdBy._id) {
                    this.notifyUser(newUserId, 'join', { rid: call.rid, uid: newUserId, callId: call._id });
                    // If the callee joined the direct call, then we stopped ringing
                    yield models_1.VideoConference.setRingingById(call._id, false);
                }
            }
            if (call.status !== core_typings_1.VideoConferenceStatus.CALLING) {
                return;
            }
            yield models_1.VideoConference.setStatusById(call._id, core_typings_1.VideoConferenceStatus.STARTED);
            this.notifyVideoConfUpdate(call.rid, call._id);
            yield this.runVideoConferenceChangedEvent(call._id);
            yield this.sendAllPushNotifications(call._id);
        });
    }
    isPersistentChatEnabled() {
        return server_2.settings.get('VideoConf_Enable_Persistent_Chat') && server_2.settings.get('Discussion_enabled');
    }
    maybeCreateDiscussion(callId, createdBy) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.isPersistentChatEnabled()) {
                return;
            }
            const call = yield models_1.VideoConference.findOneById(callId, {
                projection: { rid: 1, createdBy: 1, discussionRid: 1, providerName: 1 },
            });
            if (!call) {
                throw new Error('invalid-video-conference');
            }
            // If there's already a discussion assigned to it, do not create a new one
            if (call.discussionRid) {
                return;
            }
            // If the call provider does not explicitly support persistent chat, do not create discussions
            if (!((_a = videoConfProviders_1.videoConfProviders.getProviderCapabilities(call.providerName)) === null || _a === void 0 ? void 0 : _a.persistentChat)) {
                return;
            }
            const name = server_2.settings.get('VideoConf_Persistent_Chat_Discussion_Name') || i18n_1.i18n.t('[date] Video Call Chat');
            let displayName;
            const date = new Date().toISOString().substring(0, 10);
            if (name.includes('[date]')) {
                displayName = name.replace('[date]', date);
            }
            else {
                displayName = `${date} ${name}`;
            }
            yield this.createDiscussionForConference(displayName, call, createdBy);
        });
    }
    getRoomForDiscussion(baseRoom_1) {
        return __awaiter(this, arguments, void 0, function* (baseRoom, childRoomIds = []) {
            const room = yield models_1.Rooms.findOneById(baseRoom, {
                projection: { t: 1, teamId: 1, prid: 1 },
            });
            if (!room) {
                throw new Error('invalid-room');
            }
            if (room.prid) {
                if (childRoomIds.includes(room.prid)) {
                    throw new Error('Room has circular reference.');
                }
                return this.getRoomForDiscussion(room.prid, [...childRoomIds, room._id]);
            }
            return room;
        });
    }
    createDiscussionForConference(name, call, createdBy) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield this.getRoomForDiscussion(call.rid);
            const type = yield roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t).getDiscussionType(room);
            const user = call.createdBy._id === (createdBy === null || createdBy === void 0 ? void 0 : createdBy._id) ? createdBy : yield models_1.Users.findOneById(call.createdBy._id);
            if (!user) {
                throw new Error('invalid-user');
            }
            const discussion = yield (0, createRoom_1.createRoom)(type, random_1.Random.id(), user, [], false, false, {
                fname: name,
                prid: room._id,
                encrypted: false,
            }, {
                creator: user._id,
            });
            return this.assignDiscussionToConference(call._id, discussion._id);
        });
    }
    assignDiscussionToConference(callId, rid) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensures the specified rid is a valid room
            const room = rid ? yield models_1.Rooms.findOneById(rid, { projection: { prid: 1 } }) : null;
            if (rid && !room) {
                throw new Error('invalid-room-id');
            }
            const call = yield models_1.VideoConference.findOneById(callId, { projection: { users: 1, messages: 1 } });
            if (!call) {
                return;
            }
            if (rid === undefined) {
                yield models_1.VideoConference.unsetDiscussionRidById(callId);
            }
            else {
                yield models_1.VideoConference.setDiscussionRidById(callId, rid);
            }
            if (room) {
                yield Promise.all(call.users.map(({ _id }) => this.addUserToDiscussion(room._id, _id)));
            }
        });
    }
    addUserToDiscussion(rid, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield core_services_1.Room.addUserToRoom(rid, { _id: uid }, undefined, { skipAlertSound: true });
            }
            catch (error) {
                // Ignore any errors here so that the subscription doesn't block the user from participating in the conference.
                logger.error({
                    name: 'Error trying to subscribe user to discussion',
                    error,
                    rid,
                    uid,
                });
            }
        });
    }
}
exports.VideoConfService = VideoConfService;
