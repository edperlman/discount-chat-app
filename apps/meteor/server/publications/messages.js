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
exports.extractTimestampFromCursor = extractTimestampFromCursor;
exports.mountCursorQuery = mountCursorQuery;
exports.mountCursorFromMessage = mountCursorFromMessage;
exports.mountNextCursor = mountNextCursor;
exports.mountPreviousCursor = mountPreviousCursor;
exports.handleWithoutPagination = handleWithoutPagination;
exports.handleCursorPagination = handleCursorPagination;
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const canAccessRoom_1 = require("../../app/authorization/server/functions/canAccessRoom");
function extractTimestampFromCursor(cursor) {
    const timestamp = parseInt(cursor, 10);
    if (isNaN(timestamp) || new Date(timestamp).toString() === 'Invalid Date') {
        throw new Error('Invalid Date');
    }
    return new Date(timestamp);
}
function mountCursorQuery({ next, previous, count }) {
    const options = Object.assign({ sort: { _updatedAt: 1 } }, (next || previous ? { limit: count + 1 } : {}));
    if (next) {
        return { query: { $gt: extractTimestampFromCursor(next) }, options };
    }
    if (previous) {
        return { query: { $lt: extractTimestampFromCursor(previous) }, options: Object.assign(Object.assign({}, options), { sort: { _updatedAt: -1 } }) };
    }
    return { query: { $gt: new Date(0) }, options };
}
function mountCursorFromMessage(message, type) {
    if (type === 'UPDATED' && message._updatedAt) {
        return `${message._updatedAt.getTime()}`;
    }
    if (type === 'DELETED' && message._deletedAt) {
        return `${message._deletedAt.getTime()}`;
    }
    throw new meteor_1.Meteor.Error('error-cursor-not-found', 'Cursor not found', { method: 'messages/get' });
}
function mountNextCursor(messages, count, type, next, previous) {
    if (messages.length === 0) {
        return null;
    }
    if (previous) {
        return mountCursorFromMessage(messages[0], type);
    }
    if (messages.length <= count && next) {
        return null;
    }
    if (messages.length > count && next) {
        return mountCursorFromMessage(messages[messages.length - 2], type);
    }
    return mountCursorFromMessage(messages[messages.length - 1], type);
}
function mountPreviousCursor(messages, count, type, next, previous) {
    if (messages.length === 0) {
        return null;
    }
    if (messages.length <= count && next) {
        return mountCursorFromMessage(messages[0], type);
    }
    if (messages.length > count && next) {
        return mountCursorFromMessage(messages[0], type);
    }
    if (messages.length <= count && previous) {
        return null;
    }
    if (messages.length > count && previous) {
        return mountCursorFromMessage(messages[messages.length - 2], type);
    }
    return mountCursorFromMessage(messages[0], type);
}
function handleWithoutPagination(rid, lastUpdate) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = { $gt: lastUpdate };
        const options = { sort: { ts: -1 } };
        const [updatedMessages, deletedMessages] = yield Promise.all([
            models_1.Messages.findForUpdates(rid, query, options).toArray(),
            models_1.Messages.trashFindDeletedAfter(lastUpdate, { rid }, Object.assign({ projection: { _id: 1, _deletedAt: 1 } }, options)).toArray(),
        ]);
        return {
            updated: updatedMessages,
            deleted: deletedMessages,
        };
    });
}
function handleCursorPagination(type, rid, count, next, previous) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { query, options } = mountCursorQuery({ next, previous, count });
        const response = type === 'UPDATED'
            ? yield models_1.Messages.findForUpdates(rid, query, options).toArray()
            : ((_a = (yield models_1.Messages.trashFind({ rid, _deletedAt: query }, Object.assign({ projection: { _id: 1, _deletedAt: 1 } }, options)).toArray())) !== null && _a !== void 0 ? _a : []);
        const cursor = {
            next: mountNextCursor(response, count, type, next, previous),
            previous: mountPreviousCursor(response, count, type, next, previous),
        };
        if (response.length > count) {
            response.pop();
        }
        return {
            [type.toLowerCase()]: response,
            cursor,
        };
    });
}
meteor_1.Meteor.methods({
    'messages/get'(rid_1, _a) {
        return __awaiter(this, arguments, void 0, function* (rid, { lastUpdate, latestDate = new Date(), oldestDate, inclusive = false, count = 20, unreads = false, next, previous, type }) {
            (0, check_1.check)(rid, String);
            const fromId = meteor_1.Meteor.userId();
            if (!fromId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'messages/get' });
            }
            if (!rid) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'messages/get' });
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(rid, fromId))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'messages/get' });
            }
            if (type && !['UPDATED', 'DELETED'].includes(type)) {
                throw new meteor_1.Meteor.Error('error-type-param-not-supported', 'The "type" parameter must be either "UPDATED" or "DELETED"');
            }
            if ((next || previous) && !type) {
                throw new meteor_1.Meteor.Error('error-type-param-required', 'The "type" parameter is required when using the "next" or "previous" parameters');
            }
            if (next && previous) {
                throw new meteor_1.Meteor.Error('error-cursor-conflict', 'You cannot provide both "next" and "previous" parameters');
            }
            if ((next || previous) && lastUpdate) {
                throw new meteor_1.Meteor.Error('error-cursor-and-lastUpdate-conflict', 'The attributes "next", "previous" and "lastUpdate" cannot be used together');
            }
            const hasCursorPagination = !!((next || previous) && count !== null && type);
            if (!hasCursorPagination && !lastUpdate) {
                return meteor_1.Meteor.callAsync('getChannelHistory', {
                    rid,
                    latest: latestDate,
                    oldest: oldestDate,
                    inclusive,
                    count,
                    unreads,
                });
            }
            if (lastUpdate) {
                return handleWithoutPagination(rid, lastUpdate);
            }
            if (!type) {
                throw new meteor_1.Meteor.Error('error-param-required', 'The "type" or "lastUpdate" parameters must be provided');
            }
            return handleCursorPagination(type, rid, count, next, previous);
        });
    },
});
