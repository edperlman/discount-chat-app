"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectMessageFederatedRoom = exports.FederatedRoom = exports.AbstractFederatedRoom = exports.isAnInternalIdentifier = void 0;
const rooms_1 = require("@rocket.chat/apps-engine/definition/rooms");
const mongodb_1 = require("mongodb"); // This should not be in the domain layer, but its a known "problem"
const isAnInternalIdentifier = (fromOriginName, localOriginName) => {
    return fromOriginName === localOriginName;
};
exports.isAnInternalIdentifier = isAnInternalIdentifier;
class AbstractFederatedRoom {
    constructor({ externalId, internalReference }) {
        this.externalId = externalId;
        this.internalReference = internalReference;
        this.internalId = internalReference._id || new mongodb_1.ObjectId().toHexString();
    }
    static generateTemporaryName(normalizedExternalId) {
        return `Federation-${normalizedExternalId}`;
    }
    getExternalId() {
        return this.externalId;
    }
    getRoomType() {
        return this.internalReference.t;
    }
    getInternalId() {
        return this.internalId;
    }
    getDisplayName() {
        return this.internalReference.fname;
    }
    getName() {
        return this.internalReference.name;
    }
    getTopic() {
        return this.internalReference.topic;
    }
    static isOriginalFromTheProxyServer(fromOriginName, proxyServerOriginName) {
        return (0, exports.isAnInternalIdentifier)(fromOriginName, proxyServerOriginName);
    }
    getInternalReference() {
        return Object.freeze(Object.assign(Object.assign({}, this.internalReference), { _id: this.internalId }));
    }
    getCreatorUsername() {
        var _a;
        return (_a = this.internalReference.u) === null || _a === void 0 ? void 0 : _a.username;
    }
    isTheCreator(userId) {
        var _a;
        return ((_a = this.internalReference.u) === null || _a === void 0 ? void 0 : _a._id) === userId;
    }
    getCreatorId() {
        var _a;
        return (_a = this.internalReference.u) === null || _a === void 0 ? void 0 : _a._id;
    }
    changeRoomType(type) {
        if (this.isDirectMessage()) {
            throw new Error('Its not possible to change a direct message type');
        }
        this.internalReference.t = type;
    }
    changeDisplayRoomName(displayName) {
        if (this.isDirectMessage()) {
            throw new Error('Its not possible to change a direct message name');
        }
        this.internalReference.fname = displayName;
    }
    shouldUpdateRoomName(aRoomName) {
        var _a;
        return ((_a = this.internalReference) === null || _a === void 0 ? void 0 : _a.name) !== aRoomName && !this.isDirectMessage();
    }
    changeRoomName(name) {
        if (this.isDirectMessage()) {
            throw new Error('Its not possible to change a direct message name');
        }
        this.internalReference.name = name;
    }
    changeRoomTopic(topic) {
        if (this.isDirectMessage()) {
            throw new Error('Its not possible to change a direct message topic');
        }
        this.internalReference.topic = topic;
    }
    shouldUpdateDisplayRoomName(aRoomName) {
        var _a;
        return ((_a = this.internalReference) === null || _a === void 0 ? void 0 : _a.fname) !== aRoomName && !this.isDirectMessage();
    }
    shouldUpdateRoomTopic(aRoomTopic) {
        var _a;
        return ((_a = this.internalReference) === null || _a === void 0 ? void 0 : _a.topic) !== aRoomTopic && !this.isDirectMessage();
    }
    static shouldUpdateMessage(newMessageText, originalMessage) {
        return originalMessage.msg !== newMessageText;
    }
}
exports.AbstractFederatedRoom = AbstractFederatedRoom;
class FederatedRoom extends AbstractFederatedRoom {
    constructor({ externalId, internalReference }) {
        super({ externalId, internalReference });
    }
    static createInstance(externalId, normalizedExternalId, creator, type, displayName, name) {
        if (type === rooms_1.RoomType.DIRECT_MESSAGE) {
            throw new Error('For DMs please use the specific class');
        }
        const roomName = displayName || FederatedRoom.generateTemporaryName(normalizedExternalId);
        return new FederatedRoom({
            externalId,
            internalReference: {
                t: type,
                fname: roomName,
                name,
                u: creator.getInternalReference(),
            },
        });
    }
    static createWithInternalReference(externalId, internalReference) {
        if (internalReference.t === rooms_1.RoomType.DIRECT_MESSAGE) {
            throw new Error('For DMs please use the specific class');
        }
        return new FederatedRoom({
            externalId,
            internalReference,
        });
    }
    isDirectMessage() {
        return false;
    }
}
exports.FederatedRoom = FederatedRoom;
class DirectMessageFederatedRoom extends AbstractFederatedRoom {
    constructor({ externalId, internalReference, members, }) {
        super({ externalId, internalReference });
        this.members = members;
    }
    static createInstance(externalId, creator, members) {
        return new DirectMessageFederatedRoom({
            externalId,
            members,
            internalReference: {
                t: rooms_1.RoomType.DIRECT_MESSAGE,
                u: creator.getInternalReference(),
            },
        });
    }
    static createWithInternalReference(externalId, internalReference, members) {
        return new DirectMessageFederatedRoom({
            externalId,
            internalReference,
            members,
        });
    }
    getMembersUsernames() {
        return this.members.map((user) => user.getUsername() || '').filter(Boolean);
    }
    getMembers() {
        return this.members;
    }
    addMember(member) {
        this.members.push(member);
    }
    isDirectMessage() {
        return true;
    }
    isUserPartOfTheRoom(federatedUser) {
        var _a;
        if (!federatedUser.getUsername()) {
            return false;
        }
        if (!((_a = this.internalReference) === null || _a === void 0 ? void 0 : _a.usernames)) {
            return false;
        }
        return this.internalReference.usernames.includes(federatedUser.getUsername());
    }
}
exports.DirectMessageFederatedRoom = DirectMessageFederatedRoom;
