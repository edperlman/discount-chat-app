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
exports.findVisitorInfo = findVisitorInfo;
exports.findVisitedPages = findVisitedPages;
exports.findChatHistory = findChatHistory;
exports.searchChats = searchChats;
exports.findVisitorsToAutocomplete = findVisitorsToAutocomplete;
exports.findVisitorsByEmailOrPhoneOrNameOrUsernameOrCustomField = findVisitorsByEmailOrPhoneOrNameOrUsernameOrCustomField;
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../../lib/callbacks");
const canAccessRoom_1 = require("../../../../authorization/server/functions/canAccessRoom");
function findVisitorInfo(_a) {
    return __awaiter(this, arguments, void 0, function* ({ visitorId }) {
        const visitor = yield models_1.LivechatVisitors.findOneEnabledById(visitorId);
        if (!visitor) {
            throw new Error('visitor-not-found');
        }
        return {
            visitor,
        };
    });
}
function findVisitedPages(_a) {
    return __awaiter(this, arguments, void 0, function* ({ roomId, pagination: { offset, count, sort }, }) {
        const room = yield models_1.LivechatRooms.findOneById(roomId);
        if (!room) {
            throw new Error('invalid-room');
        }
        const { cursor, totalCount } = models_1.Messages.findPaginatedByRoomIdAndType(room._id, 'livechat_navigation_history', {
            sort: sort || { ts: -1 },
            skip: offset,
            limit: count,
        });
        const [pages, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            pages,
            count: pages.length,
            offset,
            total,
        };
    });
}
function findChatHistory(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, roomId, visitorId, pagination: { offset, count, sort }, }) {
        const room = yield models_1.LivechatRooms.findOneById(roomId);
        if (!room) {
            throw new Error('invalid-room');
        }
        if (!(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, { _id: userId }))) {
            throw new Error('error-not-allowed');
        }
        const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
        const { cursor, totalCount } = models_1.LivechatRooms.findPaginatedByVisitorId(visitorId, {
            sort: sort || { ts: -1 },
            skip: offset,
            limit: count,
        }, extraQuery);
        const [history, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            history,
            count: history.length,
            offset,
            total,
        };
    });
}
function searchChats(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, roomId, visitorId, searchText, closedChatsOnly, servedChatsOnly: served, source, pagination: { offset, count, sort }, }) {
        var _b;
        const room = yield models_1.LivechatRooms.findOneById(roomId);
        if (!room) {
            throw new Error('invalid-room');
        }
        if (!(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, { _id: userId }))) {
            throw new Error('error-not-allowed');
        }
        const options = {
            sort: sort || { ts: -1 },
            skip: offset,
            limit: count,
        };
        const [total] = yield models_1.LivechatRooms.findRoomsByVisitorIdAndMessageWithCriteria({
            visitorId,
            open: closedChatsOnly !== 'true',
            served: served === 'true',
            searchText,
            onlyCount: true,
            source,
        }).toArray();
        const cursor = yield models_1.LivechatRooms.findRoomsByVisitorIdAndMessageWithCriteria({
            visitorId,
            open: closedChatsOnly !== 'true',
            served: served === 'true',
            searchText,
            options,
            source,
        });
        const history = yield cursor.toArray();
        return {
            history,
            count: history.length,
            offset,
            total: (_b = total === null || total === void 0 ? void 0 : total.count) !== null && _b !== void 0 ? _b : 0,
        };
    });
}
function findVisitorsToAutocomplete(_a) {
    return __awaiter(this, arguments, void 0, function* ({ selector, }) {
        const { exceptions = [], conditions = {} } = selector;
        const options = {
            projection: {
                _id: 1,
                name: 1,
                username: 1,
            },
            limit: 10,
            sort: {
                name: 1,
            },
        };
        const items = yield models_1.LivechatVisitors.findByNameRegexWithExceptionsAndConditions(selector.term, exceptions, conditions, options).toArray();
        return {
            items,
        };
    });
}
function findVisitorsByEmailOrPhoneOrNameOrUsernameOrCustomField(_a) {
    return __awaiter(this, arguments, void 0, function* ({ emailOrPhone, nameOrUsername, pagination: { offset, count, sort }, }) {
        const allowedCF = yield models_1.LivechatCustomField.findMatchingCustomFields('visitor', true, { projection: { _id: 1 } })
            .map((cf) => cf._id)
            .toArray();
        const { cursor, totalCount } = yield models_1.LivechatVisitors.findPaginatedVisitorsByEmailOrPhoneOrNameOrUsernameOrCustomField(emailOrPhone, nameOrUsername, allowedCF, {
            sort: sort || { ts: -1 },
            skip: offset,
            limit: count,
            projection: {
                username: 1,
                name: 1,
                phone: 1,
                livechatData: 1,
                visitorEmails: 1,
                lastChat: 1,
            },
        });
        const [visitors, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            visitors,
            count: visitors.length,
            offset,
            total,
        };
    });
}
