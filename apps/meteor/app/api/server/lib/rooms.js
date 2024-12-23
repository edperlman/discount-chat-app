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
exports.findAdminRooms = findAdminRooms;
exports.findAdminRoom = findAdminRoom;
exports.findChannelAndPrivateAutocomplete = findChannelAndPrivateAutocomplete;
exports.findAdminRoomsAutocomplete = findAdminRoomsAutocomplete;
exports.findChannelAndPrivateAutocompleteWithPagination = findChannelAndPrivateAutocompleteWithPagination;
exports.findRoomsAvailableForTeams = findRoomsAvailableForTeams;
const models_1 = require("@rocket.chat/models");
const adminFields_1 = require("../../../../lib/rooms/adminFields");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
function findAdminRooms(_a) {
    return __awaiter(this, arguments, void 0, function* ({ uid, filter, types = [], pagination: { offset, count, sort }, }) {
        if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'view-room-administration'))) {
            throw new Error('error-not-authorized');
        }
        const name = filter === null || filter === void 0 ? void 0 : filter.trim();
        const discussion = types === null || types === void 0 ? void 0 : types.includes('discussions');
        const includeTeams = types === null || types === void 0 ? void 0 : types.includes('teams');
        const typesToRemove = ['discussions', 'teams'];
        const showTypes = Array.isArray(types) ? types.filter((type) => !typesToRemove.includes(type)) : [];
        const options = {
            projection: adminFields_1.adminFields,
            skip: offset,
            limit: count,
        };
        const result = models_1.Rooms.findByNameOrFnameContainingAndTypes(name, showTypes, discussion, includeTeams, options);
        const { cursor, totalCount } = result;
        const [rooms, total] = yield Promise.all([cursor.sort(sort || { default: -1, name: 1 }).toArray(), totalCount]);
        return {
            rooms,
            count: rooms.length,
            offset,
            total,
        };
    });
}
function findAdminRoom(_a) {
    return __awaiter(this, arguments, void 0, function* ({ uid, rid }) {
        if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'view-room-administration'))) {
            throw new Error('error-not-authorized');
        }
        return models_1.Rooms.findOneById(rid, { projection: adminFields_1.adminFields });
    });
}
function findChannelAndPrivateAutocomplete(_a) {
    return __awaiter(this, arguments, void 0, function* ({ uid, selector }) {
        const options = {
            projection: {
                _id: 1,
                fname: 1,
                name: 1,
                t: 1,
                avatarETag: 1,
            },
            limit: 10,
            sort: {
                name: 1,
            },
        };
        const userRoomsIds = (yield models_1.Subscriptions.findByUserId(uid, { projection: { rid: 1 } }).toArray()).map((item) => item.rid);
        const rooms = yield models_1.Rooms.findRoomsWithoutDiscussionsByRoomIds(selector.name, userRoomsIds, options).toArray();
        return {
            items: rooms,
        };
    });
}
function findAdminRoomsAutocomplete(_a) {
    return __awaiter(this, arguments, void 0, function* ({ uid, selector }) {
        if (!(yield (0, hasPermission_1.hasAtLeastOnePermissionAsync)(uid, ['view-room-administration', 'can-audit']))) {
            throw new Error('error-not-authorized');
        }
        const options = {
            projection: {
                _id: 1,
                fname: 1,
                name: 1,
                t: 1,
                avatarETag: 1,
                encrypted: 1,
            },
            limit: 10,
            sort: {
                name: 1,
            },
        };
        const rooms = yield models_1.Rooms.findRoomsByNameOrFnameStarting(selector.name, options).toArray();
        return {
            items: rooms,
        };
    });
}
function findChannelAndPrivateAutocompleteWithPagination(_a) {
    return __awaiter(this, arguments, void 0, function* ({ uid, selector, pagination: { offset, count, sort }, }) {
        const userRoomsIds = (yield models_1.Subscriptions.findByUserId(uid, { projection: { rid: 1 } }).toArray()).map((item) => item.rid);
        const options = {
            projection: {
                _id: 1,
                fname: 1,
                name: 1,
                t: 1,
                avatarETag: 1,
            },
            sort: sort || { name: 1 },
            skip: offset,
            limit: count,
        };
        const { cursor, totalCount } = models_1.Rooms.findPaginatedRoomsWithoutDiscussionsByRoomIds(selector.name, userRoomsIds, options);
        const [rooms, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            items: rooms,
            total,
        };
    });
}
function findRoomsAvailableForTeams(_a) {
    return __awaiter(this, arguments, void 0, function* ({ uid, name }) {
        const options = {
            projection: {
                _id: 1,
                fname: 1,
                name: 1,
                t: 1,
                avatarETag: 1,
            },
            limit: 10,
            sort: {
                name: 1,
            },
        };
        const userRooms = (yield models_1.Subscriptions.findByUserIdAndRoles(uid, ['owner'], { projection: { rid: 1 } }).toArray()).map((item) => item.rid);
        const rooms = yield models_1.Rooms.findChannelAndGroupListWithoutTeamsByNameStartingByOwner(name, userRooms, options).toArray();
        return {
            items: rooms,
        };
    });
}
