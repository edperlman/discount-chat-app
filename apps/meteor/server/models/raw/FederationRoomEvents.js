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
exports.FederationRoomEvents = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const FederationEvents_1 = require("./FederationEvents");
const context_1 = require("../../../app/federation/server/lib/context");
const { type, contextQuery } = context_1.contextDefinitions.ROOM;
class FederationRoomEvents extends FederationEvents_1.FederationEventsModel {
    constructor(db) {
        super(db, 'federation_room_events');
    }
    modelIndexes() {
        return [{ key: { 'context.roomId': 1 } }];
    }
    // @ts-expect-error - TODO: Bad extends
    createGenesisEvent(origin, room) {
        const _super = Object.create(null, {
            createGenesisEvent: { get: () => super.createGenesisEvent }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.createGenesisEvent.call(this, origin, contextQuery(room._id), { contextType: type, room });
        });
    }
    createDeleteRoomEvent(origin, roomId) {
        const _super = Object.create(null, {
            createEvent: { get: () => super.createEvent }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.createEvent.call(this, origin, contextQuery(roomId), core_typings_1.eventTypes.ROOM_DELETE, { roomId });
        });
    }
    createAddUserEvent(origin, roomId, user, subscription, domainsAfterAdd) {
        const _super = Object.create(null, {
            createEvent: { get: () => super.createEvent }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.createEvent.call(this, origin, contextQuery(roomId), core_typings_1.eventTypes.ROOM_ADD_USER, {
                roomId,
                user,
                subscription,
                domainsAfterAdd,
            });
        });
    }
    createRemoveUserEvent(origin, roomId, user, domainsAfterRemoval) {
        const _super = Object.create(null, {
            createEvent: { get: () => super.createEvent }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.createEvent.call(this, origin, contextQuery(roomId), core_typings_1.eventTypes.ROOM_REMOVE_USER, {
                roomId,
                user,
                domainsAfterRemoval,
            });
        });
    }
    createUserLeftEvent(origin, roomId, user, domainsAfterLeave) {
        const _super = Object.create(null, {
            createEvent: { get: () => super.createEvent }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.createEvent.call(this, origin, contextQuery(roomId), core_typings_1.eventTypes.ROOM_USER_LEFT, {
                roomId,
                user,
                domainsAfterLeave,
            });
        });
    }
    createMessageEvent(origin, roomId, message) {
        const _super = Object.create(null, {
            createEvent: { get: () => super.createEvent }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.createEvent.call(this, origin, contextQuery(roomId), core_typings_1.eventTypes.ROOM_MESSAGE, { message });
        });
    }
    createEditMessageEvent(origin, roomId, originalMessage) {
        const _super = Object.create(null, {
            createEvent: { get: () => super.createEvent }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const message = {
                _id: originalMessage._id,
                msg: originalMessage.msg,
                federation: originalMessage.federation,
            };
            return _super.createEvent.call(this, origin, contextQuery(roomId), core_typings_1.eventTypes.ROOM_EDIT_MESSAGE, {
                message,
            });
        });
    }
    createDeleteMessageEvent(origin, roomId, messageId) {
        const _super = Object.create(null, {
            createEvent: { get: () => super.createEvent }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.createEvent.call(this, origin, contextQuery(roomId), core_typings_1.eventTypes.ROOM_DELETE_MESSAGE, {
                roomId,
                messageId,
            });
        });
    }
    createSetMessageReactionEvent(origin, roomId, messageId, username, reaction) {
        const _super = Object.create(null, {
            createEvent: { get: () => super.createEvent }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.createEvent.call(this, origin, contextQuery(roomId), core_typings_1.eventTypes.ROOM_SET_MESSAGE_REACTION, {
                roomId,
                messageId,
                username,
                reaction,
            });
        });
    }
    createUnsetMessageReactionEvent(origin, roomId, messageId, username, reaction) {
        const _super = Object.create(null, {
            createEvent: { get: () => super.createEvent }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.createEvent.call(this, origin, contextQuery(roomId), core_typings_1.eventTypes.ROOM_UNSET_MESSAGE_REACTION, {
                roomId,
                messageId,
                username,
                reaction,
            });
        });
    }
    createMuteUserEvent(origin, roomId, user) {
        const _super = Object.create(null, {
            createEvent: { get: () => super.createEvent }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.createEvent.call(this, origin, contextQuery(roomId), core_typings_1.eventTypes.ROOM_MUTE_USER, {
                roomId,
                user,
            });
        });
    }
    createUnmuteUserEvent(origin, roomId, user) {
        const _super = Object.create(null, {
            createEvent: { get: () => super.createEvent }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.createEvent.call(this, origin, contextQuery(roomId), core_typings_1.eventTypes.ROOM_UNMUTE_USER, {
                roomId,
                user,
            });
        });
    }
    removeRoomEvents(roomId) {
        const _super = Object.create(null, {
            removeContextEvents: { get: () => super.removeContextEvents }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.removeContextEvents.call(this, contextQuery(roomId));
        });
    }
}
exports.FederationRoomEvents = FederationRoomEvents;
