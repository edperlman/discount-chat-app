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
exports.getRoomByNameOrIdWithOptionToJoin = void 0;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const addUserToRoom_1 = require("./addUserToRoom");
const isObject_1 = require("../../../../lib/utils/isObject");
const createDirectMessage_1 = require("../../../../server/methods/createDirectMessage");
const getRoomByNameOrIdWithOptionToJoin = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, nameOrId = '', type, tryDirectByUserIdOnly = false, joinChannel = true, errorOnEmpty = true, }) {
    let room;
    // If the nameOrId starts with #, then let's try to find a channel or group
    if (nameOrId.startsWith('#')) {
        nameOrId = nameOrId.substring(1);
        room = yield models_1.Rooms.findOneByIdOrName(nameOrId);
    }
    else if (nameOrId.startsWith('@') || type === 'd') {
        // If the nameOrId starts with @ OR type is 'd', then let's try just a direct message
        nameOrId = nameOrId.replace('@', '');
        let roomUser;
        if (tryDirectByUserIdOnly) {
            roomUser = yield models_1.Users.findOneById(nameOrId);
        }
        else {
            roomUser = yield models_1.Users.findOne({
                $or: [{ _id: nameOrId }, { username: nameOrId }],
            });
        }
        room = (0, isObject_1.isObject)(roomUser)
            ? yield models_1.Rooms.findOneDirectRoomContainingAllUserIDs([...new Set([user._id, roomUser._id])])
            : yield models_1.Rooms.findOneById(nameOrId);
        // If the room hasn't been found yet, let's try some more
        if (!(0, isObject_1.isObject)(room)) {
            // If the roomUser wasn't found, then there's no destination to point towards
            // so return out based upon errorOnEmpty
            if (!(0, isObject_1.isObject)(roomUser)) {
                if (errorOnEmpty) {
                    throw new meteor_1.Meteor.Error('invalid-channel');
                }
                else {
                    return null;
                }
            }
            const { rid } = yield (0, createDirectMessage_1.createDirectMessage)([roomUser.username], user._id);
            return models_1.Rooms.findOneById(rid);
        }
    }
    else {
        // Otherwise, we'll treat this as a channel or group.
        room = yield models_1.Rooms.findOneByIdOrName(nameOrId);
    }
    // If no room was found, handle the room return based upon errorOnEmpty
    if (!room && errorOnEmpty) {
        throw new meteor_1.Meteor.Error('invalid-channel');
    }
    if (room === null) {
        return null;
    }
    // If a room was found and they provided a type to search, then check
    // and if the type found isn't what we're looking for then handle
    // the return based upon errorOnEmpty
    if (type && room.t !== type) {
        if (errorOnEmpty) {
            throw new meteor_1.Meteor.Error('invalid-channel');
        }
        else {
            return null;
        }
    }
    // If the room type is channel and joinChannel has been passed, try to join them
    // if they can't join the room, this will error out!
    if (room.t === 'c' && joinChannel) {
        yield (0, addUserToRoom_1.addUserToRoom)(room._id, user);
    }
    return room;
});
exports.getRoomByNameOrIdWithOptionToJoin = getRoomByNameOrIdWithOptionToJoin;
