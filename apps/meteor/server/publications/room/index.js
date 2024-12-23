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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const underscore_1 = __importDefault(require("underscore"));
const server_1 = require("../../../app/authorization/server");
const hasPermission_1 = require("../../../app/authorization/server/functions/hasPermission");
const server_2 = require("../../../app/settings/server");
const publishFields_1 = require("../../../lib/publishFields");
const roomCoordinator_1 = require("../../lib/rooms/roomCoordinator");
const roomMap = (record) => {
    return underscore_1.default.pick(record, ...Object.keys(publishFields_1.roomFields));
};
meteor_1.Meteor.methods({
    'rooms/get'(updatedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { projection: publishFields_1.roomFields };
            const user = meteor_1.Meteor.userId();
            if (!user) {
                if (server_2.settings.get('Accounts_AllowAnonymousRead')) {
                    return models_1.Rooms.findByDefaultAndTypes(true, ['c'], options).toArray();
                }
                return [];
            }
            if (updatedAt instanceof Date) {
                return {
                    update: yield (yield models_1.Rooms.findBySubscriptionUserIdUpdatedAfter(user, updatedAt, options)).toArray(),
                    remove: yield models_1.Rooms.trashFindDeletedAfter(updatedAt, {}, { projection: { _id: 1, _deletedAt: 1 } }).toArray(),
                };
            }
            return (yield models_1.Rooms.findBySubscriptionUserId(user, options)).toArray();
        });
    },
    'getRoomByTypeAndName'(type, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId && server_2.settings.get('Accounts_AllowAnonymousRead') === false) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'getRoomByTypeAndName',
                });
            }
            const roomFind = roomCoordinator_1.roomCoordinator.getRoomFind(type);
            const room = roomFind ? yield roomFind.call(this, name) : yield models_1.Rooms.findByTypeAndNameOrId(type, name);
            if (!room) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                    method: 'getRoomByTypeAndName',
                });
            }
            if (userId && !(yield (0, server_1.canAccessRoomAsync)(room, { _id: userId }))) {
                throw new meteor_1.Meteor.Error('error-no-permission', 'No permission', {
                    method: 'getRoomByTypeAndName',
                });
            }
            if (server_2.settings.get('Store_Last_Message') && userId && !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'preview-c-room'))) {
                delete room.lastMessage;
            }
            return roomMap(room);
        });
    },
});
