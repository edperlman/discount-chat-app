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
exports.FederationServiceEE = void 0;
const RoomInputDto_1 = require("./application/room/sender/input/RoomInputDto");
const Factory_1 = require("./infrastructure/Factory");
const RoomSender_1 = require("./infrastructure/rocket-chat/converters/RoomSender");
const service_1 = require("../../../../server/services/federation/service");
class AbstractBaseFederationServiceEE extends service_1.AbstractFederationService {
    constructor() {
        const internalQueueInstance = Factory_1.FederationFactoryEE.buildFederationQueue();
        const internalSettingsAdapter = Factory_1.FederationFactoryEE.buildInternalSettingsAdapter();
        const bridgeEE = Factory_1.FederationFactoryEE.buildFederationBridge(internalSettingsAdapter, internalQueueInstance);
        super(bridgeEE, internalQueueInstance, internalSettingsAdapter);
        this.internalRoomAdapterEE = Factory_1.FederationFactoryEE.buildInternalRoomAdapter();
        this.internalUserAdapterEE = Factory_1.FederationFactoryEE.buildInternalUserAdapter();
        this.internalUserServiceEE = Factory_1.FederationFactoryEE.buildRoomApplicationService(this.getInternalSettingsAdapter(), this.internalUserAdapterEE, this.getInternalFileAdapter(), this.getBridge());
        this.directMessageRoomServiceSenderEE = Factory_1.FederationFactoryEE.buildDirectMessageRoomServiceSender(this.internalRoomAdapterEE, this.internalUserAdapterEE, this.getInternalFileAdapter(), this.getInternalSettingsAdapter(), this.getBridge());
        this.internalRoomServiceSenderEE = Factory_1.FederationFactoryEE.buildRoomServiceSenderEE(this.internalRoomAdapterEE, this.internalUserAdapterEE, this.getInternalFileAdapter(), this.getInternalSettingsAdapter(), this.getInternalMessageAdapter(), this.getInternalNotificationAdapter(), Factory_1.FederationFactoryEE.buildInternalQueueAdapter(), this.getBridge());
    }
    setupInternalEphemeralListeners() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getInternalNotificationAdapter().subscribeToUserTypingEventsOnFederatedRooms(this.getInternalNotificationAdapter().broadcastUserTypingOnRoom.bind(this.getInternalNotificationAdapter()));
        });
    }
    setupInternalValidators() {
        return __awaiter(this, void 0, void 0, function* () {
            const internalRoomHooksValidator = Factory_1.FederationFactoryEE.buildRoomInternalValidator(this.internalRoomAdapterEE, this.internalUserAdapterEE, this.getInternalFileAdapter(), this.getInternalSettingsAdapter(), this.getBridge());
            Factory_1.FederationFactoryEE.setupValidators(internalRoomHooksValidator);
        });
    }
    setupInternalActionListeners() {
        return __awaiter(this, void 0, void 0, function* () {
            const internalRoomServiceSender = Factory_1.FederationFactoryEE.buildRoomServiceSender(this.internalRoomAdapterEE, this.internalUserAdapterEE, this.getInternalFileAdapter(), this.getInternalMessageAdapter(), this.getInternalSettingsAdapter(), this.getInternalNotificationAdapter(), this.getBridge());
            const internalMessageServiceSender = Factory_1.FederationFactoryEE.buildMessageServiceSender(this.internalRoomAdapterEE, this.internalUserAdapterEE, this.getInternalSettingsAdapter(), this.getInternalMessageAdapter(), this.getBridge());
            Factory_1.FederationFactoryEE.setupListenersForLocalActions(internalRoomServiceSender, internalMessageServiceSender);
            Factory_1.FederationFactoryEE.setupListenersForLocalActionsEE(this.internalRoomServiceSenderEE, this.directMessageRoomServiceSenderEE, this.getInternalSettingsAdapter());
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
    getBridge() {
        return this.bridge;
    }
    startFederation() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isFederationEnabled()) {
                return;
            }
            yield this.bridge.start();
            this.bridge.logFederationStartupInfo('Running Federation Enterprise V2');
            Factory_1.FederationFactoryEE.removeCEValidators();
            yield Promise.resolve().then(() => __importStar(require('./infrastructure/rocket-chat/slash-commands')));
            yield Promise.resolve().then(() => __importStar(require('../../api/federation')));
        });
    }
    stopFederation() {
        const _super = Object.create(null, {
            cleanUpHandlers: { get: () => super.cleanUpHandlers }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bridge.stop();
            Factory_1.FederationFactoryEE.removeAllListeners();
            yield _super.cleanUpHandlers.call(this);
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
    stopped() {
        const _super = Object.create(null, {
            stopped: { get: () => super.stopped }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stopFederation();
            yield _super.stopped.call(this);
        });
    }
}
class FederationServiceEE extends AbstractBaseFederationServiceEE {
    constructor() {
        super(...arguments);
        this.name = 'federation-enterprise';
    }
    createDirectMessageRoom(internalUserId, invitees) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.directMessageRoomServiceSenderEE.createInternalLocalDirectMessageRoom(RoomSender_1.FederationRoomSenderConverterEE.toCreateDirectMessageDto(internalUserId, invitees));
        });
    }
    searchPublicRooms(serverName, roomName, pageToken, count) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.internalRoomServiceSenderEE.searchPublicRooms(new RoomInputDto_1.FederationSearchPublicRoomsInputDto({
                serverName,
                roomName,
                pageToken,
                count,
            }));
        });
    }
    getSearchedServerNamesByInternalUserId(internalUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.internalUserServiceEE.getSearchedServerNamesByInternalUserId(internalUserId);
        });
    }
    addSearchedServerNameByInternalUserId(internalUserId, serverName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.internalUserServiceEE.addSearchedServerNameByInternalUserId(internalUserId, serverName);
        });
    }
    removeSearchedServerNameByInternalUserId(internalUserId, serverName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.internalUserServiceEE.removeSearchedServerNameByInternalUserId(internalUserId, serverName);
        });
    }
    scheduleJoinExternalPublicRoom(internalUserId, externalRoomId, roomName, pageToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.internalRoomServiceSenderEE.scheduleJoinExternalPublicRoom(internalUserId, externalRoomId, roomName, pageToken);
        });
    }
    joinExternalPublicRoom(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { internalUserId, externalRoomId, roomName, pageToken } = input;
            yield this.internalRoomServiceSenderEE.joinExternalPublicRoom(RoomSender_1.FederationRoomSenderConverterEE.toJoinExternalPublicRoomDto(internalUserId, externalRoomId, roomName, pageToken));
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
            const federationService = new FederationServiceEE();
            yield federationService.initialize();
            return federationService;
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
    stopped() {
        const _super = Object.create(null, {
            stopped: { get: () => super.stopped }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.stopped.call(this);
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
exports.FederationServiceEE = FederationServiceEE;
