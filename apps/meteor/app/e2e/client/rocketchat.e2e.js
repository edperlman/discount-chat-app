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
exports.e2e = void 0;
const querystring_1 = __importDefault(require("querystring"));
const url_1 = __importDefault(require("url"));
const core_typings_1 = require("@rocket.chat/core-typings");
const emitter_1 = require("@rocket.chat/emitter");
const ejson_1 = __importDefault(require("ejson"));
const lodash_1 = __importDefault(require("lodash"));
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const E2EEState_1 = require("./E2EEState");
const helper_1 = require("./helper");
const logger_1 = require("./logger");
const rocketchat_e2e_room_1 = require("./rocketchat.e2e.room");
const banners = __importStar(require("../../../client/lib/banners"));
const imperativeModal_1 = require("../../../client/lib/imperativeModal");
const toast_1 = require("../../../client/lib/toast");
const mapMessageFromApi_1 = require("../../../client/lib/utils/mapMessageFromApi");
const waitUntilFind_1 = require("../../../client/lib/utils/waitUntilFind");
const EnterE2EPasswordModal_1 = __importDefault(require("../../../client/views/e2e/EnterE2EPasswordModal"));
const SaveE2EPasswordModal_1 = __importDefault(require("../../../client/views/e2e/SaveE2EPasswordModal"));
const createQuoteAttachment_1 = require("../../../lib/createQuoteAttachment");
const getMessageUrlRegex_1 = require("../../../lib/getMessageUrlRegex");
const isTruthy_1 = require("../../../lib/isTruthy");
const client_1 = require("../../models/client");
const client_2 = require("../../settings/client");
const client_3 = require("../../utils/client");
const SDKClient_1 = require("../../utils/client/lib/SDKClient");
const i18n_1 = require("../../utils/lib/i18n");
require("./events");
let failedToDecodeKey = false;
const ROOM_KEY_EXCHANGE_SIZE = 10;
const E2EEStateDependency = new tracker_1.Tracker.Dependency();
class E2E extends emitter_1.Emitter {
    constructor() {
        super();
        this.started = false;
        this.instancesByRoomId = {};
        this.keyDistributionInterval = null;
        this.observable = undefined;
        this.on('E2E_STATE_CHANGED', ({ prevState, nextState }) => {
            this.log(`${prevState} -> ${nextState}`);
        });
        this.on(E2EEState_1.E2EEState.READY, () => __awaiter(this, void 0, void 0, function* () {
            yield this.onE2EEReady();
        }));
        this.on(E2EEState_1.E2EEState.SAVE_PASSWORD, () => __awaiter(this, void 0, void 0, function* () {
            yield this.onE2EEReady();
        }));
        this.on(E2EEState_1.E2EEState.DISABLED, () => {
            var _a;
            (_a = this.observable) === null || _a === void 0 ? void 0 : _a.stop();
        });
        this.on(E2EEState_1.E2EEState.NOT_STARTED, () => {
            var _a;
            (_a = this.observable) === null || _a === void 0 ? void 0 : _a.stop();
        });
        this.on(E2EEState_1.E2EEState.ERROR, () => {
            var _a;
            (_a = this.observable) === null || _a === void 0 ? void 0 : _a.stop();
        });
        this.setState(E2EEState_1.E2EEState.NOT_STARTED);
    }
    log(...msg) {
        (0, logger_1.log)('E2E', ...msg);
    }
    error(...msg) {
        (0, logger_1.logError)('E2E', ...msg);
    }
    getState() {
        return this.state;
    }
    isEnabled() {
        return this.state !== E2EEState_1.E2EEState.DISABLED;
    }
    isReady() {
        E2EEStateDependency.depend();
        // Save_Password state is also a ready state for E2EE
        return this.state === E2EEState_1.E2EEState.READY || this.state === E2EEState_1.E2EEState.SAVE_PASSWORD;
    }
    onE2EEReady() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('startClient -> Done');
            this.initiateHandshake();
            yield this.handleAsyncE2EESuggestedKey();
            this.log('decryptSubscriptions');
            yield this.decryptSubscriptions();
            this.log('decryptSubscriptions -> Done');
            yield this.initiateKeyDistribution();
            this.log('initiateKeyDistribution -> Done');
            this.observeSubscriptions();
            this.log('observing subscriptions');
        });
    }
    onSubscriptionChanged(sub) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Subscription changed', sub);
            if (!sub.encrypted && !sub.E2EKey) {
                this.removeInstanceByRoomId(sub.rid);
                return;
            }
            const e2eRoom = yield this.getInstanceByRoomId(sub.rid);
            if (!e2eRoom) {
                return;
            }
            if (sub.E2ESuggestedKey) {
                if (yield e2eRoom.importGroupKey(sub.E2ESuggestedKey)) {
                    yield this.acceptSuggestedKey(sub.rid);
                    e2eRoom.keyReceived();
                }
                else {
                    console.warn('Invalid E2ESuggestedKey, rejecting', sub.E2ESuggestedKey);
                    yield this.rejectSuggestedKey(sub.rid);
                }
            }
            sub.encrypted ? e2eRoom.resume() : e2eRoom.pause();
            // Cover private groups and direct messages
            if (!e2eRoom.isSupportedRoomType(sub.t)) {
                e2eRoom.disable();
                return;
            }
            if (sub.E2EKey && e2eRoom.isWaitingKeys()) {
                e2eRoom.keyReceived();
                return;
            }
            if (!e2eRoom.isReady()) {
                return;
            }
            yield e2eRoom.decryptSubscription();
        });
    }
    observeSubscriptions() {
        var _a;
        (_a = this.observable) === null || _a === void 0 ? void 0 : _a.stop();
        this.observable = client_1.Subscriptions.find().observe({
            changed: (sub) => {
                setTimeout(() => this.onSubscriptionChanged(sub), 0);
            },
            added: (sub) => {
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    this.log('Subscription added', sub);
                    if (!sub.encrypted && !sub.E2EKey) {
                        return;
                    }
                    return this.getInstanceByRoomId(sub.rid);
                }), 0);
            },
            removed: (sub) => {
                this.log('Subscription removed', sub);
                this.removeInstanceByRoomId(sub.rid);
            },
        });
    }
    shouldAskForE2EEPassword() {
        const { private_key } = this.getKeysFromLocalStorage();
        return this.db_private_key && !private_key;
    }
    setState(nextState) {
        const prevState = this.state;
        this.state = nextState;
        E2EEStateDependency.changed();
        this.emit('E2E_STATE_CHANGED', { prevState, nextState });
        this.emit(nextState);
    }
    handleAsyncE2EESuggestedKey() {
        return __awaiter(this, void 0, void 0, function* () {
            const subs = client_1.Subscriptions.find({ E2ESuggestedKey: { $exists: true } }).fetch();
            yield Promise.all(subs
                .filter((sub) => sub.E2ESuggestedKey && !sub.E2EKey)
                .map((sub) => __awaiter(this, void 0, void 0, function* () {
                const e2eRoom = yield exports.e2e.getInstanceByRoomId(sub.rid);
                if (!e2eRoom) {
                    return;
                }
                if (yield e2eRoom.importGroupKey(sub.E2ESuggestedKey)) {
                    this.log('Imported valid E2E suggested key');
                    yield exports.e2e.acceptSuggestedKey(sub.rid);
                    e2eRoom.keyReceived();
                }
                else {
                    this.error('Invalid E2ESuggestedKey, rejecting', sub.E2ESuggestedKey);
                    yield exports.e2e.rejectSuggestedKey(sub.rid);
                }
                sub.encrypted ? e2eRoom.resume() : e2eRoom.pause();
            })));
        });
    }
    getInstanceByRoomId(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield (0, waitUntilFind_1.waitUntilFind)(() => client_1.Rooms.findOne({ _id: rid }));
            if (room.t !== 'd' && room.t !== 'p') {
                return null;
            }
            if (!room.encrypted) {
                return null;
            }
            if (!this.instancesByRoomId[rid]) {
                this.instancesByRoomId[rid] = new rocketchat_e2e_room_1.E2ERoom(meteor_1.Meteor.userId(), room);
            }
            // When the key was already set and is changed via an update, we update the room instance
            if (this.instancesByRoomId[rid].keyID !== undefined &&
                room.e2eKeyId !== undefined &&
                this.instancesByRoomId[rid].keyID !== room.e2eKeyId) {
                // KeyID was changed, update instance with new keyID and put room in waiting keys status
                this.instancesByRoomId[rid].onRoomKeyReset(room.e2eKeyId);
            }
            return this.instancesByRoomId[rid];
        });
    }
    removeInstanceByRoomId(rid) {
        delete this.instancesByRoomId[rid];
    }
    persistKeys(_a, password_1) {
        return __awaiter(this, arguments, void 0, function* ({ public_key, private_key }, password, { force } = { force: false }) {
            if (typeof public_key !== 'string' || typeof private_key !== 'string') {
                throw new Error('Failed to persist keys as they are not strings.');
            }
            const encodedPrivateKey = yield this.encodePrivateKey(private_key, password);
            if (!encodedPrivateKey) {
                throw new Error('Failed to encode private key with provided password.');
            }
            yield SDKClient_1.sdk.rest.post('/v1/e2e.setUserPublicAndPrivateKeys', {
                public_key,
                private_key: encodedPrivateKey,
                force,
            });
        });
    }
    acceptSuggestedKey(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield SDKClient_1.sdk.rest.post('/v1/e2e.acceptSuggestedGroupKey', {
                rid,
            });
        });
    }
    rejectSuggestedKey(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield SDKClient_1.sdk.rest.post('/v1/e2e.rejectSuggestedGroupKey', {
                rid,
            });
        });
    }
    getKeysFromLocalStorage() {
        return {
            public_key: accounts_base_1.Accounts.storageLocation.getItem('public_key'),
            private_key: accounts_base_1.Accounts.storageLocation.getItem('private_key'),
        };
    }
    initiateHandshake() {
        Object.keys(this.instancesByRoomId).map((key) => this.instancesByRoomId[key].handshake());
    }
    openSaveE2EEPasswordModal(randomPassword) {
        imperativeModal_1.imperativeModal.open({
            component: SaveE2EPasswordModal_1.default,
            props: {
                randomPassword,
                onClose: imperativeModal_1.imperativeModal.close,
                onCancel: () => {
                    this.closeAlert();
                    imperativeModal_1.imperativeModal.close();
                },
                onConfirm: () => {
                    accounts_base_1.Accounts.storageLocation.removeItem('e2e.randomPassword');
                    this.setState(E2EEState_1.E2EEState.READY);
                    (0, toast_1.dispatchToastMessage)({ type: 'success', message: (0, i18n_1.t)('End_To_End_Encryption_Enabled') });
                    this.closeAlert();
                    imperativeModal_1.imperativeModal.close();
                },
            },
        });
    }
    startClient() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.started) {
                return;
            }
            this.log('startClient -> STARTED');
            this.started = true;
            let { public_key, private_key } = this.getKeysFromLocalStorage();
            yield this.loadKeysFromDB();
            if (!public_key && this.db_public_key) {
                public_key = this.db_public_key;
            }
            if (this.shouldAskForE2EEPassword()) {
                try {
                    this.setState(E2EEState_1.E2EEState.ENTER_PASSWORD);
                    private_key = yield this.decodePrivateKey(this.db_private_key);
                }
                catch (error) {
                    this.started = false;
                    failedToDecodeKey = true;
                    this.openAlert({
                        title: "Wasn't possible to decode your encryption key to be imported.", // TODO: missing translation
                        html: '<div>Your encryption password seems wrong. Click here to try again.</div>', // TODO: missing translation
                        modifiers: ['large', 'danger'],
                        closable: true,
                        icon: 'key',
                        action: () => __awaiter(this, void 0, void 0, function* () {
                            yield this.startClient();
                            this.closeAlert();
                        }),
                    });
                    return;
                }
            }
            if (public_key && private_key) {
                yield this.loadKeys({ public_key, private_key });
                this.setState(E2EEState_1.E2EEState.READY);
            }
            else {
                yield this.createAndLoadKeys();
                this.setState(E2EEState_1.E2EEState.READY);
            }
            if (!this.db_public_key || !this.db_private_key) {
                this.setState(E2EEState_1.E2EEState.LOADING_KEYS);
                yield this.persistKeys(this.getKeysFromLocalStorage(), yield this.createRandomPassword());
            }
            const randomPassword = accounts_base_1.Accounts.storageLocation.getItem('e2e.randomPassword');
            if (randomPassword) {
                this.setState(E2EEState_1.E2EEState.SAVE_PASSWORD);
                this.openAlert({
                    title: () => (0, i18n_1.t)('Save_your_encryption_password'),
                    html: () => (0, i18n_1.t)('Click_here_to_view_and_copy_your_password'),
                    modifiers: ['large'],
                    closable: false,
                    icon: 'key',
                    action: () => this.openSaveE2EEPasswordModal(randomPassword),
                });
            }
        });
    }
    stopClient() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('-> Stop Client');
            this.closeAlert();
            accounts_base_1.Accounts.storageLocation.removeItem('public_key');
            accounts_base_1.Accounts.storageLocation.removeItem('private_key');
            this.instancesByRoomId = {};
            this.privateKey = undefined;
            this.publicKey = undefined;
            this.started = false;
            this.keyDistributionInterval && clearInterval(this.keyDistributionInterval);
            this.keyDistributionInterval = null;
            this.setState(E2EEState_1.E2EEState.DISABLED);
        });
    }
    changePassword(newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.persistKeys(this.getKeysFromLocalStorage(), newPassword, { force: true });
            if (accounts_base_1.Accounts.storageLocation.getItem('e2e.randomPassword')) {
                accounts_base_1.Accounts.storageLocation.setItem('e2e.randomPassword', newPassword);
            }
        });
    }
    loadKeysFromDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setState(E2EEState_1.E2EEState.LOADING_KEYS);
                const { public_key, private_key } = yield SDKClient_1.sdk.rest.get('/v1/e2e.fetchMyKeys');
                this.db_public_key = public_key;
                this.db_private_key = private_key;
            }
            catch (error) {
                this.setState(E2EEState_1.E2EEState.ERROR);
                this.error('Error fetching RSA keys: ', error);
                // Stop any process since we can't communicate with the server
                // to get the keys. This prevents new key generation
                throw error;
            }
        });
    }
    loadKeys(_a) {
        return __awaiter(this, arguments, void 0, function* ({ public_key, private_key }) {
            accounts_base_1.Accounts.storageLocation.setItem('public_key', public_key);
            this.publicKey = public_key;
            try {
                this.privateKey = yield (0, helper_1.importRSAKey)(ejson_1.default.parse(private_key), ['decrypt']);
                accounts_base_1.Accounts.storageLocation.setItem('private_key', private_key);
            }
            catch (error) {
                this.setState(E2EEState_1.E2EEState.ERROR);
                return this.error('Error importing private key: ', error);
            }
        });
    }
    createAndLoadKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            // Could not obtain public-private keypair from server.
            this.setState(E2EEState_1.E2EEState.LOADING_KEYS);
            let key;
            try {
                key = yield (0, helper_1.generateRSAKey)();
                this.privateKey = key.privateKey;
            }
            catch (error) {
                this.setState(E2EEState_1.E2EEState.ERROR);
                return this.error('Error generating key: ', error);
            }
            try {
                const publicKey = yield (0, helper_1.exportJWKKey)(key.publicKey);
                this.publicKey = JSON.stringify(publicKey);
                accounts_base_1.Accounts.storageLocation.setItem('public_key', JSON.stringify(publicKey));
            }
            catch (error) {
                this.setState(E2EEState_1.E2EEState.ERROR);
                return this.error('Error exporting public key: ', error);
            }
            try {
                const privateKey = yield (0, helper_1.exportJWKKey)(key.privateKey);
                accounts_base_1.Accounts.storageLocation.setItem('private_key', JSON.stringify(privateKey));
            }
            catch (error) {
                this.setState(E2EEState_1.E2EEState.ERROR);
                return this.error('Error exporting private key: ', error);
            }
            yield this.requestSubscriptionKeys();
        });
    }
    requestSubscriptionKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            yield SDKClient_1.sdk.call('e2e.requestSubscriptionKeys');
        });
    }
    createRandomPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            const randomPassword = yield (0, helper_1.generateMnemonicPhrase)(5);
            accounts_base_1.Accounts.storageLocation.setItem('e2e.randomPassword', randomPassword);
            return randomPassword;
        });
    }
    encodePrivateKey(privateKey, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const masterKey = yield this.getMasterKey(password);
            const vector = crypto.getRandomValues(new Uint8Array(16));
            try {
                const encodedPrivateKey = yield (0, helper_1.encryptAES)(vector, masterKey, (0, helper_1.toArrayBuffer)(privateKey));
                return ejson_1.default.stringify((0, helper_1.joinVectorAndEcryptedData)(vector, encodedPrivateKey));
            }
            catch (error) {
                this.setState(E2EEState_1.E2EEState.ERROR);
                return this.error('Error encrypting encodedPrivateKey: ', error);
            }
        });
    }
    getMasterKey(password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (password == null) {
                alert('You should provide a password');
            }
            // First, create a PBKDF2 "key" containing the password
            let baseKey;
            try {
                baseKey = yield (0, helper_1.importRawKey)((0, helper_1.toArrayBuffer)(password));
            }
            catch (error) {
                this.setState(E2EEState_1.E2EEState.ERROR);
                return this.error('Error creating a key based on user password: ', error);
            }
            // Derive a key from the password
            try {
                return yield (0, helper_1.deriveKey)((0, helper_1.toArrayBuffer)(meteor_1.Meteor.userId()), baseKey);
            }
            catch (error) {
                this.setState(E2EEState_1.E2EEState.ERROR);
                return this.error('Error deriving baseKey: ', error);
            }
        });
    }
    openEnterE2EEPasswordModal(onEnterE2EEPassword) {
        imperativeModal_1.imperativeModal.open({
            component: EnterE2EPasswordModal_1.default,
            props: {
                onClose: imperativeModal_1.imperativeModal.close,
                onCancel: () => {
                    failedToDecodeKey = false;
                    (0, toast_1.dispatchToastMessage)({ type: 'info', message: (0, i18n_1.t)('End_To_End_Encryption_Not_Enabled') });
                    this.closeAlert();
                    imperativeModal_1.imperativeModal.close();
                },
                onConfirm: (password) => {
                    onEnterE2EEPassword === null || onEnterE2EEPassword === void 0 ? void 0 : onEnterE2EEPassword(password);
                    this.closeAlert();
                    imperativeModal_1.imperativeModal.close();
                },
            },
        });
    }
    requestPasswordAlert() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const showModal = () => this.openEnterE2EEPasswordModal((password) => resolve(password));
                const showAlert = () => {
                    this.openAlert({
                        title: () => (0, i18n_1.t)('Enter_your_E2E_password'),
                        html: () => (0, i18n_1.t)('Click_here_to_enter_your_encryption_password'),
                        modifiers: ['large'],
                        closable: false,
                        icon: 'key',
                        action() {
                            showModal();
                        },
                    });
                };
                if (failedToDecodeKey) {
                    showModal();
                }
                else {
                    showAlert();
                }
            });
        });
    }
    requestPasswordModal() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => this.openEnterE2EEPasswordModal((password) => resolve(password)));
        });
    }
    decodePrivateKeyFlow() {
        return __awaiter(this, void 0, void 0, function* () {
            const password = yield this.requestPasswordModal();
            const masterKey = yield this.getMasterKey(password);
            if (!this.db_private_key) {
                return;
            }
            const [vector, cipherText] = (0, helper_1.splitVectorAndEcryptedData)(ejson_1.default.parse(this.db_private_key));
            try {
                const privKey = yield (0, helper_1.decryptAES)(vector, masterKey, cipherText);
                const privateKey = (0, helper_1.toString)(privKey);
                if (this.db_public_key && privateKey) {
                    yield this.loadKeys({ public_key: this.db_public_key, private_key: privateKey });
                    this.setState(E2EEState_1.E2EEState.READY);
                }
                else {
                    yield this.createAndLoadKeys();
                    this.setState(E2EEState_1.E2EEState.READY);
                }
                (0, toast_1.dispatchToastMessage)({ type: 'success', message: (0, i18n_1.t)('End_To_End_Encryption_Enabled') });
            }
            catch (error) {
                this.setState(E2EEState_1.E2EEState.ENTER_PASSWORD);
                (0, toast_1.dispatchToastMessage)({ type: 'error', message: (0, i18n_1.t)('Your_E2EE_password_is_incorrect') });
                (0, toast_1.dispatchToastMessage)({ type: 'info', message: (0, i18n_1.t)('End_To_End_Encryption_Not_Enabled') });
                throw new Error('E2E -> Error decrypting private key');
            }
        });
    }
    decodePrivateKey(privateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = yield this.requestPasswordAlert();
            const masterKey = yield this.getMasterKey(password);
            const [vector, cipherText] = (0, helper_1.splitVectorAndEcryptedData)(ejson_1.default.parse(privateKey));
            try {
                const privKey = yield (0, helper_1.decryptAES)(vector, masterKey, cipherText);
                return (0, helper_1.toString)(privKey);
            }
            catch (error) {
                this.setState(E2EEState_1.E2EEState.ENTER_PASSWORD);
                (0, toast_1.dispatchToastMessage)({ type: 'error', message: (0, i18n_1.t)('Your_E2EE_password_is_incorrect') });
                (0, toast_1.dispatchToastMessage)({ type: 'info', message: (0, i18n_1.t)('End_To_End_Encryption_Not_Enabled') });
                throw new Error('E2E -> Error decrypting private key');
            }
        });
    }
    decryptFileContent(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file.rid) {
                return file;
            }
            const e2eRoom = yield this.getInstanceByRoomId(file.rid);
            if (!e2eRoom) {
                return file;
            }
            return e2eRoom.decryptContent(file);
        });
    }
    decryptMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, core_typings_1.isE2EEMessage)(message) || message.e2e === 'done') {
                return message;
            }
            const e2eRoom = yield this.getInstanceByRoomId(message.rid);
            if (!e2eRoom) {
                return message;
            }
            const decryptedMessage = yield e2eRoom.decryptMessage(message);
            const decryptedMessageWithQuote = yield this.parseQuoteAttachment(decryptedMessage);
            return decryptedMessageWithQuote;
        });
    }
    decryptPinnedMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const pinnedMessage = (_b = (_a = message === null || message === void 0 ? void 0 : message.attachments) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text;
            if (!pinnedMessage) {
                return message;
            }
            const e2eRoom = yield this.getInstanceByRoomId(message.rid);
            if (!e2eRoom) {
                return message;
            }
            const data = yield e2eRoom.decrypt(pinnedMessage);
            if (!data) {
                return message;
            }
            const decryptedPinnedMessage = Object.assign({}, message);
            decryptedPinnedMessage.attachments[0].text = data.text;
            return decryptedPinnedMessage;
        });
    }
    decryptPendingMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            return client_1.Messages.find({ t: 'e2e', e2e: 'pending' }).forEach((_a) => __awaiter(this, void 0, void 0, function* () {
                var { _id } = _a, msg = __rest(_a, ["_id"]);
                client_1.Messages.update({ _id }, yield this.decryptMessage(msg));
            }));
        });
    }
    decryptSubscription(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const e2eRoom = yield this.getInstanceByRoomId(subscriptionId);
            this.log('decryptSubscription ->', subscriptionId);
            yield (e2eRoom === null || e2eRoom === void 0 ? void 0 : e2eRoom.decryptSubscription());
        });
    }
    decryptSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            client_1.Subscriptions.find({
                encrypted: true,
            }).forEach((subscription) => this.decryptSubscription(subscription._id));
        });
    }
    openAlert(config) {
        banners.open(Object.assign({ id: 'e2e' }, config));
    }
    closeAlert() {
        banners.closeById('e2e');
    }
    parseQuoteAttachment(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(message === null || message === void 0 ? void 0 : message.msg)) {
                return message;
            }
            const urls = message.msg.match((0, getMessageUrlRegex_1.getMessageUrlRegex)()) || [];
            yield Promise.all(urls.map((url) => __awaiter(this, void 0, void 0, function* () {
                if (!url.includes(client_2.settings.get('Site_Url'))) {
                    return;
                }
                const urlObj = url_1.default.parse(url);
                // if the URL doesn't have query params (doesn't reference message) skip
                if (!urlObj.query) {
                    return;
                }
                const { msg: msgId } = querystring_1.default.parse(urlObj.query);
                if (!msgId || Array.isArray(msgId)) {
                    return;
                }
                const getQuotedMessage = yield SDKClient_1.sdk.rest.get('/v1/chat.getMessage', { msgId });
                const quotedMessage = getQuotedMessage === null || getQuotedMessage === void 0 ? void 0 : getQuotedMessage.message;
                if (!quotedMessage) {
                    return;
                }
                const decryptedQuoteMessage = yield this.decryptMessage((0, mapMessageFromApi_1.mapMessageFromApi)(quotedMessage));
                message.attachments = message.attachments || [];
                const useRealName = client_2.settings.get('UI_Use_Real_Name');
                const quoteAttachment = (0, createQuoteAttachment_1.createQuoteAttachment)(decryptedQuoteMessage, url, useRealName, (0, client_3.getUserAvatarURL)(decryptedQuoteMessage.u.username || ''));
                message.attachments.push(quoteAttachment);
            })));
            return message;
        });
    }
    getSuggestedE2EEKeys(usersWaitingForE2EKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomIds = Object.keys(usersWaitingForE2EKeys);
            return Object.fromEntries((yield Promise.all(roomIds.map((room) => __awaiter(this, void 0, void 0, function* () {
                const e2eRoom = yield this.getInstanceByRoomId(room);
                if (!e2eRoom) {
                    return;
                }
                const usersWithKeys = yield e2eRoom.encryptGroupKeyForParticipantsWaitingForTheKeys(usersWaitingForE2EKeys[room]);
                if (!usersWithKeys) {
                    return;
                }
                return [room, usersWithKeys];
            })))).filter(isTruthy_1.isTruthy));
        });
    }
    getSample(roomIds_1) {
        return __awaiter(this, arguments, void 0, function* (roomIds, limit = 3) {
            var _a, e_1, _b, _c;
            if (limit === 0) {
                return [];
            }
            const randomRoomIds = lodash_1.default.sampleSize(roomIds, ROOM_KEY_EXCHANGE_SIZE);
            const sampleIds = [];
            try {
                for (var _d = true, randomRoomIds_1 = __asyncValues(randomRoomIds), randomRoomIds_1_1; randomRoomIds_1_1 = yield randomRoomIds_1.next(), _a = randomRoomIds_1_1.done, !_a; _d = true) {
                    _c = randomRoomIds_1_1.value;
                    _d = false;
                    const roomId = _c;
                    const e2eroom = yield this.getInstanceByRoomId(roomId);
                    if (!(e2eroom === null || e2eroom === void 0 ? void 0 : e2eroom.hasSessionKey())) {
                        continue;
                    }
                    sampleIds.push(roomId);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = randomRoomIds_1.return)) yield _b.call(randomRoomIds_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (!sampleIds.length) {
                return this.getSample(roomIds, limit - 1);
            }
            return sampleIds;
        });
    }
    initiateKeyDistribution() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.keyDistributionInterval) {
                return;
            }
            const keyDistribution = () => __awaiter(this, void 0, void 0, function* () {
                const roomIds = client_1.Rooms.find({
                    'usersWaitingForE2EKeys': { $exists: true },
                    'usersWaitingForE2EKeys.userId': { $ne: meteor_1.Meteor.userId() },
                }).map((room) => room._id);
                if (!roomIds.length) {
                    return;
                }
                // Prevent function from running and doing nothing when theres something to do
                const sampleIds = yield this.getSample(roomIds);
                if (!sampleIds.length) {
                    return;
                }
                const { usersWaitingForE2EKeys = {} } = yield SDKClient_1.sdk.rest.get('/v1/e2e.fetchUsersWaitingForGroupKey', { roomIds: sampleIds });
                if (!Object.keys(usersWaitingForE2EKeys).length) {
                    return;
                }
                const userKeysWithRooms = yield this.getSuggestedE2EEKeys(usersWaitingForE2EKeys);
                if (!Object.keys(userKeysWithRooms).length) {
                    return;
                }
                try {
                    yield SDKClient_1.sdk.rest.post('/v1/e2e.provideUsersSuggestedGroupKeys', { usersSuggestedGroupKeys: userKeysWithRooms });
                }
                catch (error) {
                    return this.error('Error providing group key to users: ', error);
                }
            });
            // Run first call right away, then schedule for 10s in the future
            yield keyDistribution();
            this.keyDistributionInterval = setInterval(keyDistribution, 10000);
        });
    }
}
exports.e2e = new E2E();
