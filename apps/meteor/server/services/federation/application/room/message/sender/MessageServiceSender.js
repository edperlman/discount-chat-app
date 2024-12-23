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
exports.FederationMessageServiceSender = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const Federation_1 = require("../../../../Federation");
const FederatedUser_1 = require("../../../../domain/FederatedUser");
class FederationMessageServiceSender {
    constructor(internalRoomAdapter, internalUserAdapter, internalSettingsAdapter, internalMessageAdapter, bridge) {
        this.internalRoomAdapter = internalRoomAdapter;
        this.internalUserAdapter = internalUserAdapter;
        this.internalSettingsAdapter = internalSettingsAdapter;
        this.internalMessageAdapter = internalMessageAdapter;
        this.bridge = bridge;
    }
    sendExternalMessageReaction(internalMessage, internalUser, reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!internalMessage || !internalUser || !internalUser._id || !internalMessage.rid) {
                return;
            }
            const federatedSender = yield this.internalUserAdapter.getFederatedUserByInternalId(internalUser._id);
            if (!federatedSender) {
                return;
            }
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalMessage.rid);
            if (!federatedRoom) {
                return;
            }
            if (!(0, core_typings_1.isMessageFromMatrixFederation)(internalMessage)) {
                return;
            }
            const isUserFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(federatedSender.getExternalId()), this.internalSettingsAdapter.getHomeServerDomain());
            if (!isUserFromTheSameHomeServer) {
                return;
            }
            const eventId = yield this.bridge.sendMessageReaction(federatedRoom.getExternalId(), federatedSender.getExternalId(), (_a = internalMessage.federation) === null || _a === void 0 ? void 0 : _a.eventId, reaction);
            federatedSender.getUsername() &&
                (yield this.internalMessageAdapter.setExternalFederationEventOnMessageReaction(federatedSender.getUsername(), internalMessage, reaction, eventId));
        });
    }
    sendExternalMessageUnReaction(internalMessage, internalUser, reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!internalMessage || !internalUser || !internalUser._id || !internalMessage.rid) {
                return;
            }
            const federatedSender = yield this.internalUserAdapter.getFederatedUserByInternalId(internalUser._id);
            if (!federatedSender) {
                return;
            }
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalMessage.rid);
            if (!federatedRoom) {
                return;
            }
            if (!(0, core_typings_1.isMessageFromMatrixFederation)(internalMessage)) {
                return;
            }
            const isUserFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(federatedSender.getExternalId()), this.internalSettingsAdapter.getHomeServerDomain());
            if (!isUserFromTheSameHomeServer) {
                return;
            }
            // TODO: leaked business logic, move this to the domain layer
            const externalEventId = Object.keys(((_a = internalMessage.reactions) === null || _a === void 0 ? void 0 : _a[reaction].federationReactionEventIds) || {}).find((key) => { var _a, _b; return ((_b = (_a = internalMessage.reactions) === null || _a === void 0 ? void 0 : _a[reaction].federationReactionEventIds) === null || _b === void 0 ? void 0 : _b[key]) === internalUser.username; });
            if (!externalEventId) {
                return;
            }
            const normalizedEventId = Federation_1.Federation.unescapeExternalFederationEventId(externalEventId);
            yield this.bridge.redactEvent(federatedRoom.getExternalId(), federatedSender.getExternalId(), normalizedEventId);
            yield this.internalMessageAdapter.unsetExternalFederationEventOnMessageReaction(externalEventId, internalMessage, reaction);
        });
    }
}
exports.FederationMessageServiceSender = FederationMessageServiceSender;
