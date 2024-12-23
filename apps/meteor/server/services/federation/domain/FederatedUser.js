"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederatedUser = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const mongodb_1 = require("mongodb"); // This should not be in the domain layer, but its a known "problem"
const FederatedRoom_1 = require("./FederatedRoom");
class FederatedUser {
    constructor({ externalId, internalReference, existsOnlyOnProxyServer, }) {
        this.externalId = externalId;
        this.existsOnlyOnProxyServer = existsOnlyOnProxyServer;
        this.internalReference = internalReference;
        this.internalId = internalReference._id || new mongodb_1.ObjectId().toHexString();
    }
    static createInstance(externalId, params) {
        return new FederatedUser({
            externalId,
            existsOnlyOnProxyServer: params.existsOnlyOnProxyServer,
            internalReference: FederatedUser.createLocalInstanceOnly(params),
        });
    }
    static createLocalInstanceOnly(params) {
        return {
            username: params.username,
            name: params.name,
            type: 'user',
            status: core_typings_1.UserStatus.ONLINE,
            active: true,
            roles: ['user'],
            requirePasswordChange: false,
            federated: !params.existsOnlyOnProxyServer,
        };
    }
    static createWithInternalReference(externalId, existsOnlyOnProxyServer, internalReference) {
        return new FederatedUser({
            externalId,
            existsOnlyOnProxyServer,
            internalReference,
        });
    }
    getInternalReference() {
        return Object.freeze(Object.assign(Object.assign({}, this.internalReference), { _id: this.internalId }));
    }
    getStorageRepresentation() {
        return {
            _id: this.internalId,
            username: this.internalReference.username || '',
            type: this.internalReference.type,
            status: this.internalReference.status,
            active: this.internalReference.active,
            roles: this.internalReference.roles,
            name: this.internalReference.name,
            requirePasswordChange: this.internalReference.requirePasswordChange,
            createdAt: new Date(),
            _updatedAt: new Date(),
            federated: this.isRemote(),
        };
    }
    getUsername() {
        var _a;
        return (_a = this.internalReference) === null || _a === void 0 ? void 0 : _a.username;
    }
    getName() {
        var _a;
        return (_a = this.internalReference) === null || _a === void 0 ? void 0 : _a.name;
    }
    static isOriginalFromTheProxyServer(fromOriginName, localOriginName) {
        return (0, FederatedRoom_1.isAnInternalIdentifier)(fromOriginName, localOriginName);
    }
    getExternalId() {
        return this.externalId;
    }
    isRemote() {
        return !this.existsOnlyOnProxyServer;
    }
    shouldUpdateFederationAvatar(federationAvatarUrl) {
        var _a;
        return ((_a = this.internalReference.federation) === null || _a === void 0 ? void 0 : _a.avatarUrl) !== federationAvatarUrl;
    }
    shouldUpdateDisplayName(displayName) {
        return this.internalReference.name !== displayName;
    }
    getInternalId() {
        return this.internalId;
    }
}
exports.FederatedUser = FederatedUser;
