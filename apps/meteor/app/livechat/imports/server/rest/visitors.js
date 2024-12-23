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
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const server_1 = require("../../../../api/server");
const getPaginationItems_1 = require("../../../../api/server/helpers/getPaginationItems");
const server_2 = require("../../../../authorization/server");
const normalizeMessagesForUser_1 = require("../../../../utils/server/lib/normalizeMessagesForUser");
const visitors_1 = require("../../../server/api/lib/visitors");
server_1.API.v1.addRoute('livechat/visitors.info', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isLivechatVisitorsInfoProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const visitor = yield (0, visitors_1.findVisitorInfo)({ visitorId: this.queryParams.visitorId });
            return server_1.API.v1.success(visitor);
        });
    },
});
server_1.API.v1.addRoute('livechat/visitors.pagesVisited/:roomId', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isGETLivechatVisitorsPagesVisitedRoomIdParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const pages = yield (0, visitors_1.findVisitedPages)({
                roomId: this.urlParams.roomId,
                pagination: {
                    offset,
                    count,
                    sort,
                },
            });
            return server_1.API.v1.success(pages);
        });
    },
});
server_1.API.v1.addRoute('livechat/visitors.chatHistory/room/:roomId/visitor/:visitorId', {
    authRequired: true,
    permissionsRequired: ['view-l-room'],
    validateParams: rest_typings_1.isGETLivechatVisitorsChatHistoryRoomRoomIdVisitorVisitorIdParams,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const history = yield (0, visitors_1.findChatHistory)({
                userId: this.userId,
                roomId: this.urlParams.roomId,
                visitorId: this.urlParams.visitorId,
                pagination: {
                    offset,
                    count,
                    sort,
                },
            });
            return server_1.API.v1.success(history);
        });
    },
});
server_1.API.v1.addRoute('livechat/visitors.searchChats/room/:roomId/visitor/:visitorId', {
    authRequired: true,
    permissionsRequired: ['view-l-room'],
    validateParams: rest_typings_1.isGETLivechatVisitorsSearchChatsRoomRoomIdVisitorVisitorIdParams,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, visitorId } = this.urlParams;
            const { searchText, closedChatsOnly, servedChatsOnly, source } = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const history = yield (0, visitors_1.searchChats)({
                userId: this.userId,
                roomId,
                visitorId,
                searchText,
                closedChatsOnly,
                servedChatsOnly,
                source,
                pagination: {
                    offset,
                    count,
                    sort,
                },
            });
            return server_1.API.v1.success(history);
        });
    },
});
server_1.API.v1.addRoute('livechat/visitors.autocomplete', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isGETLivechatVisitorsAutocompleteParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { selector } = this.queryParams;
            return server_1.API.v1.success(yield (0, visitors_1.findVisitorsToAutocomplete)({
                selector: JSON.parse(selector),
            }));
        });
    },
});
server_1.API.v1.addRoute('livechat/visitors.search', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isGETLivechatVisitorsSearch }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { term } = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const nameOrUsername = term ? new RegExp((0, string_helpers_1.escapeRegExp)(term), 'i') : undefined;
            return server_1.API.v1.success(yield (0, visitors_1.findVisitorsByEmailOrPhoneOrNameOrUsernameOrCustomField)({
                emailOrPhone: term,
                nameOrUsername,
                pagination: {
                    offset,
                    count,
                    sort,
                },
            }));
        });
    },
});
server_1.API.v1.addRoute('livechat/:rid/messages', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isLivechatRidMessagesProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { searchTerm } = this.queryParams;
            const room = yield models_1.LivechatRooms.findOneById(this.urlParams.rid);
            if (!room) {
                throw new Error('invalid-room');
            }
            if (!(yield (0, server_2.canAccessRoomAsync)(room, this.user))) {
                throw new Error('not-allowed');
            }
            const { cursor, totalCount } = models_1.Messages.findLivechatClosedMessages(this.urlParams.rid, searchTerm, {
                sort: sort || { ts: -1 },
                skip: offset,
                limit: count,
            });
            const [messages, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return server_1.API.v1.success({
                messages: yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)(messages, this.userId),
                offset,
                count,
                total,
            });
        });
    },
});
