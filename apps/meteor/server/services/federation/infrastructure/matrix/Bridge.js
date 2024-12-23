"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.MatrixBridge = void 0;
const server_fetch_1 = require("@rocket.chat/server-fetch");
const logger_1 = require("../rocket-chat/adapters/logger");
const MessageReceiver_1 = require("./converters/room/MessageReceiver");
const RoomReceiver_1 = require("./converters/room/RoomReceiver");
const to_internal_parser_formatter_1 = require("./converters/room/to-internal-parser-formatter");
const MatrixEventType_1 = require("./definitions/MatrixEventType");
const MatrixRoomType_1 = require("./definitions/MatrixRoomType");
const MatrixRoomVisibility_1 = require("./definitions/MatrixRoomVisibility");
const RoomMembershipChanged_1 = require("./definitions/events/RoomMembershipChanged");
const RoomMessageSent_1 = require("./definitions/events/RoomMessageSent");
const MatrixIdStringTools_1 = require("./helpers/MatrixIdStringTools");
const MatrixIdVerificationTypes_1 = require("./helpers/MatrixIdVerificationTypes");
let MatrixUserInstance;
const DEFAULT_TIMEOUT_IN_MS_FOR_JOINING_ROOMS = 180000;
const DEFAULT_TIMEOUT_IN_MS_FOR_PING_EVENT = 60 * 1000;
class MatrixBridge {
    constructor(internalSettings, eventHandler) {
        this.internalSettings = internalSettings;
        this.eventHandler = eventHandler;
        this.isRunning = false;
        this.isUpdatingBridgeStatus = false;
    } // eslint-disable-line no-empty-function
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isUpdatingBridgeStatus) {
                return;
            }
            this.isUpdatingBridgeStatus = true;
            try {
                yield this.stop();
                yield this.createInstance();
                if (!this.isRunning) {
                    yield this.bridgeInstance.run(this.internalSettings.getBridgePort());
                    this.bridgeInstance.addAppServicePath({
                        method: 'POST',
                        path: '/_matrix/app/v1/ping',
                        authenticate: true,
                        handler: (_req, res, _next) => {
                            /*
                             * https://spec.matrix.org/v1.11/application-service-api/#post_matrixappv1ping
                             * Spec does not talk about what to do with the id. It is safe to ignore it as we are already checking for
                             * homeserver token to be correct.
                             * From the spec this might be a bit confusing, as it shows a txn id for post, but app service doing nothing with it afterwards
                             * when receiving from the homeserver.
                             * From spec directly -
                                AS ---> HS : /_matrix/client/v1/appservice/{appserviceId}/ping {"transaction_id": "meow"}
                                    HS ---> AS : /_matrix/app/v1/ping {"transaction_id": "meow"}
                                    HS <--- AS : 200 OK {}
                                AS <--- HS : 200 OK {"duration_ms": 123}
                             * https://github.com/matrix-org/matrix-spec/blob/e53e6ea8764b95f0bdb738549fca6f9f3f901298/content/application-service-api.md?plain=1#L229-L232
                             * Code - wise, also doesn't care what happens with the response.
                             * https://github.com/element-hq/synapse/blob/cb6f4a84a6a8f2b79b80851f37eb5fa4c7c5264a/synapse/rest/client/appservice_ping.py#L80 - nothing done on return
                             * https://github.com/element-hq/synapse/blob/cb6f4a84a6a8f2b79b80851f37eb5fa4c7c5264a/synapse/appservice/api.py#L321-L332 - not even returning the response, caring for just the http status code - https://github.com/element-hq/synapse/blob/cb6f4a84a6a8f2b79b80851f37eb5fa4c7c5264a/synapse/http/client.py#L532-L537
                             */
                            res.status(200).json({});
                        },
                    });
                    this.isRunning = true;
                }
            }
            catch (err) {
                logger_1.federationBridgeLogger.error({ msg: 'Failed to initialize the matrix-appservice-bridge.', err });
            }
            finally {
                this.isUpdatingBridgeStatus = false;
            }
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning) {
                return;
            }
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                // the http server might take some minutes to shutdown, and this promise can take some time to be resolved
                yield ((_a = this.bridgeInstance) === null || _a === void 0 ? void 0 : _a.close());
                this.isRunning = false;
                resolve();
            }));
        });
    }
    getUserProfileInformation(externalUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const externalInformation = yield this.bridgeInstance.getIntent(externalUserId).getProfileInfo(externalUserId, undefined, false);
                return Object.assign({ displayName: externalInformation.displayname || '' }, (externalInformation.avatar_url
                    ? {
                        avatarUrl: externalInformation.avatar_url,
                    }
                    : {}));
            }
            catch (err) {
                // no-op
            }
        });
    }
    joinRoom(externalRoomId, externalUserId, viaServers) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.bridgeInstance
                    .getIntent(externalUserId)
                    .matrixClient.doRequest('POST', `/_matrix/client/v3/join/${externalRoomId}`, { server_name: viaServers }, {}, DEFAULT_TIMEOUT_IN_MS_FOR_JOINING_ROOMS);
            }
            catch (e) {
                throw new Error('Error joining Matrix room');
            }
        });
    }
    getRoomHistoricalJoinEvents(externalRoomId_1, externalUserId_1) {
        return __awaiter(this, arguments, void 0, function* (externalRoomId, externalUserId, excludingUserIds = []) {
            var _a, _b;
            const events = yield this.bridgeInstance.getIntent(externalUserId).matrixClient.getRoomState(externalRoomId);
            const roomCreator = (_b = (_a = events.find((event) => event.type === MatrixEventType_1.MatrixEventType.ROOM_CREATED)) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.creator;
            if (!roomCreator) {
                return [];
            }
            return events
                .filter((event) => event.type === MatrixEventType_1.MatrixEventType.ROOM_MEMBERSHIP_CHANGED &&
                event.content.membership === RoomMembershipChanged_1.RoomMembershipChangedEventType.JOIN &&
                !excludingUserIds.includes(event.state_key))
                .map((event) => (Object.assign(Object.assign({}, event), { sender: roomCreator })));
        });
    }
    getRoomData(externalUserId, externalRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const includeEvents = ['join'];
            const excludeEvents = ['leave', 'ban'];
            const members = yield this.bridgeInstance
                .getIntent(externalUserId)
                .matrixClient.getRoomMembers(externalRoomId, undefined, includeEvents, excludeEvents);
            const joinedMembers = yield this.bridgeInstance.getIntent(externalUserId).matrixClient.getJoinedRoomMembers(externalRoomId);
            const oldestFirst = members.sort((a, b) => a.timestamp - b.timestamp).shift();
            if (!oldestFirst) {
                return;
            }
            const roomName = yield this.getRoomName(externalRoomId, externalUserId);
            if (!roomName) {
                return;
            }
            return {
                creator: {
                    id: oldestFirst.sender,
                    username: (0, RoomReceiver_1.formatExternalUserIdToInternalUsernameFormat)(oldestFirst.sender),
                },
                joinedMembers,
                name: roomName,
            };
        });
    }
    inviteToRoom(externalRoomId, externalInviterId, externalInviteeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.bridgeInstance.getIntent(externalInviterId).invite(externalRoomId, externalInviteeId);
            }
            catch (e) {
                // no-op
            }
        });
    }
    setUserAvatar(externalUserId, avatarUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.bridgeInstance.getIntent(externalUserId).matrixClient.setAvatarUrl(avatarUrl);
            }
            catch (e) {
                // no-op
            }
        });
    }
    verifyInviteeIds(matrixIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const matrixIdVerificationMap = new Map();
            const matrixIdsVerificationPromises = matrixIds.map((matrixId) => this.verifyInviteeId(matrixId));
            const matrixIdsVerificationPromiseResponse = yield Promise.allSettled(matrixIdsVerificationPromises);
            const matrixIdsVerificationFulfilledResults = matrixIdsVerificationPromiseResponse
                .filter((result) => result.status === 'fulfilled')
                .map((result) => result.value);
            matrixIds.forEach((matrixId, idx) => matrixIdVerificationMap.set(matrixId, matrixIdsVerificationFulfilledResults[idx]));
            return matrixIdVerificationMap;
        });
    }
    verifyInviteeId(externalInviteeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [userId, homeserverUrl] = (0, MatrixIdStringTools_1.extractUserIdAndHomeserverFromMatrixId)(externalInviteeId);
            try {
                const response = yield (0, server_fetch_1.serverFetch)(`https://${homeserverUrl}/_matrix/client/v3/register/available`, { params: { username: userId } });
                if (response.status === 400 /* HttpStatusCodes.BAD_REQUEST */) {
                    const responseBody = yield response.json();
                    if (responseBody.errcode === MatrixIdVerificationTypes_1.MATRIX_USER_IN_USE) {
                        return "VERIFIED" /* VerificationStatus.VERIFIED */;
                    }
                }
                if (response.status === 200 /* HttpStatusCodes.OK */) {
                    return "UNVERIFIED" /* VerificationStatus.UNVERIFIED */;
                }
            }
            catch (e) {
                return "UNABLE_TO_VERIFY" /* VerificationStatus.UNABLE_TO_VERIFY */;
            }
            return "UNABLE_TO_VERIFY" /* VerificationStatus.UNABLE_TO_VERIFY */;
        });
    }
    createUser(username, name, domain, avatarUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!MatrixUserInstance) {
                throw new Error('Error loading the Matrix User instance from the external library');
            }
            const matrixUserId = `@${username === null || username === void 0 ? void 0 : username.toLowerCase()}:${domain}`;
            const newUser = new MatrixUserInstance(matrixUserId);
            yield this.bridgeInstance.provisionUser(newUser, Object.assign({ name }, (avatarUrl ? { url: avatarUrl } : {})));
            return matrixUserId;
        });
    }
    setUserDisplayName(externalUserId, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.bridgeInstance.getIntent(externalUserId).setDisplayName(displayName);
            }
            catch (e) {
                // no-op
            }
        });
    }
    createDirectMessageRoom(externalCreatorId_1, inviteesExternalIds_1) {
        return __awaiter(this, arguments, void 0, function* (externalCreatorId, inviteesExternalIds, extraData = {}) {
            const intent = this.bridgeInstance.getIntent(externalCreatorId);
            const visibility = MatrixRoomVisibility_1.MatrixRoomVisibility.PRIVATE;
            const preset = MatrixRoomType_1.MatrixRoomType.PRIVATE;
            const matrixRoom = yield intent.createRoom({
                createAsClient: true,
                options: {
                    visibility,
                    preset,
                    is_direct: true,
                    invite: inviteesExternalIds,
                    creation_content: Object.assign(Object.assign({ was_internally_programatically_created: true }, extraData), { inviteesExternalIds }),
                },
            });
            return matrixRoom.room_id;
        });
    }
    sendMessage(externalRoomId, externalSenderId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messageId = yield this.bridgeInstance
                    .getIntent(externalSenderId)
                    .matrixClient.sendRawEvent(externalRoomId, MatrixEventType_1.MatrixEventType.ROOM_MESSAGE_SENT, {
                    msgtype: 'm.text',
                    body: this.escapeEmojis(message.msg),
                    formatted_body: this.escapeEmojis(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                        message: message.msg,
                        externalRoomId,
                        homeServerDomain: this.internalSettings.getHomeServerDomain(),
                    })),
                    format: 'org.matrix.custom.html',
                });
                return messageId;
            }
            catch (e) {
                throw new Error('User is not part of the room.');
            }
        });
    }
    sendThreadMessage(externalRoomId, externalSenderId, message, relatesToEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = this.escapeEmojis(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: message.msg,
                externalRoomId,
                homeServerDomain: this.internalSettings.getHomeServerDomain(),
            }));
            const messageId = yield this.bridgeInstance
                .getIntent(externalSenderId)
                .matrixClient.sendRawEvent(externalRoomId, MatrixEventType_1.MatrixEventType.ROOM_MESSAGE_SENT, {
                'msgtype': 'm.text',
                'body': this.escapeEmojis(message.msg),
                'formatted_body': text,
                'format': 'org.matrix.custom.html',
                'm.relates_to': {
                    'rel_type': 'm.thread',
                    'event_id': relatesToEventId,
                    'is_falling_back': true,
                    'm.in_reply_to': {
                        event_id: relatesToEventId,
                    },
                },
            });
            return messageId;
        });
    }
    sendThreadReplyToMessage(externalRoomId, externalUserId, eventToReplyTo, originalEventSender, replyMessage, relatesToEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { formattedMessage, message } = yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                externalRoomId,
                eventToReplyTo,
                originalEventSender,
                message: this.escapeEmojis(replyMessage),
                homeServerDomain: this.internalSettings.getHomeServerDomain(),
            });
            const messageId = yield this.bridgeInstance
                .getIntent(externalUserId)
                .matrixClient.sendRawEvent(externalRoomId, MatrixEventType_1.MatrixEventType.ROOM_MESSAGE_SENT, {
                'msgtype': 'm.text',
                'body': message,
                'format': 'org.matrix.custom.html',
                'formatted_body': formattedMessage,
                'm.relates_to': {
                    'rel_type': 'm.thread',
                    'event_id': relatesToEventId,
                    'is_falling_back': false,
                    'm.in_reply_to': {
                        event_id: eventToReplyTo,
                    },
                },
            });
            return messageId;
        });
    }
    sendMessageFileToThread(externalRoomId, externalSenderId, content, fileDetails, relatesToEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const mxcUrl = yield this.bridgeInstance.getIntent(externalSenderId).uploadContent(content);
                const messageId = yield this.bridgeInstance
                    .getIntent(externalSenderId)
                    .matrixClient.sendRawEvent(externalRoomId, MatrixEventType_1.MatrixEventType.ROOM_MESSAGE_SENT, {
                    'body': fileDetails.filename,
                    'filename': fileDetails.filename,
                    'info': Object.assign({ size: fileDetails.fileSize, mimetype: fileDetails.mimeType }, (((_a = fileDetails.metadata) === null || _a === void 0 ? void 0 : _a.height) && ((_b = fileDetails.metadata) === null || _b === void 0 ? void 0 : _b.width)
                        ? { h: (_c = fileDetails.metadata) === null || _c === void 0 ? void 0 : _c.height, w: (_d = fileDetails.metadata) === null || _d === void 0 ? void 0 : _d.width }
                        : {})),
                    'msgtype': this.getMsgTypeBasedOnMimeType(fileDetails.mimeType),
                    'url': mxcUrl,
                    'm.relates_to': {
                        'rel_type': 'm.thread',
                        'event_id': relatesToEventId,
                        'is_falling_back': true,
                        'm.in_reply_to': {
                            event_id: relatesToEventId,
                        },
                    },
                });
                return messageId;
            }
            catch (e) {
                logger_1.federationBridgeLogger.error({ msg: 'Error sending file to thread', err: e });
                if (((_e = e.body) === null || _e === void 0 ? void 0 : _e.includes('413')) || ((_f = e.body) === null || _f === void 0 ? void 0 : _f.includes('M_TOO_LARGE'))) {
                    throw new Error('File is too large');
                }
                return '';
            }
        });
    }
    sendReplyMessageFileToThread(externalRoomId, externalSenderId, content, fileDetails, eventToReplyTo, relatesToEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const mxcUrl = yield this.bridgeInstance.getIntent(externalSenderId).uploadContent(content);
                const messageId = yield this.bridgeInstance
                    .getIntent(externalSenderId)
                    .matrixClient.sendRawEvent(externalRoomId, MatrixEventType_1.MatrixEventType.ROOM_MESSAGE_SENT, {
                    'body': fileDetails.filename,
                    'filename': fileDetails.filename,
                    'info': Object.assign({ size: fileDetails.fileSize, mimetype: fileDetails.mimeType }, (((_a = fileDetails.metadata) === null || _a === void 0 ? void 0 : _a.height) && ((_b = fileDetails.metadata) === null || _b === void 0 ? void 0 : _b.width)
                        ? { h: (_c = fileDetails.metadata) === null || _c === void 0 ? void 0 : _c.height, w: (_d = fileDetails.metadata) === null || _d === void 0 ? void 0 : _d.width }
                        : {})),
                    'msgtype': this.getMsgTypeBasedOnMimeType(fileDetails.mimeType),
                    'url': mxcUrl,
                    'm.relates_to': {
                        'rel_type': 'm.thread',
                        'event_id': relatesToEventId,
                        'is_falling_back': false,
                        'm.in_reply_to': {
                            event_id: eventToReplyTo,
                        },
                    },
                });
                return messageId;
            }
            catch (e) {
                logger_1.federationBridgeLogger.error({ msg: 'Error sending file to thread', err: e });
                if (((_e = e.body) === null || _e === void 0 ? void 0 : _e.includes('413')) || ((_f = e.body) === null || _f === void 0 ? void 0 : _f.includes('M_TOO_LARGE'))) {
                    throw new Error('File is too large');
                }
                return '';
            }
        });
    }
    sendReplyToMessage(externalRoomId, externalUserId, eventToReplyTo, originalEventSender, replyMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const { formattedMessage, message } = yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                externalRoomId,
                eventToReplyTo,
                originalEventSender,
                message: this.escapeEmojis(replyMessage),
                homeServerDomain: this.internalSettings.getHomeServerDomain(),
            });
            const messageId = yield this.bridgeInstance
                .getIntent(externalUserId)
                .matrixClient.sendEvent(externalRoomId, MatrixEventType_1.MatrixEventType.ROOM_MESSAGE_SENT, {
                'body': message,
                'format': 'org.matrix.custom.html',
                'formatted_body': formattedMessage,
                'm.relates_to': {
                    'm.in_reply_to': { event_id: eventToReplyTo },
                },
                'msgtype': RoomMessageSent_1.MatrixEnumSendMessageType.TEXT,
            });
            return messageId;
        });
    }
    escapeEmojis(text) {
        return (0, MessageReceiver_1.convertEmojisFromRCFormatToMatrixFormat)(text);
    }
    getReadStreamForFileFromUrl(externalUserId, fileUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, server_fetch_1.serverFetch)(yield this.convertMatrixUrlToHttp(externalUserId, fileUrl));
            if (!response.body) {
                throw new Error('Not able to download the file');
            }
            return response.body;
        });
    }
    isUserIdFromTheSameHomeserver(externalUserId, domain) {
        const userDomain = this.extractHomeserverOrigin(externalUserId);
        return userDomain === domain;
    }
    extractHomeserverOrigin(externalUserId) {
        return externalUserId.includes(':') ? externalUserId.split(':').pop() || '' : this.internalSettings.getHomeServerDomain();
    }
    isRoomFromTheSameHomeserver(externalRoomId, domain) {
        return this.isUserIdFromTheSameHomeserver(externalRoomId, domain);
    }
    logFederationStartupInfo(info) {
        logger_1.federationBridgeLogger.info(`${info}:
			id: ${this.internalSettings.getApplicationServiceId()}
			bridgeUrl: ${this.internalSettings.getBridgeUrl()}
			homeserverURL: ${this.internalSettings.getHomeServerUrl()}
			homeserverDomain: ${this.internalSettings.getHomeServerDomain()}
		`);
    }
    leaveRoom(externalRoomId, externalUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.bridgeInstance.getIntent(externalUserId).leave(externalRoomId);
            }
            catch (e) {
                // no-op
            }
        });
    }
    kickUserFromRoom(externalRoomId, externalUserId, externalOwnerId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bridgeInstance.getIntent(externalOwnerId).kick(externalRoomId, externalUserId);
        });
    }
    setRoomPowerLevels(externalRoomId, externalOwnerId, externalUserId, powerLevels) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bridgeInstance.getIntent(externalOwnerId).setPowerLevel(externalRoomId, externalUserId, powerLevels);
        });
    }
    redactEvent(externalRoomId, externalUserId, externalEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bridgeInstance.getIntent(externalUserId).matrixClient.redactEvent(externalRoomId, externalEventId);
        });
    }
    notifyUserTyping(externalRoomId, externalUserId, isTyping) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bridgeInstance.getIntent(externalUserId).sendTyping(externalRoomId, isTyping);
        });
    }
    sendMessageReaction(externalRoomId, externalUserId, externalEventId, reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = yield this.bridgeInstance
                .getIntent(externalUserId)
                .matrixClient.sendEvent(externalRoomId, MatrixEventType_1.MatrixEventType.MESSAGE_REACTED, {
                'm.relates_to': {
                    event_id: externalEventId,
                    key: (0, MessageReceiver_1.convertEmojisFromRCFormatToMatrixFormat)(reaction),
                    rel_type: 'm.annotation',
                },
            });
            return eventId;
        });
    }
    updateMessage(externalRoomId, externalUserId, externalEventId, newMessageText) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageInExternalFormat = this.escapeEmojis(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: newMessageText,
                externalRoomId,
                homeServerDomain: this.internalSettings.getHomeServerDomain(),
            }));
            yield this.bridgeInstance.getIntent(externalUserId).matrixClient.sendEvent(externalRoomId, MatrixEventType_1.MatrixEventType.ROOM_MESSAGE_SENT, {
                'body': ` * ${this.escapeEmojis(newMessageText)}`,
                'format': 'org.matrix.custom.html',
                'formatted_body': messageInExternalFormat,
                'm.new_content': {
                    body: this.escapeEmojis(newMessageText),
                    format: 'org.matrix.custom.html',
                    formatted_body: messageInExternalFormat,
                    msgtype: RoomMessageSent_1.MatrixEnumSendMessageType.TEXT,
                },
                'm.relates_to': {
                    rel_type: RoomMessageSent_1.MatrixEnumRelatesToRelType.REPLACE,
                    event_id: externalEventId,
                },
                'msgtype': RoomMessageSent_1.MatrixEnumSendMessageType.TEXT,
            });
        });
    }
    sendMessageFileToRoom(externalRoomId, externaSenderId, content, fileDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const mxcUrl = yield this.bridgeInstance.getIntent(externaSenderId).uploadContent(content);
                const { event_id: messageId } = yield this.bridgeInstance.getIntent(externaSenderId).sendMessage(externalRoomId, {
                    body: fileDetails.filename,
                    filename: fileDetails.filename,
                    info: Object.assign({ size: fileDetails.fileSize, mimetype: fileDetails.mimeType }, (((_a = fileDetails.metadata) === null || _a === void 0 ? void 0 : _a.height) && ((_b = fileDetails.metadata) === null || _b === void 0 ? void 0 : _b.width)
                        ? { h: (_c = fileDetails.metadata) === null || _c === void 0 ? void 0 : _c.height, w: (_d = fileDetails.metadata) === null || _d === void 0 ? void 0 : _d.width }
                        : {})),
                    msgtype: this.getMsgTypeBasedOnMimeType(fileDetails.mimeType),
                    url: mxcUrl,
                });
                return messageId;
            }
            catch (e) {
                logger_1.federationBridgeLogger.error({ msg: 'Error sending file to room', err: e });
                if (((_e = e.body) === null || _e === void 0 ? void 0 : _e.includes('413')) || ((_f = e.body) === null || _f === void 0 ? void 0 : _f.includes('M_TOO_LARGE'))) {
                    throw new Error('File is too large');
                }
                return '';
            }
        });
    }
    sendReplyMessageFileToRoom(externalRoomId, externaSenderId, content, fileDetails, eventToReplyTo) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const mxcUrl = yield this.bridgeInstance.getIntent(externaSenderId).uploadContent(content);
                const { event_id: messageId } = yield this.bridgeInstance.getIntent(externaSenderId).sendMessage(externalRoomId, {
                    'body': fileDetails.filename,
                    'filename': fileDetails.filename,
                    'info': Object.assign({ size: fileDetails.fileSize, mimetype: fileDetails.mimeType }, (((_a = fileDetails.metadata) === null || _a === void 0 ? void 0 : _a.height) && ((_b = fileDetails.metadata) === null || _b === void 0 ? void 0 : _b.width)
                        ? { h: (_c = fileDetails.metadata) === null || _c === void 0 ? void 0 : _c.height, w: (_d = fileDetails.metadata) === null || _d === void 0 ? void 0 : _d.width }
                        : {})),
                    'm.relates_to': {
                        'm.in_reply_to': { event_id: eventToReplyTo },
                    },
                    'msgtype': this.getMsgTypeBasedOnMimeType(fileDetails.mimeType),
                    'url': mxcUrl,
                });
                return messageId;
            }
            catch (e) {
                logger_1.federationBridgeLogger.error({ msg: 'Error sending file to room', err: e });
                if (((_e = e.body) === null || _e === void 0 ? void 0 : _e.includes('413')) || ((_f = e.body) === null || _f === void 0 ? void 0 : _f.includes('M_TOO_LARGE'))) {
                    throw new Error('File is too large');
                }
                return '';
            }
        });
    }
    getMsgTypeBasedOnMimeType(mimeType) {
        const knownImageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const knownAudioMimeTypes = ['audio/mpeg', 'audio/ogg', 'audio/wav'];
        const knownVideoMimeTypes = ['video/mp4', 'video/ogg', 'video/webm'];
        if (knownImageMimeTypes.includes(mimeType)) {
            return RoomMessageSent_1.MatrixEnumSendMessageType.IMAGE;
        }
        if (knownAudioMimeTypes.includes(mimeType)) {
            return RoomMessageSent_1.MatrixEnumSendMessageType.AUDIO;
        }
        if (knownVideoMimeTypes.includes(mimeType)) {
            return RoomMessageSent_1.MatrixEnumSendMessageType.VIDEO;
        }
        return RoomMessageSent_1.MatrixEnumSendMessageType.FILE;
    }
    getMyHomeServerOrigin() {
        return new URL(`https://${this.internalSettings.getHomeServerDomain()}`).hostname;
    }
    uploadContent(externalSenderId, content, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const mxcUrl = yield this.bridgeInstance.getIntent(externalSenderId).uploadContent(content, options);
                return mxcUrl;
            }
            catch (e) {
                logger_1.federationBridgeLogger.error({ msg: 'Error uploading content to Matrix', err: e });
                if (((_a = e.body) === null || _a === void 0 ? void 0 : _a.includes('413')) || ((_b = e.body) === null || _b === void 0 ? void 0 : _b.includes('M_TOO_LARGE'))) {
                    throw new Error('File is too large');
                }
            }
        });
    }
    getRoomName(externalRoomId, externalUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const roomState = (yield this.bridgeInstance.getIntent(externalUserId).roomState(externalRoomId));
                return (_b = (_a = (roomState || []).find((event) => (event === null || event === void 0 ? void 0 : event.type) === MatrixEventType_1.MatrixEventType.ROOM_NAME_CHANGED)) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.name;
            }
            catch (error) {
                // no-op
            }
        });
    }
    getRoomTopic(externalRoomId, externalUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const roomState = (yield this.bridgeInstance.getIntent(externalUserId).roomState(externalRoomId));
                return (_b = (_a = (roomState || []).find((event) => (event === null || event === void 0 ? void 0 : event.type) === MatrixEventType_1.MatrixEventType.ROOM_TOPIC_CHANGED)) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.topic;
            }
            catch (error) {
                // no-op
            }
        });
    }
    setRoomName(externalRoomId, externalUserId, roomName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bridgeInstance.getIntent(externalUserId).setRoomName(externalRoomId, roomName);
        });
    }
    setRoomTopic(externalRoomId, externalUserId, roomTopic) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bridgeInstance.getIntent(externalUserId).setRoomTopic(externalRoomId, roomTopic);
        });
    }
    convertMatrixUrlToHttp(externalUserId, matrixUrl) {
        return this.bridgeInstance.getIntent(externalUserId).matrixClient.mxcToHttp(matrixUrl);
    }
    createInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.federationBridgeLogger.info('Performing Dynamic Import of matrix-appservice-bridge');
            // Dynamic import to prevent Rocket.Chat from loading the module until needed and then handle if that fails
            const { Bridge, AppServiceRegistration, MatrixUser } = yield Promise.resolve().then(() => __importStar(require('matrix-appservice-bridge')));
            MatrixUserInstance = MatrixUser;
            const registrationFile = this.internalSettings.getAppServiceRegistrationObject();
            this.bridgeInstance = new Bridge({
                homeserverUrl: this.internalSettings.getHomeServerUrl(),
                domain: this.internalSettings.getHomeServerDomain(),
                registration: AppServiceRegistration.fromObject(this.convertRegistrationFileToMatrixFormat(registrationFile)),
                disableStores: true,
                controller: Object.assign({ onEvent: (request) => {
                        const event = request.getData();
                        // TODO: can we ignore all events from out homeserver?
                        // This was added particularly to avoid duplicating messages.
                        // Messages sent from rocket.chat also causes a m.room.message event, which if gets to this bridge
                        // before the event id promise is resolved, the respective message does not get event id attached to them any longer,
                        // thus this event handler "resends" the message to the rocket.chat room (not to matrix though).
                        if (event.type === 'm.room.message' && this.extractHomeserverOrigin(event.sender) === this.getMyHomeServerOrigin()) {
                            return;
                        }
                        this.eventHandler(event);
                    }, onLog: (line, isError) => {
                        console.log(line, isError);
                    } }, (this.internalSettings.getAppServiceRegistrationObject().enableEphemeralEvents
                    ? {
                        onEphemeralEvent: (request) => {
                            const event = request.getData();
                            this.eventHandler(event);
                        },
                    }
                    : {})),
            });
        });
    }
    convertRegistrationFileToMatrixFormat(registrationFile) {
        return {
            'id': registrationFile.id,
            'hs_token': registrationFile.homeserverToken,
            'as_token': registrationFile.applicationServiceToken,
            'url': registrationFile.bridgeUrl,
            'sender_localpart': registrationFile.botName,
            'namespaces': registrationFile.listenTo,
            'de.sorunome.msc2409.push_ephemeral': registrationFile.enableEphemeralEvents,
        };
    }
    ping() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning || !this.bridgeInstance) {
                throw new Error("matrix bridge isn't yet running");
            }
            const { duration_ms: durationMs } = yield this.bridgeInstance.getIntent().matrixClient.doRequest('POST', `/_matrix/client/v1/appservice/${this.internalSettings.getApplicationServiceId()}/ping`, {}, 
            /*
             * Empty txn id as it is optional, neither does the spec says exactly what to do with it.
             * https://github.com/matrix-org/matrix-spec/blob/1fc8f8856fe47849f90344cfa91601c984627acb/data/api/client-server/appservice_ping.yaml#L55-L56
             */
            {}, DEFAULT_TIMEOUT_IN_MS_FOR_PING_EVENT);
            return { durationMs };
        });
    }
    deactivateUser(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
             * https://spec.matrix.org/v1.11/client-server-api/#post_matrixclientv3accountdeactivate
             * Using { erase: false } since rocket.chat side on deactivation we do not delete anything.
             */
            const resp = yield this.bridgeInstance
                .getIntent()
                .matrixClient.doRequest('POST', '/_matrix/client/v3/account/deactivate', { user_id: uid }, { erase: false });
            if (resp.id_server_unbind_result !== 'success') {
                throw new Error('Failed to deactivate matrix user');
            }
        });
    }
}
exports.MatrixBridge = MatrixBridge;
