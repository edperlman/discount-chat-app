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
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const mem_1 = __importDefault(require("mem"));
const ddp_rate_limiter_1 = require("meteor/ddp-rate-limiter");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const handler_1 = require("../../app/federation/server/handler");
const getFederationDomain_1 = require("../../app/federation/server/lib/getFederationDomain");
const isFederationEnabled_1 = require("../../app/federation/server/lib/isFederationEnabled");
const server_1 = require("../../app/settings/server");
const isTruthy_1 = require("../../lib/isTruthy");
const stringUtils_1 = require("../../lib/utils/stringUtils");
const sortChannels = (field, direction) => {
    switch (field) {
        case 'createdAt':
            return {
                ts: direction === 'asc' ? 1 : -1,
            };
        case 'lastMessage':
            return {
                'lastMessage.ts': direction === 'asc' ? 1 : -1,
            };
        default:
            return {
                [field]: direction === 'asc' ? 1 : -1,
            };
    }
};
const sortUsers = (field, direction) => {
    switch (field) {
        case 'email':
            return {
                'emails.address': direction === 'asc' ? 1 : -1,
                'username': direction === 'asc' ? 1 : -1,
            };
        default:
            return {
                [field]: direction === 'asc' ? 1 : -1,
            };
    }
};
const getChannelsAndGroups = (user, canViewAnon, searchTerm, sort, pagination) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if ((!user && !canViewAnon) || (user && !(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'view-c-room')))) {
        return;
    }
    const teams = yield core_services_1.Team.getAllPublicTeams();
    const publicTeamIds = teams.map(({ _id }) => _id);
    const userTeamsIds = ((_a = (yield core_services_1.Team.listTeamsBySubscriberUserId(user._id, { projection: { teamId: 1 } }))) === null || _a === void 0 ? void 0 : _a.map(({ teamId }) => teamId)) || [];
    const userRooms = (_b = user.__rooms) !== null && _b !== void 0 ? _b : [];
    const { cursor, totalCount } = models_1.Rooms.findPaginatedByNameOrFNameAndRoomIdsIncludingTeamRooms(searchTerm ? new RegExp(searchTerm, 'i') : null, [...userTeamsIds, ...publicTeamIds], userRooms, Object.assign(Object.assign({}, pagination), { sort: Object.assign({ featured: -1 }, sort), projection: {
            t: 1,
            description: 1,
            topic: 1,
            name: 1,
            fname: 1,
            lastMessage: 1,
            ts: 1,
            archived: 1,
            default: 1,
            featured: 1,
            usersCount: 1,
            prid: 1,
            teamId: 1,
            federated: 1,
        } }));
    const [result, total] = yield Promise.all([cursor.toArray(), totalCount]);
    const teamIds = result.map(({ teamId }) => teamId).filter(isTruthy_1.isTruthy);
    const teamsMains = yield core_services_1.Team.listByIds([...new Set(teamIds)], { projection: { _id: 1, name: 1 } });
    const results = result.map((room) => {
        if (room.teamId) {
            const team = teamsMains.find((mainRoom) => mainRoom._id === room.teamId);
            if (team) {
                return Object.assign(Object.assign({}, room), { belongsTo: team.name });
            }
        }
        return room;
    });
    return {
        total,
        results,
    };
});
const getChannelsCountForTeam = (0, mem_1.default)((teamId) => models_1.Rooms.countByTeamId(teamId), {
    maxAge: 2000,
});
const getTeams = (user, searchTerm, sort, pagination) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user) {
        return;
    }
    const userSubs = yield models_1.Subscriptions.findByUserId(user._id).toArray();
    const ids = userSubs.map((sub) => sub.rid);
    const { cursor, totalCount } = models_1.Rooms.findPaginatedContainingNameOrFNameInIdsAsTeamMain(searchTerm ? new RegExp(searchTerm, 'i') : null, ids, Object.assign(Object.assign({}, pagination), { sort: Object.assign({ featured: -1 }, sort), projection: {
            t: 1,
            description: 1,
            topic: 1,
            name: 1,
            fname: 1,
            lastMessage: 1,
            ts: 1,
            archived: 1,
            default: 1,
            featured: 1,
            usersCount: 1,
            prid: 1,
            teamId: 1,
            teamMain: 1,
        } }));
    const results = yield Promise.all((yield cursor.toArray()).map((room) => __awaiter(void 0, void 0, void 0, function* () {
        return (Object.assign(Object.assign({}, room), { roomsCount: yield getChannelsCountForTeam(room.teamId) }));
    })));
    return {
        total: yield totalCount,
        results,
    };
});
const findUsers = (_a) => __awaiter(void 0, [_a], void 0, function* ({ text, sort, pagination, workspace, viewFullOtherUserInfo, }) {
    const searchFields = workspace === 'all' ? ['username', 'name', 'emails.address'] : server_1.settings.get('Accounts_SearchFields').trim().split(',');
    const options = Object.assign(Object.assign({}, pagination), { sort, projection: Object.assign(Object.assign({ username: 1, name: 1, nickname: 1, bio: 1, createdAt: 1 }, (viewFullOtherUserInfo && { emails: 1 })), { federation: 1, avatarETag: 1 }) });
    if (workspace === 'all') {
        const { cursor, totalCount } = models_1.Users.findPaginatedByActiveUsersExcept(text, [], options, searchFields);
        const [results, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            total,
            results,
        };
    }
    if (workspace === 'external') {
        const { cursor, totalCount } = models_1.Users.findPaginatedByActiveExternalUsersExcept(text, [], options, searchFields, (0, getFederationDomain_1.getFederationDomain)());
        const [results, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            total,
            results,
        };
    }
    const { cursor, totalCount } = models_1.Users.findPaginatedByActiveLocalUsersExcept(text, [], options, searchFields, (0, getFederationDomain_1.getFederationDomain)());
    const [results, total] = yield Promise.all([cursor.toArray(), totalCount]);
    return {
        total,
        results,
    };
});
const getUsers = (user, text, workspace, sort, pagination) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user || !(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'view-outside-room')) || !(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'view-d-room'))) {
        return;
    }
    const viewFullOtherUserInfo = yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'view-full-other-user-info');
    const { total, results } = yield findUsers({ text, sort, pagination, workspace, viewFullOtherUserInfo });
    // Try to find federated users, when applicable
    if ((0, isFederationEnabled_1.isFederationEnabled)() && workspace === 'external' && text.indexOf('@') !== -1) {
        const users = yield (0, handler_1.federationSearchUsers)(text);
        for (const user of users) {
            if (results.find((e) => e._id === user._id)) {
                continue;
            }
            // Add the federated user to the results
            results.unshift({
                username: user.username,
                name: user.name,
                bio: user.bio,
                nickname: user.nickname,
                emails: user.emails,
                federation: user.federation,
                isRemote: true,
            });
        }
    }
    return {
        total,
        results,
    };
});
meteor_1.Meteor.methods({
    browseChannels(_a) {
        return __awaiter(this, arguments, void 0, function* ({ text = '', workspace = '', type = 'channels', sortBy = 'name', sortDirection = 'asc', page = 0, offset = 0, limit = 10, }) {
            const searchTerm = (0, stringUtils_1.trim)((0, string_helpers_1.escapeRegExp)(text));
            if (!['channels', 'users', 'teams'].includes(type) ||
                !['asc', 'desc'].includes(sortDirection) ||
                (!page && page !== 0 && !offset && offset !== 0)) {
                return;
            }
            const roomParams = ['channels', 'teams'].includes(type) ? ['usernames', 'lastMessage'] : [];
            const userParams = type === 'users' ? ['username', 'email', 'bio'] : [];
            if (!['name', 'createdAt', 'usersCount', ...roomParams, ...userParams].includes(sortBy)) {
                return;
            }
            const skip = Math.max(0, offset || (page > -1 ? limit * page : 0));
            limit = limit > 0 ? limit : 10;
            const pagination = {
                skip,
                limit,
            };
            const canViewAnonymous = !!server_1.settings.get('Accounts_AllowAnonymousRead');
            const user = (yield meteor_1.Meteor.userAsync());
            if (!user) {
                return;
            }
            switch (type) {
                case 'channels':
                    return getChannelsAndGroups(user, canViewAnonymous, searchTerm, sortChannels(sortBy, sortDirection), pagination);
                case 'teams':
                    return getTeams(user, searchTerm, sortChannels(sortBy, sortDirection), pagination);
                case 'users':
                    return getUsers(user, text, workspace, sortUsers(sortBy, sortDirection), pagination);
                default:
            }
        });
    },
});
ddp_rate_limiter_1.DDPRateLimiter.addRule({
    type: 'method',
    name: 'browseChannels',
    userId( /* userId*/) {
        return true;
    },
}, 100, 100000);
