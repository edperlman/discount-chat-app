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
exports.FederationMessageServiceReceiver = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const AbstractFederationApplicationService_1 = require("../../../AbstractFederationApplicationService");
class FederationMessageServiceReceiver extends AbstractFederationApplicationService_1.AbstractFederationApplicationService {
    constructor(internalRoomAdapter, internalUserAdapter, internalMessageAdapter, internalFileAdapter, internalSettingsAdapter, bridge) {
        super(bridge, internalUserAdapter, internalFileAdapter, internalSettingsAdapter);
        this.internalRoomAdapter = internalRoomAdapter;
        this.internalUserAdapter = internalUserAdapter;
        this.internalMessageAdapter = internalMessageAdapter;
        this.internalFileAdapter = internalFileAdapter;
        this.internalSettingsAdapter = internalSettingsAdapter;
        this.bridge = bridge;
    }
    onMessageReaction(messageReactionEventInput) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { externalRoomId, emoji, externalSenderId, externalEventId: externalReactionEventId, externalReactedEventId: externalMessageId, } = messageReactionEventInput;
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            if (!federatedRoom) {
                return;
            }
            const federatedUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalSenderId);
            if (!federatedUser) {
                return;
            }
            const message = yield this.internalMessageAdapter.getMessageByFederationId(externalMessageId);
            if (!message) {
                return;
            }
            if (!(0, core_typings_1.isMessageFromMatrixFederation)(message)) {
                return;
            }
            // TODO: move this to a Message entity in the domain layer
            const userAlreadyReacted = Boolean(federatedUser.getUsername() && ((_c = (_b = (_a = message.reactions) === null || _a === void 0 ? void 0 : _a[emoji]) === null || _b === void 0 ? void 0 : _b.usernames) === null || _c === void 0 ? void 0 : _c.includes(federatedUser.getUsername())));
            if (userAlreadyReacted) {
                return;
            }
            yield this.internalMessageAdapter.reactToMessage(federatedUser, message, emoji, externalReactionEventId);
        });
    }
}
exports.FederationMessageServiceReceiver = FederationMessageServiceReceiver;
