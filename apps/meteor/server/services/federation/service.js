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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationService = exports.AbstractFederationService = void 0;
const node_http_1 = require("node:http");
const node_url_1 = require("node:url");
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const Factory_1 = require("./infrastructure/Factory");
const logger_1 = require("./infrastructure/rocket-chat/adapters/logger");
const RoomSender_1 = require("./infrastructure/rocket-chat/converters/RoomSender");
const hooks_1 = require("./infrastructure/rocket-chat/hooks");
require("./infrastructure/rocket-chat/well-known");
const utils_1 = require("./utils");
function extractError(e) {
    if (e instanceof Error || (typeof e === 'object' && e && 'toString' in e)) {
        if ('name' in e && e.name === 'AbortError') {
            return 'Operation timed out';
        }
        return e.toString();
    }
    logger_1.federationServiceLogger.error(e);
    return 'Unknown error';
}
// for airgapped deployments, use environment variable to override a local instance of federationtester
const federationTesterHost = ((_b = (_a = process.env.FEDERATION_TESTER_HOST) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.replace(/\/$/, '')) || 'https://federationtester.matrix.org';
class AbstractFederationService extends core_services_1.ServiceClassInternal {
    constructor(federationBridge, internalQueueInstance, internalSettingsAdapter) {
        super();
        this.isRunning = false;
        this.PROCESSING_CONCURRENCY = 1;
        this.internalQueueInstance = internalQueueInstance;
        this.internalSettingsAdapter = internalSettingsAdapter;
        this.bridge = federationBridge;
        this.internalFileAdapter = Factory_1.FederationFactory.buildInternalFileAdapter();
        this.internalRoomAdapter = Factory_1.FederationFactory.buildInternalRoomAdapter();
        this.internalUserAdapter = Factory_1.FederationFactory.buildInternalUserAdapter();
        this.internalMessageAdapter = Factory_1.FederationFactory.buildInternalMessageAdapter();
        this.internalNotificationAdapter = Factory_1.FederationFactory.buildInternalNotificationAdapter();
        this.internalRoomServiceSender = Factory_1.FederationFactory.buildRoomServiceSender(this.internalRoomAdapter, this.internalUserAdapter, this.internalFileAdapter, this.internalMessageAdapter, this.internalSettingsAdapter, this.internalNotificationAdapter, this.bridge);
        this.internalUserServiceSender = Factory_1.FederationFactory.buildUserServiceSender(this.internalRoomAdapter, this.internalUserAdapter, this.internalFileAdapter, this.internalSettingsAdapter, this.bridge);
        this.setEventListeners();
    }
    setEventListeners() {
        this.onEvent('user.avatarUpdate', (_a) => __awaiter(this, [_a], void 0, function* ({ username }) {
            if (!this.isFederationEnabled()) {
                return;
            }
            if (!username) {
                return;
            }
            yield this.internalUserServiceSender.afterUserAvatarChanged(username);
        }));
        this.onEvent('user.typing', (_a) => __awaiter(this, [_a], void 0, function* ({ isTyping, roomId, user: { username } }) {
            if (!roomId || !username) {
                return;
            }
            yield this.internalUserServiceSender.onUserTyping(username, roomId, isTyping);
        }));
        this.onEvent('user.realNameChanged', (_a) => __awaiter(this, [_a], void 0, function* ({ _id, name }) {
            if (!this.isFederationEnabled()) {
                return;
            }
            if (!name || !_id) {
                return;
            }
            yield this.internalUserServiceSender.afterUserRealNameChanged(_id, name);
        }));
        this.onEvent('federation.userRoleChanged', (data) => __awaiter(this, void 0, void 0, function* () { return hooks_1.FederationHooks.afterRoomRoleChanged(this.internalRoomServiceSender, data); }));
    }
    onFederationEnabledSettingChange(isFederationEnabled) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning) {
                return;
            }
            if (isFederationEnabled) {
                yield this.onDisableFederation();
                yield this.onEnableFederation();
                yield this.verifyConfiguration();
                return;
            }
            return this.onDisableFederation();
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.internalSettingsAdapter = Factory_1.FederationFactory.buildInternalSettingsAdapter();
            yield this.internalSettingsAdapter.initialize();
            this.cancelSettingsObserver = this.internalSettingsAdapter.onFederationEnabledStatusChanged(this.onFederationEnabledSettingChange.bind(this));
        });
    }
    noop() {
        return __awaiter(this, void 0, void 0, function* () {
            // noop
        });
    }
    setupEventHandlersForExternalEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            const federationRoomServiceReceiver = Factory_1.FederationFactory.buildRoomServiceReceiver(this.internalRoomAdapter, this.internalUserAdapter, this.internalMessageAdapter, this.internalFileAdapter, this.internalSettingsAdapter, this.internalNotificationAdapter, this.internalQueueInstance, this.bridge);
            const federationMessageServiceReceiver = Factory_1.FederationFactory.buildMessageServiceReceiver(this.internalRoomAdapter, this.internalUserAdapter, this.internalMessageAdapter, this.internalFileAdapter, this.internalSettingsAdapter, this.bridge);
            const federationUserServiceReceiver = Factory_1.FederationFactory.buildUserServiceReceiver(this.internalRoomAdapter, this.internalUserAdapter, this.internalFileAdapter, this.internalNotificationAdapter, this.internalSettingsAdapter, this.bridge);
            const federationEventsHandler = Factory_1.FederationFactory.buildFederationEventHandler(federationRoomServiceReceiver, federationMessageServiceReceiver, federationUserServiceReceiver, this.internalSettingsAdapter);
            this.internalQueueInstance.setHandler(federationEventsHandler.handleEvent.bind(federationEventsHandler), this.PROCESSING_CONCURRENCY);
        });
    }
    canOtherHomeserversFederate() {
        const url = new node_url_1.URL(`https://${this.internalSettingsAdapter.getHomeServerDomain()}`);
        return new Promise((resolve, reject) => (0, server_fetch_1.serverFetch)(`${federationTesterHost}/api/federation-ok?server_name=${url.host}`)
            .then((response) => response.text())
            .then((text) => resolve(text === 'GOOD'))
            .catch(reject));
    }
    getInternalSettingsAdapter() {
        return this.internalSettingsAdapter;
    }
    getInternalRoomServiceSender() {
        return this.internalRoomServiceSender;
    }
    getInternalUserServiceSender() {
        return this.internalUserServiceSender;
    }
    getInternalRoomAdapter() {
        return this.internalRoomAdapter;
    }
    getInternalUserAdapter() {
        return this.internalUserAdapter;
    }
    getInternalMessageAdapter() {
        return this.internalMessageAdapter;
    }
    getInternalNotificationAdapter() {
        return this.internalNotificationAdapter;
    }
    getInternalFileAdapter() {
        return this.internalFileAdapter;
    }
    isFederationEnabled() {
        return this.internalSettingsAdapter.isFederationEnabled();
    }
    setupFederation() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isFederationEnabled()) {
                yield this.setupEventHandlersForExternalEvents();
                yield this.setupInternalValidators();
                yield this.setupInternalActionListeners();
                yield this.setupInternalEphemeralListeners();
            }
            this.isRunning = true;
        });
    }
    cleanUpSettingObserver() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cancelSettingsObserver();
            this.isRunning = false;
        });
    }
    cleanUpHandlers() {
        return __awaiter(this, void 0, void 0, function* () {
            this.internalQueueInstance.setHandler(this.noop.bind(this), this.PROCESSING_CONCURRENCY);
        });
    }
    verifyMatrixIds(matrixIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bridge.verifyInviteeIds(matrixIds);
        });
    }
    configurationStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const status = {
                appservice: {
                    roundTrip: { durationMs: -1 },
                    ok: false,
                },
                externalReachability: {
                    ok: false,
                },
            };
            try {
                const pingResponse = yield this.bridge.ping();
                status.appservice.roundTrip.durationMs = pingResponse.durationMs;
                status.appservice.ok = true;
            }
            catch (error) {
                if (error instanceof node_http_1.IncomingMessage) {
                    if (error.statusCode === 404) {
                        status.appservice.error = 'homeserver version must be >=1.84.x';
                    }
                    else {
                        status.appservice.error = `received unknown status from homeserver, message: ${error.statusMessage}`;
                    }
                }
                else {
                    status.appservice.error = extractError(error);
                }
            }
            try {
                status.externalReachability.ok = yield this.canOtherHomeserversFederate();
            }
            catch (error) {
                status.externalReachability.error = extractError(error);
            }
            return status;
        });
    }
    markConfigurationValid() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.internalSettingsAdapter.setConfigurationStatus('Valid');
        });
    }
    markConfigurationInvalid() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.internalSettingsAdapter.setConfigurationStatus('Invalid');
        });
    }
    verifyConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                yield ((_a = this.bridge) === null || _a === void 0 ? void 0 : _a.ping()); // throws error if fails
                if (!(yield this.canOtherHomeserversFederate())) {
                    throw new Error('External reachability could not be verified');
                }
                void this.markConfigurationValid();
            }
            catch (error) {
                logger_1.federationServiceLogger.error(error);
                void this.markConfigurationInvalid();
            }
        });
    }
    beforeCreateRoom(room) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, core_typings_1.isRoomFederated)(room)) {
                return;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
        });
    }
    deactivateRemoteUser(remoteUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bridge.deactivateUser(remoteUserId);
        });
    }
}
exports.AbstractFederationService = AbstractFederationService;
class AbstractBaseFederationService extends AbstractFederationService {
    constructor() {
        const internalQueueInstance = Factory_1.FederationFactory.buildFederationQueue();
        const internalSettingsAdapter = Factory_1.FederationFactory.buildInternalSettingsAdapter();
        const bridge = Factory_1.FederationFactory.buildFederationBridge(internalSettingsAdapter, internalQueueInstance);
        super(bridge, internalQueueInstance, internalSettingsAdapter);
    }
    setupInternalEphemeralListeners() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getInternalNotificationAdapter().subscribeToUserTypingEventsOnFederatedRooms(this.getInternalNotificationAdapter().broadcastUserTypingOnRoom.bind(this.getInternalNotificationAdapter()));
        });
    }
    setupInternalValidators() {
        return __awaiter(this, void 0, void 0, function* () {
            const federationRoomInternalValidator = Factory_1.FederationFactory.buildRoomInternalValidator(this.getInternalRoomAdapter(), this.getInternalUserAdapter(), this.getInternalFileAdapter(), this.getInternalSettingsAdapter(), this.bridge);
            Factory_1.FederationFactory.setupValidators(federationRoomInternalValidator);
        });
    }
    setupInternalActionListeners() {
        return __awaiter(this, void 0, void 0, function* () {
            const federationMessageServiceSender = Factory_1.FederationFactory.buildMessageServiceSender(this.getInternalRoomAdapter(), this.getInternalUserAdapter(), this.getInternalSettingsAdapter(), this.getInternalMessageAdapter(), this.bridge);
            Factory_1.FederationFactory.setupListenersForLocalActions(this.getInternalRoomServiceSender(), federationMessageServiceSender);
        });
    }
    onEnableFederation() {
        const _super = Object.create(null, {
            setupFederation: { get: () => super.setupFederation }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.setupFederation.call(this);
            yield this.startFederation();
        });
    }
    onDisableFederation() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stopFederation();
        });
    }
    startFederation() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isFederationEnabled()) {
                return;
            }
            yield this.bridge.start();
            this.bridge.logFederationStartupInfo('Running Federation V2');
            yield Promise.resolve().then(() => __importStar(require('./infrastructure/rocket-chat/slash-commands')));
        });
    }
    stopFederation() {
        const _super = Object.create(null, {
            cleanUpHandlers: { get: () => super.cleanUpHandlers }
        });
        return __awaiter(this, void 0, void 0, function* () {
            Factory_1.FederationFactory.removeAllListeners();
            yield this.bridge.stop();
            yield _super.cleanUpHandlers.call(this);
        });
    }
    stopped() {
        const _super = Object.create(null, {
            cleanUpSettingObserver: { get: () => super.cleanUpSettingObserver }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stopFederation();
            yield _super.cleanUpSettingObserver.call(this);
        });
    }
    started() {
        const _super = Object.create(null, {
            setupFederation: { get: () => super.setupFederation }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.setupFederation.call(this);
            yield this.startFederation();
        });
    }
}
class FederationService extends AbstractBaseFederationService {
    constructor() {
        super(...arguments);
        this.name = 'federation';
    }
    createDirectMessageRoomAndInviteUser(internalInviterId, internalRoomId, externalInviteeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getInternalRoomServiceSender().createDirectMessageRoomAndInviteUser(RoomSender_1.FederationRoomSenderConverter.toCreateDirectMessageRoomDto(internalInviterId, internalRoomId, externalInviteeId));
        });
    }
    verifyMatrixIds(matrixIds) {
        const _super = Object.create(null, {
            verifyMatrixIds: { get: () => super.verifyMatrixIds }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.verifyMatrixIds.call(this, matrixIds);
        });
    }
    static createFederationService() {
        return __awaiter(this, void 0, void 0, function* () {
            const federationService = new FederationService();
            yield federationService.initialize();
            return federationService;
        });
    }
    stopped() {
        const _super = Object.create(null, {
            stopped: { get: () => super.stopped }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.stopped.call(this);
        });
    }
    started() {
        const _super = Object.create(null, {
            started: { get: () => super.started }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.started.call(this);
        });
    }
    verifyConfiguration() {
        const _super = Object.create(null, {
            verifyConfiguration: { get: () => super.verifyConfiguration }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.verifyConfiguration.call(this);
        });
    }
    markConfigurationValid() {
        const _super = Object.create(null, {
            markConfigurationValid: { get: () => super.markConfigurationValid }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.markConfigurationValid.call(this);
        });
    }
    markConfigurationInvalid() {
        const _super = Object.create(null, {
            markConfigurationInvalid: { get: () => super.markConfigurationInvalid }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.markConfigurationInvalid.call(this);
        });
    }
    configurationStatus() {
        const _super = Object.create(null, {
            configurationStatus: { get: () => super.configurationStatus }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.configurationStatus.call(this);
        });
    }
    beforeCreateRoom(room) {
        const _super = Object.create(null, {
            beforeCreateRoom: { get: () => super.beforeCreateRoom }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.beforeCreateRoom.call(this, room);
        });
    }
    deactivateRemoteUser(userId) {
        const _super = Object.create(null, {
            deactivateRemoteUser: { get: () => super.deactivateRemoteUser }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.deactivateRemoteUser.call(this, userId);
        });
    }
}
exports.FederationService = FederationService;
