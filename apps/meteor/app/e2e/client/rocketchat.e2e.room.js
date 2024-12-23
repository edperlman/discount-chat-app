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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.E2ERoom = void 0;
const base64_1 = require("@rocket.chat/base64");
const emitter_1 = require("@rocket.chat/emitter");
const ejson_1 = __importDefault(require("ejson"));
const E2ERoomState_1 = require("./E2ERoomState");
const helper_1 = require("./helper");
const logger_1 = require("./logger");
const rocketchat_e2e_1 = require("./rocketchat.e2e");
const RoomManager_1 = require("../../../client/lib/RoomManager");
const roomCoordinator_1 = require("../../../client/lib/rooms/roomCoordinator");
const IRoomTypeConfig_1 = require("../../../definition/IRoomTypeConfig");
const client_1 = require("../../models/client");
const SDKClient_1 = require("../../utils/client/lib/SDKClient");
const i18n_1 = require("../../utils/lib/i18n");
const KEY_ID = Symbol('keyID');
const PAUSED = Symbol('PAUSED');
const permitedMutations = {
    [E2ERoomState_1.E2ERoomState.NOT_STARTED]: [E2ERoomState_1.E2ERoomState.ESTABLISHING, E2ERoomState_1.E2ERoomState.DISABLED, E2ERoomState_1.E2ERoomState.KEYS_RECEIVED],
    [E2ERoomState_1.E2ERoomState.READY]: [E2ERoomState_1.E2ERoomState.DISABLED, E2ERoomState_1.E2ERoomState.CREATING_KEYS, E2ERoomState_1.E2ERoomState.WAITING_KEYS],
    [E2ERoomState_1.E2ERoomState.ERROR]: [E2ERoomState_1.E2ERoomState.KEYS_RECEIVED, E2ERoomState_1.E2ERoomState.NOT_STARTED],
    [E2ERoomState_1.E2ERoomState.WAITING_KEYS]: [E2ERoomState_1.E2ERoomState.KEYS_RECEIVED, E2ERoomState_1.E2ERoomState.ERROR, E2ERoomState_1.E2ERoomState.DISABLED],
    [E2ERoomState_1.E2ERoomState.ESTABLISHING]: [
        E2ERoomState_1.E2ERoomState.READY,
        E2ERoomState_1.E2ERoomState.KEYS_RECEIVED,
        E2ERoomState_1.E2ERoomState.ERROR,
        E2ERoomState_1.E2ERoomState.DISABLED,
        E2ERoomState_1.E2ERoomState.WAITING_KEYS,
        E2ERoomState_1.E2ERoomState.CREATING_KEYS,
    ],
};
const filterMutation = (currentState, nextState) => {
    if (currentState === nextState) {
        return nextState === E2ERoomState_1.E2ERoomState.ERROR;
    }
    if (!(currentState in permitedMutations)) {
        return nextState;
    }
    if (permitedMutations[currentState].includes(nextState)) {
        return nextState;
    }
    return false;
};
class E2ERoom extends emitter_1.Emitter {
    constructor(userId, room) {
        super();
        this.state = undefined;
        this[_a] = undefined;
        this.userId = userId;
        this.roomId = room._id;
        this.typeOfRoom = room.t;
        this.roomKeyId = room.e2eKeyId;
        this.once(E2ERoomState_1.E2ERoomState.READY, () => __awaiter(this, void 0, void 0, function* () {
            yield this.decryptOldRoomKeys();
            return this.decryptPendingMessages();
        }));
        this.once(E2ERoomState_1.E2ERoomState.READY, () => this.decryptSubscription());
        this.on('STATE_CHANGED', (prev) => {
            if (this.roomId === RoomManager_1.RoomManager.opened) {
                this.log(`[PREV: ${prev}]`, 'State CHANGED');
            }
        });
        this.on('STATE_CHANGED', () => this.handshake());
        this.setState(E2ERoomState_1.E2ERoomState.NOT_STARTED);
    }
    log(...msg) {
        (0, logger_1.log)(`E2E ROOM { state: ${this.state}, rid: ${this.roomId} }`, ...msg);
    }
    error(...msg) {
        (0, logger_1.logError)(`E2E ROOM { state: ${this.state}, rid: ${this.roomId} }`, ...msg);
    }
    hasSessionKey() {
        return !!this.groupSessionKey;
    }
    getState() {
        return this.state;
    }
    setState(requestedState) {
        const currentState = this.state;
        const nextState = filterMutation(currentState, requestedState);
        if (!nextState) {
            this.error(`invalid state ${currentState} -> ${requestedState}`);
            return;
        }
        this.state = nextState;
        this.log(currentState, '->', nextState);
        this.emit('STATE_CHANGED', currentState);
        this.emit(nextState, this);
    }
    isReady() {
        return this.state === E2ERoomState_1.E2ERoomState.READY;
    }
    isDisabled() {
        return this.state === E2ERoomState_1.E2ERoomState.DISABLED;
    }
    enable() {
        if (this.state === E2ERoomState_1.E2ERoomState.READY) {
            return;
        }
        this.setState(E2ERoomState_1.E2ERoomState.READY);
    }
    disable() {
        this.setState(E2ERoomState_1.E2ERoomState.DISABLED);
    }
    pause() {
        this.log('PAUSED', this[PAUSED], '->', true);
        this[PAUSED] = true;
        this.emit('PAUSED', true);
    }
    resume() {
        this.log('PAUSED', this[PAUSED], '->', false);
        this[PAUSED] = false;
        this.emit('PAUSED', false);
    }
    keyReceived() {
        this.setState(E2ERoomState_1.E2ERoomState.KEYS_RECEIVED);
    }
    shouldConvertSentMessages(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isReady() || this[PAUSED]) {
                return false;
            }
            if (this[PAUSED] === undefined) {
                return new Promise((resolve) => {
                    this.once('PAUSED', resolve);
                });
            }
            if (message.msg[0] === '/') {
                return false;
            }
            return true;
        });
    }
    shouldConvertReceivedMessages() {
        return this.isReady();
    }
    isWaitingKeys() {
        return this.state === E2ERoomState_1.E2ERoomState.WAITING_KEYS;
    }
    get keyID() {
        return this[KEY_ID];
    }
    set keyID(keyID) {
        this[KEY_ID] = keyID;
    }
    decryptSubscription() {
        return __awaiter(this, void 0, void 0, function* () {
            var _b;
            const subscription = client_1.Subscriptions.findOne({ rid: this.roomId });
            if (((_b = subscription === null || subscription === void 0 ? void 0 : subscription.lastMessage) === null || _b === void 0 ? void 0 : _b.t) !== 'e2e') {
                this.log('decryptSubscriptions nothing to do');
                return;
            }
            const message = yield this.decryptMessage(subscription.lastMessage);
            client_1.Subscriptions.update({
                _id: subscription._id,
            }, {
                $set: {
                    lastMessage: message,
                },
            });
            this.log('decryptSubscriptions Done');
        });
    }
    decryptOldRoomKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            var _b, e_1, _c, _d;
            const sub = client_1.Subscriptions.findOne({ rid: this.roomId });
            if (!(sub === null || sub === void 0 ? void 0 : sub.oldRoomKeys) || (sub === null || sub === void 0 ? void 0 : sub.oldRoomKeys.length) === 0) {
                this.log('decryptOldRoomKeys nothing to do');
                return;
            }
            const keys = [];
            try {
                for (var _e = true, _f = __asyncValues(sub.oldRoomKeys), _g; _g = yield _f.next(), _b = _g.done, !_b; _e = true) {
                    _d = _g.value;
                    _e = false;
                    const key = _d;
                    try {
                        const k = yield this.decryptSessionKey(key.E2EKey);
                        keys.push(Object.assign(Object.assign({}, key), { E2EKey: k }));
                    }
                    catch (e) {
                        this.error(`Cannot decrypt old room key with id ${key.e2eKeyId}. This is likely because user private key changed or is missing. Skipping`);
                        keys.push(Object.assign(Object.assign({}, key), { E2EKey: null }));
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_e && !_b && (_c = _f.return)) yield _c.call(_f);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.oldKeys = keys;
            this.log('decryptOldRoomKeys Done');
        });
    }
    exportOldRoomKeys(oldKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            var _b, oldKeys_1, oldKeys_1_1;
            var _c, e_2, _d, _e;
            this.log('exportOldRoomKeys starting');
            if (!oldKeys || oldKeys.length === 0) {
                this.log('exportOldRoomKeys nothing to do');
                return;
            }
            const keys = [];
            try {
                for (_b = true, oldKeys_1 = __asyncValues(oldKeys); oldKeys_1_1 = yield oldKeys_1.next(), _c = oldKeys_1_1.done, !_c; _b = true) {
                    _e = oldKeys_1_1.value;
                    _b = false;
                    const key = _e;
                    try {
                        if (!key.E2EKey) {
                            continue;
                        }
                        const k = yield this.exportSessionKey(key.E2EKey);
                        keys.push(Object.assign(Object.assign({}, key), { E2EKey: k }));
                    }
                    catch (e) {
                        this.error(`Cannot decrypt old room key with id ${key.e2eKeyId}. This is likely because user private key changed or is missing. Skipping`);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_b && !_c && (_d = oldKeys_1.return)) yield _d.call(oldKeys_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.log(`exportOldRoomKeys Done: ${keys.length} keys exported`);
            return keys;
        });
    }
    decryptPendingMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            return client_1.Messages.find({ rid: this.roomId, t: 'e2e', e2e: 'pending' }).forEach((_b) => __awaiter(this, void 0, void 0, function* () {
                var { _id } = _b, msg = __rest(_b, ["_id"]);
                client_1.Messages.update({ _id }, yield this.decryptMessage(msg));
            }));
        });
    }
    // Initiates E2E Encryption
    handshake() {
        return __awaiter(this, void 0, void 0, function* () {
            var _b;
            if (!rocketchat_e2e_1.e2e.isReady()) {
                return;
            }
            if (this.state !== E2ERoomState_1.E2ERoomState.KEYS_RECEIVED && this.state !== E2ERoomState_1.E2ERoomState.NOT_STARTED) {
                return;
            }
            this.setState(E2ERoomState_1.E2ERoomState.ESTABLISHING);
            try {
                const groupKey = (_b = client_1.Subscriptions.findOne({ rid: this.roomId })) === null || _b === void 0 ? void 0 : _b.E2EKey;
                if (groupKey) {
                    yield this.importGroupKey(groupKey);
                    this.setState(E2ERoomState_1.E2ERoomState.READY);
                    return;
                }
            }
            catch (error) {
                this.setState(E2ERoomState_1.E2ERoomState.ERROR);
                this.error('Error fetching group key: ', error);
                return;
            }
            try {
                const room = client_1.Rooms.findOne({ _id: this.roomId });
                if (!room.e2eKeyId) {
                    this.setState(E2ERoomState_1.E2ERoomState.CREATING_KEYS);
                    yield this.createGroupKey();
                    this.setState(E2ERoomState_1.E2ERoomState.READY);
                    return;
                }
                this.setState(E2ERoomState_1.E2ERoomState.WAITING_KEYS);
                this.log('Requesting room key');
                SDKClient_1.sdk.publish('notify-room-users', [`${this.roomId}/e2ekeyRequest`, this.roomId, room.e2eKeyId]);
            }
            catch (error) {
                // this.error = error;
                this.setState(E2ERoomState_1.E2ERoomState.ERROR);
            }
        });
    }
    isSupportedRoomType(type) {
        return roomCoordinator_1.roomCoordinator.getRoomDirectives(type).allowRoomSettingChange({}, IRoomTypeConfig_1.RoomSettingsEnum.E2E);
    }
    decryptSessionKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, helper_1.importAESKey)(JSON.parse(yield this.exportSessionKey(key)));
        });
    }
    exportSessionKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            key = key.slice(12);
            key = base64_1.Base64.decode(key);
            const decryptedKey = yield (0, helper_1.decryptRSA)(rocketchat_e2e_1.e2e.privateKey, key);
            return (0, helper_1.toString)(decryptedKey);
        });
    }
    importGroupKey(groupKey) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Importing room key ->', this.roomId);
            // Get existing group key
            // const keyID = groupKey.slice(0, 12);
            groupKey = groupKey.slice(12);
            groupKey = base64_1.Base64.decode(groupKey);
            // Decrypt obtained encrypted session key
            try {
                const decryptedKey = yield (0, helper_1.decryptRSA)(rocketchat_e2e_1.e2e.privateKey, groupKey);
                this.sessionKeyExportedString = (0, helper_1.toString)(decryptedKey);
            }
            catch (error) {
                this.error('Error decrypting group key: ', error);
                return false;
            }
            // When a new e2e room is created, it will be initialized without an e2e key id
            // This will prevent new rooms from storing `undefined` as the keyid
            if (!this.keyID) {
                this.keyID = this.roomKeyId || (yield (0, helper_1.createSha256HashFromText)(this.sessionKeyExportedString)).slice(0, 12);
            }
            // Import session key for use.
            try {
                const key = yield (0, helper_1.importAESKey)(JSON.parse(this.sessionKeyExportedString));
                // Key has been obtained. E2E is now in session.
                this.groupSessionKey = key;
            }
            catch (error) {
                this.error('Error importing group key: ', error);
                return false;
            }
            return true;
        });
    }
    createNewGroupKey() {
        return __awaiter(this, void 0, void 0, function* () {
            this.groupSessionKey = yield (0, helper_1.generateAESKey)();
            const sessionKeyExported = yield (0, helper_1.exportJWKKey)(this.groupSessionKey);
            this.sessionKeyExportedString = JSON.stringify(sessionKeyExported);
            this.keyID = (yield (0, helper_1.createSha256HashFromText)(this.sessionKeyExportedString)).slice(0, 12);
        });
    }
    createGroupKey() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Creating room key');
            try {
                yield this.createNewGroupKey();
                yield SDKClient_1.sdk.call('e2e.setRoomKeyID', this.roomId, this.keyID);
                yield SDKClient_1.sdk.rest.post('/v1/e2e.updateGroupKey', {
                    rid: this.roomId,
                    uid: this.userId,
                    key: yield this.encryptGroupKeyForParticipant(rocketchat_e2e_1.e2e.publicKey),
                });
                yield this.encryptKeyForOtherParticipants();
            }
            catch (error) {
                this.error('Error exporting group key: ', error);
                throw error;
            }
        });
    }
    resetRoomKey() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Resetting room key');
            if (!rocketchat_e2e_1.e2e.publicKey) {
                this.error('Cannot reset room key. No public key found.');
                return;
            }
            this.setState(E2ERoomState_1.E2ERoomState.CREATING_KEYS);
            try {
                yield this.createNewGroupKey();
                const e2eNewKeys = { e2eKeyId: this.keyID, e2eKey: yield this.encryptGroupKeyForParticipant(rocketchat_e2e_1.e2e.publicKey) };
                this.setState(E2ERoomState_1.E2ERoomState.READY);
                this.log(`Room key reset done for room ${this.roomId}`);
                return e2eNewKeys;
            }
            catch (error) {
                this.error('Error resetting group key: ', error);
                throw error;
            }
        });
    }
    onRoomKeyReset(keyID) {
        this.log(`Room keyID was reset. New keyID: ${keyID} Previous keyID: ${this.keyID}`);
        this.setState(E2ERoomState_1.E2ERoomState.WAITING_KEYS);
        this.keyID = keyID;
        this.groupSessionKey = undefined;
        this.sessionKeyExportedString = undefined;
        this.sessionKeyExported = undefined;
        this.oldKeys = undefined;
    }
    encryptKeyForOtherParticipants() {
        return __awaiter(this, void 0, void 0, function* () {
            var _b, e_3, _c, _d;
            var _e;
            // Encrypt generated session key for every user in room and publish to subscription model.
            try {
                const mySub = client_1.Subscriptions.findOne({ rid: this.roomId });
                const decryptedOldGroupKeys = yield this.exportOldRoomKeys(mySub === null || mySub === void 0 ? void 0 : mySub.oldRoomKeys);
                const users = (yield SDKClient_1.sdk.call('e2e.getUsersOfRoomWithoutKey', this.roomId)).users.filter((user) => { var _b; return (_b = user === null || user === void 0 ? void 0 : user.e2e) === null || _b === void 0 ? void 0 : _b.public_key; });
                if (!users.length) {
                    return;
                }
                const usersSuggestedGroupKeys = { [this.roomId]: [] };
                try {
                    for (var _f = true, users_1 = __asyncValues(users), users_1_1; users_1_1 = yield users_1.next(), _b = users_1_1.done, !_b; _f = true) {
                        _d = users_1_1.value;
                        _f = false;
                        const user = _d;
                        const encryptedGroupKey = yield this.encryptGroupKeyForParticipant(user.e2e.public_key);
                        const oldKeys = yield this.encryptOldKeysForParticipant((_e = user.e2e) === null || _e === void 0 ? void 0 : _e.public_key, decryptedOldGroupKeys);
                        usersSuggestedGroupKeys[this.roomId].push(Object.assign({ _id: user._id, key: encryptedGroupKey }, (oldKeys && { oldKeys })));
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (!_f && !_b && (_c = users_1.return)) yield _c.call(users_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                yield SDKClient_1.sdk.rest.post('/v1/e2e.provideUsersSuggestedGroupKeys', { usersSuggestedGroupKeys });
            }
            catch (error) {
                return this.error('Error getting room users: ', error);
            }
        });
    }
    encryptOldKeysForParticipant(publicKey, oldRoomKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            var _b, oldRoomKeys_1, oldRoomKeys_1_1;
            var _c, e_4, _d, _e;
            if (!oldRoomKeys || oldRoomKeys.length === 0) {
                return;
            }
            let userKey;
            try {
                userKey = yield (0, helper_1.importRSAKey)(JSON.parse(publicKey), ['encrypt']);
            }
            catch (error) {
                return this.error('Error importing user key: ', error);
            }
            try {
                const keys = [];
                try {
                    for (_b = true, oldRoomKeys_1 = __asyncValues(oldRoomKeys); oldRoomKeys_1_1 = yield oldRoomKeys_1.next(), _c = oldRoomKeys_1_1.done, !_c; _b = true) {
                        _e = oldRoomKeys_1_1.value;
                        _b = false;
                        const oldRoomKey = _e;
                        if (!oldRoomKey.E2EKey) {
                            continue;
                        }
                        const encryptedKey = yield (0, helper_1.encryptRSA)(userKey, (0, helper_1.toArrayBuffer)(oldRoomKey.E2EKey));
                        const encryptedKeyToString = oldRoomKey.e2eKeyId + base64_1.Base64.encode(new Uint8Array(encryptedKey));
                        keys.push(Object.assign(Object.assign({}, oldRoomKey), { E2EKey: encryptedKeyToString }));
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (!_b && !_c && (_d = oldRoomKeys_1.return)) yield _d.call(oldRoomKeys_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                return keys;
            }
            catch (error) {
                return this.error('Error encrypting user key: ', error);
            }
        });
    }
    encryptGroupKeyForParticipant(publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let userKey;
            try {
                userKey = yield (0, helper_1.importRSAKey)(JSON.parse(publicKey), ['encrypt']);
            }
            catch (error) {
                return this.error('Error importing user key: ', error);
            }
            // const vector = crypto.getRandomValues(new Uint8Array(16));
            // Encrypt session key for this user with his/her public key
            try {
                const encryptedUserKey = yield (0, helper_1.encryptRSA)(userKey, (0, helper_1.toArrayBuffer)(this.sessionKeyExportedString));
                const encryptedUserKeyToString = this.keyID + base64_1.Base64.encode(new Uint8Array(encryptedUserKey));
                return encryptedUserKeyToString;
            }
            catch (error) {
                return this.error('Error encrypting user key: ', error);
            }
        });
    }
    // Encrypts files before upload. I/O is in arraybuffers.
    encryptFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (!this.isSupportedRoomType(this.typeOfRoom)) {
            // 	return;
            // }
            const fileArrayBuffer = yield (0, helper_1.readFileAsArrayBuffer)(file);
            const hash = yield (0, helper_1.sha256HashFromArrayBuffer)(new Uint8Array(fileArrayBuffer));
            const vector = crypto.getRandomValues(new Uint8Array(16));
            const key = yield (0, helper_1.generateAESCTRKey)();
            let result;
            try {
                result = yield (0, helper_1.encryptAESCTR)(vector, key, fileArrayBuffer);
            }
            catch (error) {
                console.log(error);
                return this.error('Error encrypting group key: ', error);
            }
            const exportedKey = yield window.crypto.subtle.exportKey('jwk', key);
            const fileName = yield (0, helper_1.createSha256HashFromText)(file.name);
            const encryptedFile = new File([(0, helper_1.toArrayBuffer)(result)], fileName);
            return {
                file: encryptedFile,
                key: exportedKey,
                iv: base64_1.Base64.encode(vector),
                type: file.type,
                hash,
            };
        });
    }
    // Decrypt uploaded encrypted files. I/O is in arraybuffers.
    decryptFile(file, key, iv) {
        return __awaiter(this, void 0, void 0, function* () {
            const ivArray = base64_1.Base64.decode(iv);
            const cryptoKey = yield window.crypto.subtle.importKey('jwk', key, { name: 'AES-CTR' }, true, ['encrypt', 'decrypt']);
            return window.crypto.subtle.decrypt({ name: 'AES-CTR', counter: ivArray, length: 64 }, cryptoKey, file);
        });
    }
    // Encrypts messages
    encryptText(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const vector = crypto.getRandomValues(new Uint8Array(16));
            try {
                const result = yield (0, helper_1.encryptAES)(vector, this.groupSessionKey, data);
                return this.keyID + base64_1.Base64.encode((0, helper_1.joinVectorAndEcryptedData)(vector, result));
            }
            catch (error) {
                this.error('Error encrypting message: ', error);
                throw error;
            }
        });
    }
    // Helper function for encryption of content
    encryptMessageContent(contentToBeEncrypted) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = new TextEncoder().encode(ejson_1.default.stringify(contentToBeEncrypted));
            return {
                algorithm: 'rc.v1.aes-sha2',
                ciphertext: yield this.encryptText(data),
            };
        });
    }
    // Helper function for encryption of content
    encryptMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { msg, attachments } = message, rest = __rest(message, ["msg", "attachments"]);
            const content = yield this.encryptMessageContent({ msg, attachments });
            return Object.assign(Object.assign({}, rest), { content, t: 'e2e', e2e: 'pending' });
        });
    }
    // Helper function for encryption of messages
    encrypt(message) {
        if (!this.isSupportedRoomType(this.typeOfRoom)) {
            return;
        }
        if (!this.groupSessionKey) {
            throw new Error((0, i18n_1.t)('E2E_Invalid_Key'));
        }
        const ts = new Date();
        const data = new TextEncoder().encode(ejson_1.default.stringify({
            _id: message._id,
            text: message.msg,
            userId: this.userId,
            ts,
        }));
        return this.encryptText(data);
    }
    decryptContent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.content && data.content.algorithm === 'rc.v1.aes-sha2') {
                const content = yield this.decrypt(data.content.ciphertext);
                Object.assign(data, content);
            }
            return data;
        });
    }
    // Decrypt messages
    decryptMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.t !== 'e2e' || message.e2e === 'done') {
                return message;
            }
            if (message.msg) {
                const data = yield this.decrypt(message.msg);
                if (data === null || data === void 0 ? void 0 : data.text) {
                    message.msg = data.text;
                }
            }
            message = yield this.decryptContent(message);
            return Object.assign(Object.assign({}, message), { e2e: 'done' });
        });
    }
    doDecrypt(vector, key, cipherText) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, helper_1.decryptAES)(vector, key, cipherText);
            return ejson_1.default.parse(new TextDecoder('UTF-8').decode(new Uint8Array(result)));
        });
    }
    decrypt(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _b;
            const keyID = message.slice(0, 12);
            message = message.slice(12);
            const [vector, cipherText] = (0, helper_1.splitVectorAndEcryptedData)(base64_1.Base64.decode(message));
            let oldKey = '';
            if (keyID !== this.keyID) {
                const oldRoomKey = (_b = this.oldKeys) === null || _b === void 0 ? void 0 : _b.find((key) => key.e2eKeyId === keyID);
                // Messages already contain a keyID stored with them
                // That means that if we cannot find a keyID for the key the message has preppended to
                // The message is indecipherable.
                // In these cases, we'll give a last shot using the current session key, which may not work
                // but will be enough to help with some mobile issues.
                if (!oldRoomKey) {
                    try {
                        return yield this.doDecrypt(vector, this.groupSessionKey, cipherText);
                    }
                    catch (error) {
                        this.error('Error decrypting message: ', error, message);
                        return { msg: (0, i18n_1.t)('E2E_indecipherable') };
                    }
                }
                oldKey = oldRoomKey.E2EKey;
            }
            try {
                return yield this.doDecrypt(vector, oldKey || this.groupSessionKey, cipherText);
            }
            catch (error) {
                this.error('Error decrypting message: ', error, message);
                return { msg: (0, i18n_1.t)('E2E_Key_Error') };
            }
        });
    }
    provideKeyToUser(keyId) {
        if (this.keyID !== keyId) {
            return;
        }
        void this.encryptKeyForOtherParticipants();
        this.setState(E2ERoomState_1.E2ERoomState.READY);
    }
    onStateChange(cb) {
        this.on('STATE_CHANGED', cb);
        return () => this.off('STATE_CHANGED', cb);
    }
    encryptGroupKeyForParticipantsWaitingForTheKeys(users) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isReady()) {
                return;
            }
            const mySub = client_1.Subscriptions.findOne({ rid: this.roomId });
            const decryptedOldGroupKeys = yield this.exportOldRoomKeys(mySub === null || mySub === void 0 ? void 0 : mySub.oldRoomKeys);
            const usersWithKeys = yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                const { _id, public_key } = user;
                const key = yield this.encryptGroupKeyForParticipant(public_key);
                const oldKeys = yield this.encryptOldKeysForParticipant(public_key, decryptedOldGroupKeys);
                return Object.assign({ _id, key }, (oldKeys && { oldKeys }));
            })));
            return usersWithKeys;
        });
    }
}
exports.E2ERoom = E2ERoom;
_a = PAUSED;
