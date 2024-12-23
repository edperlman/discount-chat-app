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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTRRoom = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const random_1 = require("@rocket.chat/random");
const ejson_1 = __importDefault(require("ejson"));
const meteor_1 = require("meteor/meteor");
const reactive_var_1 = require("meteor/reactive-var");
const tracker_1 = require("meteor/tracker");
const GenericModal_1 = __importDefault(require("../../../client/components/GenericModal"));
const imperativeModal_1 = require("../../../client/lib/imperativeModal");
const presence_1 = require("../../../client/lib/presence");
const toast_1 = require("../../../client/lib/toast");
const getUidDirectMessage_1 = require("../../../client/lib/utils/getUidDirectMessage");
const goToRoomById_1 = require("../../../client/lib/utils/goToRoomById");
const SDKClient_1 = require("../../utils/client/lib/SDKClient");
const i18n_1 = require("../../utils/lib/i18n");
const OtrRoomState_1 = require("../lib/OtrRoomState");
const constants_1 = require("../lib/constants");
const functions_1 = require("../lib/functions");
class OTRRoom {
    constructor(uid, rid, peerId) {
        this.state = new reactive_var_1.ReactiveVar(OtrRoomState_1.OtrRoomState.NOT_STARTED);
        this._userId = uid;
        this._roomId = rid;
        this._keyPair = null;
        this._sessionKey = null;
        this.peerId = peerId;
        this.isFirstOTR = true;
        this.onPresenceEventHook = this.onPresenceEvent.bind(this);
    }
    static create(uid, rid) {
        const peerId = (0, getUidDirectMessage_1.getUidDirectMessage)(rid);
        if (!peerId) {
            return undefined;
        }
        return new OTRRoom(uid, rid, peerId);
    }
    getPeerId() {
        return this.peerId;
    }
    getState() {
        return this.state.get();
    }
    setState(nextState) {
        if (this.getState() === nextState) {
            return;
        }
        this.state.set(nextState);
    }
    handshake(refresh) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setState(OtrRoomState_1.OtrRoomState.ESTABLISHING);
            yield this.generateKeyPair();
            SDKClient_1.sdk.publish('notify-user', [
                `${this.peerId}/otr`,
                'handshake',
                {
                    roomId: this._roomId,
                    userId: this._userId,
                    publicKey: ejson_1.default.stringify(this._exportedPublicKey),
                    refresh,
                },
            ]);
            if (refresh) {
                const user = meteor_1.Meteor.user();
                if (!user) {
                    return;
                }
                yield SDKClient_1.sdk.rest.post('/v1/chat.otr', {
                    roomId: this._roomId,
                    type: constants_1.otrSystemMessages.USER_REQUESTED_OTR_KEY_REFRESH,
                });
                this.isFirstOTR = false;
            }
        });
    }
    onPresenceEvent(event) {
        if (!event) {
            return;
        }
        if (event.status !== core_typings_1.UserStatus.OFFLINE) {
            return;
        }
        console.warn(`OTR Room ${this._roomId} ended because ${this.peerId} went offline`);
        this.end();
        imperativeModal_1.imperativeModal.open({
            component: GenericModal_1.default,
            props: {
                variant: 'warning',
                title: (0, i18n_1.t)('OTR'),
                children: (0, i18n_1.t)('OTR_Session_ended_other_user_went_offline', { username: event.username }),
                confirmText: (0, i18n_1.t)('Ok'),
                onClose: imperativeModal_1.imperativeModal.close,
                onConfirm: imperativeModal_1.imperativeModal.close,
            },
        });
    }
    // Starts listening to other user's status changes and end OTR if any of the Users goes offline
    // this should be called in 2 places: on acknowledge (meaning user accepted OTR) or on establish (meaning user initiated OTR)
    listenToUserStatus() {
        presence_1.Presence.listen(this.peerId, this.onPresenceEventHook);
    }
    acknowledge() {
        void SDKClient_1.sdk.rest.post('/v1/statistics.telemetry', { params: [{ eventName: 'otrStats', timestamp: Date.now(), rid: this._roomId }] });
        SDKClient_1.sdk.publish('notify-user', [
            `${this.peerId}/otr`,
            'acknowledge',
            {
                roomId: this._roomId,
                userId: this._userId,
                publicKey: ejson_1.default.stringify(this._exportedPublicKey),
            },
        ]);
    }
    deny() {
        this.reset();
        this.setState(OtrRoomState_1.OtrRoomState.DECLINED);
        SDKClient_1.sdk.publish('notify-user', [
            `${this.peerId}/otr`,
            'deny',
            {
                roomId: this._roomId,
                userId: this._userId,
            },
        ]);
    }
    softReset() {
        this.isFirstOTR = true;
        this.setState(OtrRoomState_1.OtrRoomState.NOT_STARTED);
        this._keyPair = null;
        this._exportedPublicKey = {};
        this._sessionKey = null;
    }
    end() {
        this.isFirstOTR = true;
        this.reset();
        this.setState(OtrRoomState_1.OtrRoomState.NOT_STARTED);
        presence_1.Presence.stop(this.peerId, this.onPresenceEventHook);
        SDKClient_1.sdk.publish('notify-user', [
            `${this.peerId}/otr`,
            'end',
            {
                roomId: this._roomId,
                userId: this._userId,
            },
        ]);
    }
    reset() {
        this._keyPair = null;
        this._exportedPublicKey = {};
        this._sessionKey = null;
        void SDKClient_1.sdk.call('deleteOldOTRMessages', this._roomId);
    }
    generateKeyPair() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._userOnlineComputation) {
                this._userOnlineComputation.stop();
            }
            this._userOnlineComputation = tracker_1.Tracker.autorun(() => {
                var _a;
                const $room = document.querySelector(`#chat-window-${this._roomId}`);
                const $title = $room === null || $room === void 0 ? void 0 : $room.querySelector('.rc-header__title');
                if (this.getState() === OtrRoomState_1.OtrRoomState.ESTABLISHED) {
                    if ($room && $title && !$title.querySelector('.otr-icon')) {
                        $title.prepend("<i class='otr-icon icon-key'></i>");
                    }
                }
                else if ($title) {
                    (_a = $title.querySelector('.otr-icon')) === null || _a === void 0 ? void 0 : _a.remove();
                }
            });
            try {
                // Generate an ephemeral key pair.
                this._keyPair = yield (0, functions_1.generateKeyPair)();
                if (!this._keyPair.publicKey) {
                    throw new Error('Public key is not generated');
                }
                this._exportedPublicKey = yield (0, functions_1.exportKey)(this._keyPair.publicKey);
                // Once we have generated new keys, it's safe to delete old messages
                void SDKClient_1.sdk.call('deleteOldOTRMessages', this._roomId);
            }
            catch (e) {
                this.setState(OtrRoomState_1.OtrRoomState.ERROR);
                throw e;
            }
        });
    }
    importPublicKey(publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this._keyPair)
                    throw new Error('No key pair');
                const publicKeyObject = ejson_1.default.parse(publicKey);
                const peerPublicKey = yield (0, functions_1.importKey)(publicKeyObject);
                const ecdhObj = {
                    name: 'ECDH',
                    namedCurve: 'P-256',
                    public: peerPublicKey,
                };
                const bits = yield (0, functions_1.deriveBits)({ ecdhObj, _keyPair: this._keyPair });
                const hashedBits = yield (0, functions_1.digest)(bits);
                // We truncate the hash to 128 bits.
                const sessionKeyData = new Uint8Array(hashedBits).slice(0, 16);
                // Session key available.
                this._sessionKey = yield (0, functions_1.importKeyRaw)(sessionKeyData);
            }
            catch (e) {
                this.setState(OtrRoomState_1.OtrRoomState.ERROR);
                throw e;
            }
        });
    }
    encryptText(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof data === 'string') {
                data = new TextEncoder().encode(ejson_1.default.stringify({ text: data, ack: random_1.Random.id((random_1.Random.fraction() + 1) * 20) }));
            }
            try {
                if (!this._sessionKey)
                    throw new Error('Session Key not available');
                const iv = crypto.getRandomValues(new Uint8Array(12));
                const encryptedData = yield (0, functions_1.encryptAES)({ iv, _sessionKey: this._sessionKey, data });
                const output = (0, functions_1.joinEncryptedData)({ encryptedData, iv });
                return ejson_1.default.stringify(output);
            }
            catch (e) {
                this.setState(OtrRoomState_1.OtrRoomState.ERROR);
                throw new meteor_1.Meteor.Error('encryption-error', 'Encryption error.');
            }
        });
    }
    encrypt(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = new TextEncoder().encode(ejson_1.default.stringify({
                    _id: message._id,
                    text: message.msg,
                    userId: this._userId,
                    ack: random_1.Random.id((random_1.Random.fraction() + 1) * 20),
                    ts: new Date(),
                }));
                const enc = yield this.encryptText(data);
                return enc;
            }
            catch (e) {
                throw new meteor_1.Meteor.Error('encryption-error', 'Encryption error.');
            }
        });
    }
    decrypt(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this._sessionKey)
                    throw new Error('Session Key not available.');
                const cipherText = ejson_1.default.parse(message);
                const data = yield (0, functions_1.decryptAES)(cipherText, this._sessionKey);
                const msgDecoded = ejson_1.default.parse(new TextDecoder('UTF-8').decode(new Uint8Array(data)));
                if (msgDecoded && typeof msgDecoded === 'object') {
                    return msgDecoded;
                }
                return message;
            }
            catch (e) {
                (0, toast_1.dispatchToastMessage)({ type: 'error', message: e });
                this.setState(OtrRoomState_1.OtrRoomState.ERROR);
                return message;
            }
        });
    }
    onUserStream(type, data) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (type) {
                case 'handshake':
                    let timeout;
                    const establishConnection = () => __awaiter(this, void 0, void 0, function* () {
                        this.setState(OtrRoomState_1.OtrRoomState.ESTABLISHING);
                        clearTimeout(timeout);
                        try {
                            if (!data.publicKey)
                                throw new Error('Public key is not generated');
                            yield this.generateKeyPair();
                            yield this.importPublicKey(data.publicKey);
                            yield (0, goToRoomById_1.goToRoomById)(data.roomId);
                            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                                this.setState(OtrRoomState_1.OtrRoomState.ESTABLISHED);
                                this.acknowledge();
                                this.listenToUserStatus();
                                if (data.refresh) {
                                    yield SDKClient_1.sdk.rest.post('/v1/chat.otr', {
                                        roomId: this._roomId,
                                        type: constants_1.otrSystemMessages.USER_KEY_REFRESHED_SUCCESSFULLY,
                                    });
                                }
                            }), 0);
                        }
                        catch (e) {
                            (0, toast_1.dispatchToastMessage)({ type: 'error', message: e });
                            throw new meteor_1.Meteor.Error('establish-connection-error', 'Establish connection error.');
                        }
                    });
                    const closeOrCancelModal = () => {
                        clearTimeout(timeout);
                        this.deny();
                        imperativeModal_1.imperativeModal.close();
                    };
                    try {
                        const obj = yield presence_1.Presence.get(data.userId);
                        if (!(obj === null || obj === void 0 ? void 0 : obj.username)) {
                            throw new meteor_1.Meteor.Error('user-not-defined', 'User not defined.');
                        }
                        if (data.refresh && this.getState() === OtrRoomState_1.OtrRoomState.ESTABLISHED) {
                            this.reset();
                            yield establishConnection();
                        }
                        else {
                            /* 	We have to check if there's an in progress handshake request because
                                Notifications.notifyUser will sometimes dispatch 2 events */
                            if (this.getState() === OtrRoomState_1.OtrRoomState.REQUESTED) {
                                return;
                            }
                            if (this.getState() === OtrRoomState_1.OtrRoomState.ESTABLISHED) {
                                this.reset();
                            }
                            this.setState(OtrRoomState_1.OtrRoomState.REQUESTED);
                            imperativeModal_1.imperativeModal.open({
                                component: GenericModal_1.default,
                                props: {
                                    variant: 'warning',
                                    title: (0, i18n_1.t)('OTR'),
                                    children: (0, i18n_1.t)('Username_wants_to_start_otr_Do_you_want_to_accept', {
                                        username: obj.username,
                                    }),
                                    confirmText: (0, i18n_1.t)('Yes'),
                                    cancelText: (0, i18n_1.t)('No'),
                                    onClose: () => closeOrCancelModal(),
                                    onCancel: () => closeOrCancelModal(),
                                    onConfirm: () => __awaiter(this, void 0, void 0, function* () {
                                        yield establishConnection();
                                        imperativeModal_1.imperativeModal.close();
                                    }),
                                },
                            });
                            timeout = setTimeout(() => {
                                this.setState(OtrRoomState_1.OtrRoomState.TIMEOUT);
                                imperativeModal_1.imperativeModal.close();
                            }, 10000);
                        }
                    }
                    catch (e) {
                        (0, toast_1.dispatchToastMessage)({ type: 'error', message: e });
                    }
                    break;
                case 'acknowledge':
                    try {
                        if (!data.publicKey)
                            throw new Error('Public key is not generated');
                        yield this.importPublicKey(data.publicKey);
                        this.setState(OtrRoomState_1.OtrRoomState.ESTABLISHED);
                        if (this.isFirstOTR) {
                            this.listenToUserStatus();
                            yield SDKClient_1.sdk.rest.post('/v1/chat.otr', {
                                roomId: this._roomId,
                                type: constants_1.otrSystemMessages.USER_JOINED_OTR,
                            });
                        }
                        this.isFirstOTR = false;
                    }
                    catch (e) {
                        (0, toast_1.dispatchToastMessage)({ type: 'error', message: e });
                    }
                    break;
                case 'deny':
                    if (this.getState() === OtrRoomState_1.OtrRoomState.ESTABLISHING) {
                        this.reset();
                        this.setState(OtrRoomState_1.OtrRoomState.DECLINED);
                    }
                    break;
                case 'end':
                    try {
                        const obj = yield presence_1.Presence.get(this.peerId);
                        if (!(obj === null || obj === void 0 ? void 0 : obj.username)) {
                            throw new meteor_1.Meteor.Error('user-not-defined', 'User not defined.');
                        }
                        if (this.getState() === OtrRoomState_1.OtrRoomState.ESTABLISHED) {
                            this.reset();
                            this.setState(OtrRoomState_1.OtrRoomState.NOT_STARTED);
                            imperativeModal_1.imperativeModal.open({
                                component: GenericModal_1.default,
                                props: {
                                    variant: 'warning',
                                    title: (0, i18n_1.t)('OTR'),
                                    children: (0, i18n_1.t)('Username_ended_the_OTR_session', { username: obj.username }),
                                    confirmText: (0, i18n_1.t)('Ok'),
                                    onClose: imperativeModal_1.imperativeModal.close,
                                    onConfirm: imperativeModal_1.imperativeModal.close,
                                },
                            });
                        }
                    }
                    catch (e) {
                        (0, toast_1.dispatchToastMessage)({ type: 'error', message: e });
                    }
                    break;
            }
        });
    }
}
exports.OTRRoom = OTRRoom;
