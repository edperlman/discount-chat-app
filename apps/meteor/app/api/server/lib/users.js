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
exports.findUsersToAutocomplete = findUsersToAutocomplete;
exports.getInclusiveFields = getInclusiveFields;
exports.getNonEmptyFields = getNonEmptyFields;
exports.getNonEmptyQuery = getNonEmptyQuery;
exports.findPaginatedUsersByStatus = findPaginatedUsersByStatus;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../settings/server");
function findUsersToAutocomplete(_a) {
    return __awaiter(this, arguments, void 0, function* ({ uid, selector, }) {
        const searchFields = server_1.settings.get('Accounts_SearchFields').trim().split(',');
        const exceptions = selector.exceptions || [];
        const conditions = selector.conditions || {};
        const options = {
            projection: {
                name: 1,
                username: 1,
                nickname: 1,
                status: 1,
                avatarETag: 1,
            },
            sort: {
                username: 1,
            },
            limit: 10,
        };
        // Search on DMs first, to list known users before others.
        const contacts = yield models_1.Subscriptions.findConnectedUsersExcept(uid, selector.term, exceptions, searchFields, conditions, 10, 'd');
        if (contacts.length >= options.limit) {
            return { items: contacts };
        }
        options.limit -= contacts.length;
        contacts.forEach(({ username }) => exceptions.push(username));
        if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'view-outside-room'))) {
            const users = yield models_1.Subscriptions.findConnectedUsersExcept(uid, selector.term, exceptions, searchFields, conditions, 10);
            return { items: contacts.concat(users) };
        }
        const users = yield models_1.Users.findActiveByUsernameOrNameRegexWithExceptionsAndConditions(new RegExp((0, string_helpers_1.escapeRegExp)(selector.term), 'i'), exceptions, conditions, options).toArray();
        return {
            items: contacts.concat(users),
        };
    });
}
/**
 * Returns a new query object with the inclusive fields only
 */
function getInclusiveFields(query) {
    const newQuery = Object.create(null);
    for (const [key, value] of Object.entries(query)) {
        if (value === 1) {
            newQuery[key] = value;
        }
    }
    return newQuery;
}
/**
 * get the default fields if **fields** are empty (`{}`) or `undefined`/`null`
 * @param fields the fields from parsed jsonQuery
 */
function getNonEmptyFields(fields) {
    const defaultFields = {
        name: 1,
        username: 1,
        emails: 1,
        roles: 1,
        status: 1,
        active: 1,
        avatarETag: 1,
        lastLogin: 1,
        type: 1,
    };
    if (!fields || Object.keys(fields).length === 0) {
        return defaultFields;
    }
    return Object.assign(Object.assign({}, defaultFields), fields);
}
/**
 * get the default query if **query** is empty (`{}`) or `undefined`/`null`
 * @param query the query from parsed jsonQuery
 */
function getNonEmptyQuery(query, canSeeAllUserInfo) {
    var _a;
    const defaultQuery = {
        $or: [{ username: { $regex: '', $options: 'i' } }, { name: { $regex: '', $options: 'i' } }],
    };
    if (canSeeAllUserInfo) {
        (_a = defaultQuery.$or) === null || _a === void 0 ? void 0 : _a.push({ 'emails.address': { $regex: '', $options: 'i' } });
    }
    if (!query || Object.keys(query).length === 0) {
        return defaultQuery;
    }
    return Object.assign(Object.assign({}, defaultQuery), query);
}
function findPaginatedUsersByStatus(_a) {
    return __awaiter(this, arguments, void 0, function* ({ uid, offset, count, sort, status, roles, searchTerm, hasLoggedIn, type, }) {
        const actualSort = sort || { username: 1 };
        if (sort === null || sort === void 0 ? void 0 : sort.status) {
            actualSort.active = sort.status;
        }
        const match = {};
        switch (status) {
            case 'active':
                match.active = true;
                break;
            case 'deactivated':
                match.active = false;
                break;
        }
        if (hasLoggedIn !== undefined) {
            match.lastLogin = { $exists: hasLoggedIn };
        }
        if (type) {
            match.type = type;
        }
        const canSeeAllUserInfo = yield (0, hasPermission_1.hasPermissionAsync)(uid, 'view-full-other-user-info');
        const canSeeExtension = canSeeAllUserInfo || (yield (0, hasPermission_1.hasPermissionAsync)(uid, 'view-user-voip-extension'));
        const projection = Object.assign({ name: 1, username: 1, emails: 1, roles: 1, status: 1, active: 1, avatarETag: 1, lastLogin: 1, type: 1, reason: 1, federated: 1 }, (canSeeExtension ? { freeSwitchExtension: 1 } : {}));
        if (searchTerm === null || searchTerm === void 0 ? void 0 : searchTerm.trim()) {
            match.$or = [
                ...(canSeeAllUserInfo ? [{ 'emails.address': { $regex: (0, string_helpers_1.escapeRegExp)(searchTerm || ''), $options: 'i' } }] : []),
                {
                    username: { $regex: (0, string_helpers_1.escapeRegExp)(searchTerm || ''), $options: 'i' },
                },
                {
                    name: { $regex: (0, string_helpers_1.escapeRegExp)(searchTerm || ''), $options: 'i' },
                },
            ];
        }
        if ((roles === null || roles === void 0 ? void 0 : roles.length) && !roles.includes('all')) {
            match.roles = { $in: roles };
        }
        const { cursor, totalCount } = models_1.Users.findPaginated(Object.assign({}, match), {
            sort: actualSort,
            skip: offset,
            limit: count,
            projection,
            allowDiskUse: true,
        });
        const [users, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            users,
            count: users.length,
            offset,
            total,
        };
    });
}
