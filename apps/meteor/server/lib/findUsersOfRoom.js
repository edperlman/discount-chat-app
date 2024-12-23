"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUsersOfRoom = findUsersOfRoom;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../app/settings/server");
function findUsersOfRoom({ rid, status, skip = 0, limit = 0, filter = '', sort }) {
    const options = Object.assign(Object.assign({ projection: {
            name: 1,
            username: 1,
            nickname: 1,
            status: 1,
            avatarETag: 1,
            _updatedAt: 1,
            federated: 1,
        }, sort: Object.assign({ statusConnection: -1 }, (sort || Object.assign(Object.assign({}, (server_1.settings.get('UI_Use_Real_Name') && { name: 1 })), { username: 1 }))) }, (skip > 0 && { skip })), (limit > 0 && { limit }));
    const searchFields = server_1.settings.get('Accounts_SearchFields').trim().split(',');
    return models_1.Users.findPaginatedByActiveUsersExcept(filter, undefined, options, searchFields, [
        Object.assign({ __rooms: rid }, (status && { status })),
    ]);
}
