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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesRaw = void 0;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const BaseRaw_1 = require("./BaseRaw");
const constants_1 = require("../../../app/otr/lib/constants");
const readSecondaryPreferred_1 = require("../../database/readSecondaryPreferred");
class MessagesRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'message', trash);
    }
    modelIndexes() {
        return [
            { key: { rid: 1, ts: 1, _updatedAt: 1 } },
            { key: { ts: 1 } },
            { key: { 'u._id': 1 } },
            { key: { editedAt: 1 }, sparse: true },
            { key: { 'editedBy._id': 1 }, sparse: true },
            { key: { 'rid': 1, 't': 1, 'u._id': 1 } },
            { key: { expireAt: 1 }, expireAfterSeconds: 0 },
            { key: { msg: 'text' } },
            { key: { 'file._id': 1 }, sparse: true },
            { key: { 'mentions.username': 1 }, sparse: true },
            { key: { pinned: 1 }, sparse: true },
            { key: { location: '2dsphere' } },
            { key: { slackTs: 1, slackBotId: 1 }, sparse: true },
            { key: { unread: 1 }, sparse: true },
            { key: { 'pinnedBy._id': 1 }, sparse: true },
            { key: { 'starred._id': 1 }, sparse: true },
            // discussions
            { key: { drid: 1 }, sparse: true },
            // threads
            { key: { tmid: 1 }, sparse: true },
            { key: { tcount: 1, tlm: 1 }, sparse: true },
            { key: { rid: 1, tlm: -1 }, partialFilterExpression: { tcount: { $exists: true } } }, // used for the List Threads
            { key: { rid: 1, tcount: 1 } }, // used for the List Threads Count
            // livechat
            { key: { 'navigation.token': 1 }, sparse: true },
            { key: { 'federation.eventId': 1 }, sparse: true },
            { key: { t: 1 }, sparse: true },
        ];
    }
    findVisibleByMentionAndRoomId(username, rid, options) {
        const query = {
            '_hidden': { $ne: true },
            'mentions.username': username,
            rid,
        };
        return this.find(query, options);
    }
    findPaginatedVisibleByMentionAndRoomId(username, rid, options) {
        const query = {
            '_hidden': { $ne: true },
            'mentions.username': username,
            rid,
        };
        return this.findPaginated(query, options);
    }
    findStarredByUserAtRoom(userId, roomId, options) {
        const query = {
            '_hidden': { $ne: true },
            'starred._id': userId,
            'rid': roomId,
        };
        return this.findPaginated(query, options);
    }
    findPaginatedByRoomIdAndType(roomId, type, options = {}) {
        const query = {
            rid: roomId,
            t: type,
        };
        return this.findPaginated(query, options);
    }
    // TODO: do we need this? currently not used anywhere
    findDiscussionsByRoom(rid, options) {
        const query = { rid, drid: { $exists: true } };
        return this.find(query, options);
    }
    findDiscussionsByRoomAndText(rid, text, options) {
        const query = {
            rid,
            drid: { $exists: true },
            msg: new RegExp((0, string_helpers_1.escapeRegExp)(text), 'i'),
        };
        return this.findPaginated(query, options);
    }
    findAllNumberOfTransferredRooms({ start, end, departmentId, onlyCount = false, options = {}, }) {
        // FIXME: aggregation type definitions
        const match = {
            $match: {
                t: 'livechat_transfer_history',
                ts: { $gte: new Date(start), $lte: new Date(end) },
            },
        };
        const lookup = {
            $lookup: {
                from: 'rocketchat_room',
                localField: 'rid',
                foreignField: '_id',
                as: 'room',
            },
        };
        const unwind = {
            $unwind: {
                path: '$room',
                preserveNullAndEmptyArrays: true,
            },
        };
        const group = {
            $group: {
                _id: {
                    _id: null,
                    departmentId: '$room.departmentId',
                },
                numberOfTransferredRooms: { $sum: 1 },
            },
        };
        const project = {
            $project: {
                _id: { $ifNull: ['$_id.departmentId', null] },
                numberOfTransferredRooms: 1,
            },
        };
        const firstParams = [match, lookup, unwind];
        if (departmentId) {
            firstParams.push({
                $match: {
                    'room.departmentId': departmentId,
                },
            });
        }
        const sort = { $sort: options.sort || { name: 1 } };
        const params = [...firstParams, group, project, sort];
        if (onlyCount) {
            params.push({ $count: 'total' });
            return this.col.aggregate(params, { readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() });
        }
        if (options.offset) {
            params.push({ $skip: options.offset });
        }
        if (options.count) {
            params.push({ $limit: options.count });
        }
        return this.col.aggregate(params, {
            allowDiskUse: true,
            readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)(),
        });
    }
    getTotalOfMessagesSentByDate({ start, end, options = {} }) {
        const params = [
            { $match: { t: { $exists: false }, ts: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: {
                        rid: '$rid',
                        date: {
                            $dateToString: { format: '%Y%m%d', date: '$ts' },
                        },
                    },
                    messages: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: '$_id.rid',
                    data: {
                        $push: {
                            date: '$_id.date',
                            messages: '$messages',
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'rocketchat_room',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'room',
                },
            },
            {
                $unwind: {
                    path: '$room',
                },
            },
            {
                $project: {
                    data: '$data',
                    room: {
                        _id: '$room._id',
                        name: {
                            $cond: [{ $ifNull: ['$room.fname', false] }, '$room.fname', '$room.name'],
                        },
                        t: '$room.t',
                        usernames: {
                            $cond: [{ $ifNull: ['$room.usernames', false] }, '$room.usernames', []],
                        },
                    },
                    type: 'messages',
                },
            },
            {
                $unwind: {
                    path: '$data',
                },
            },
            {
                $project: {
                    _id: 0,
                    date: '$data.date',
                    room: 1,
                    type: 1,
                    messages: '$data.messages',
                },
            },
        ];
        if (options.sort) {
            params.push({ $sort: options.sort });
        }
        if (options.count) {
            params.push({ $limit: options.count });
        }
        return this.col.aggregate(params, { allowDiskUse: true, readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() }).toArray();
    }
    findLivechatClosedMessages(rid, searchTerm, options) {
        return this.findPaginated(Object.assign({ rid, $or: [{ t: { $exists: false } }, { t: 'livechat-close' }] }, (searchTerm && { msg: new RegExp((0, string_helpers_1.escapeRegExp)(searchTerm), 'ig') })), options);
    }
    findLivechatClosingMessage(rid, options) {
        return this.findOne({
            rid,
            t: 'livechat-close',
        }, options);
    }
    findLivechatMessages(rid, options) {
        return this.find({
            rid,
            $or: [{ t: { $exists: false } }, { t: 'livechat-close' }],
        }, options);
    }
    findVisibleByRoomIdNotContainingTypesBeforeTs(roomId, types, ts, showSystemMessages, options, showThreadMessages = true) {
        const query = Object.assign({ _hidden: {
                $ne: true,
            }, rid: roomId, ts: { $lt: ts } }, (!showThreadMessages && {
            $or: [
                {
                    tmid: { $exists: false },
                },
                {
                    tshow: true,
                },
            ],
        }));
        if (types.length > 0) {
            query.t = { $nin: types };
        }
        if (!showSystemMessages) {
            query.t = { $exists: false };
        }
        return this.find(query, options);
    }
    findVisibleByRoomIdNotContainingTypesAndUsers(roomId, types, users, options, showThreadMessages = true) {
        const query = Object.assign(Object.assign(Object.assign({ _hidden: {
                $ne: true,
            } }, (Array.isArray(users) && users.length > 0 && { 'u._id': { $nin: users } })), { rid: roomId }), (!showThreadMessages && {
            $or: [
                {
                    tmid: { $exists: false },
                },
                {
                    tshow: true,
                },
            ],
        }));
        if (types.length > 0) {
            query.t = { $nin: types };
        }
        return this.find(query, options);
    }
    findLivechatMessagesWithoutTypes(rid, ignoredTypes, showSystemMessages, options) {
        const query = {
            rid,
        };
        if (ignoredTypes.length > 0) {
            query.t = { $nin: ignoredTypes };
        }
        if (!showSystemMessages) {
            query.t = { $exists: false };
        }
        return this.find(query, options);
    }
    setBlocksById(_id, blocks) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({ _id }, {
                $set: {
                    blocks,
                },
            });
        });
    }
    addBlocksById(_id, blocks) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({ _id }, { $addToSet: { blocks: { $each: blocks } } });
        });
    }
    countRoomsWithStarredMessages(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryResult = yield this.col
                .aggregate([
                { $match: { 'starred._id': { $exists: true } } },
                { $group: { _id: '$rid' } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                    },
                },
            ], options)
                .next();
            return (queryResult === null || queryResult === void 0 ? void 0 : queryResult.total) || 0;
        });
    }
    countRoomsWithMessageType(type, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryResult = yield this.col
                .aggregate([
                { $match: { t: type } },
                { $group: { _id: '$rid' } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                    },
                },
            ], options)
                .next();
            return (queryResult === null || queryResult === void 0 ? void 0 : queryResult.total) || 0;
        });
    }
    countByType(type, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.col.countDocuments({ t: type }, options);
        });
    }
    countRoomsWithPinnedMessages(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryResult = yield this.col
                .aggregate([
                { $match: { pinned: true } },
                { $group: { _id: '$rid' } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                    },
                },
            ], options)
                .next();
            return (queryResult === null || queryResult === void 0 ? void 0 : queryResult.total) || 0;
        });
    }
    findPinned(options) {
        const query = {
            t: { $ne: 'rm' },
            _hidden: { $ne: true },
            pinned: true,
        };
        return this.find(query, options);
    }
    countPinned(options) {
        const query = {
            t: { $ne: 'rm' },
            _hidden: { $ne: true },
            pinned: true,
        };
        return this.countDocuments(query, options);
    }
    findPaginatedPinnedByRoom(roomId, options) {
        const query = {
            t: { $ne: 'rm' },
            _hidden: { $ne: true },
            pinned: true,
            rid: roomId,
        };
        return this.findPaginated(query, options);
    }
    findStarred(options) {
        const query = {
            '_hidden': { $ne: true },
            'starred._id': { $exists: true },
        };
        return this.find(query, options);
    }
    countStarred(options) {
        const query = {
            '_hidden': { $ne: true },
            'starred._id': { $exists: true },
        };
        return this.countDocuments(query, options);
    }
    setFederationReactionEventId(username, _id, reaction, federationEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({ _id }, {
                $set: {
                    [`reactions.${reaction}.federationReactionEventIds.${federationEventId}`]: username,
                },
            });
        });
    }
    unsetFederationReactionEventId(federationEventId, _id, reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({ _id }, {
                $unset: {
                    [`reactions.${reaction}.federationReactionEventIds.${federationEventId}`]: 1,
                },
            });
        });
    }
    findOneByFederationId(federationEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({ 'federation.eventId': federationEventId });
        });
    }
    setFederationEventIdById(_id, federationEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({ _id }, {
                $set: {
                    'federation.eventId': federationEventId,
                },
            });
        });
    }
    findOneByFederationIdAndUsernameOnReactions(federationEventId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.col
                .aggregate([
                {
                    $match: {
                        t: { $ne: 'rm' },
                    },
                },
                {
                    $project: {
                        document: '$$ROOT',
                        reactions: { $objectToArray: '$reactions' },
                    },
                },
                {
                    $unwind: {
                        path: '$reactions',
                    },
                },
                {
                    $match: {
                        $and: [
                            { 'reactions.v.usernames': { $in: [username] } },
                            { [`reactions.v.federationReactionEventIds.${federationEventId}`]: username },
                        ],
                    },
                },
                { $replaceRoot: { newRoot: '$document' } },
            ], { readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() })
                .toArray())[0];
        });
    }
    removeByRoomId(roomId) {
        return this.deleteMany({ rid: roomId });
    }
    setReactions(messageId, reactions) {
        return this.updateOne({ _id: messageId }, { $set: { reactions } });
    }
    keepHistoryForToken(token) {
        return this.updateMany({
            'navigation.token': token,
            'expireAt': {
                $exists: true,
            },
        }, {
            $unset: {
                expireAt: 1,
            },
        });
    }
    setRoomIdByToken(token, rid) {
        return this.updateMany({
            'navigation.token': token,
            // @ts-expect-error - mongo allows it, but types don't :(
            'rid': null,
        }, {
            $set: {
                rid,
            },
        });
    }
    unsetReactions(messageId) {
        return this.updateOne({ _id: messageId }, { $unset: { reactions: 1 } });
    }
    deleteOldOTRMessages(roomId, ts) {
        const query = {
            rid: roomId,
            t: {
                $in: [
                    'otr',
                    constants_1.otrSystemMessages.USER_JOINED_OTR,
                    constants_1.otrSystemMessages.USER_REQUESTED_OTR_KEY_REFRESH,
                    constants_1.otrSystemMessages.USER_KEY_REFRESHED_SUCCESSFULLY,
                ],
            },
            ts: { $lte: ts },
        };
        return this.col.deleteMany(query);
    }
    addTranslations(messageId, translations, providerName) {
        const updateObj = { translationProvider: providerName };
        Object.keys(translations).forEach((key) => {
            const translation = translations[key];
            updateObj[`translations.${key}`] = translation;
        });
        return this.updateOne({ _id: messageId }, { $set: updateObj });
    }
    addAttachmentTranslations(messageId, attachmentIndex, translations) {
        const updateObj = {};
        Object.keys(translations).forEach((key) => {
            const translation = translations[key];
            updateObj[`attachments.${attachmentIndex}.translations.${key}`] = translation;
        });
        return this.updateOne({ _id: messageId }, { $set: updateObj });
    }
    setImportFileRocketChatAttachment(importFileId, rocketChatUrl, attachment) {
        const query = {
            '_importFile.id': importFileId,
        };
        return this.updateMany(query, {
            $set: {
                '_importFile.rocketChatUrl': rocketChatUrl,
                '_importFile.downloaded': true,
            },
            $addToSet: {
                attachments: attachment,
            },
        });
    }
    countVisibleByRoomIdBetweenTimestampsInclusive(roomId, afterTimestamp, beforeTimestamp) {
        const query = {
            _hidden: {
                $ne: true,
            },
            rid: roomId,
            ts: {
                $gte: afterTimestamp,
                $lte: beforeTimestamp,
            },
        };
        return this.col.countDocuments(query);
    }
    // FIND
    findByMention(username, options) {
        const query = { 'mentions.username': username };
        return this.find(query, options);
    }
    findFilesByUserId(userId, options = {}) {
        const query = {
            'u._id': userId,
            'file._id': { $exists: true },
        };
        return this.find(query, Object.assign({ projection: { 'file._id': 1 } }, options));
    }
    findFilesByRoomIdPinnedTimestampAndUsers(rid, excludePinned, ignoreDiscussion = true, ts, users = [], ignoreThreads = true, options = {}) {
        const query = Object.assign(Object.assign(Object.assign(Object.assign({ rid,
            ts, 'file._id': { $exists: true } }, (excludePinned ? { pinned: { $ne: true } } : {})), (ignoreThreads ? { tmid: { $exists: false }, tcount: { $exists: false } } : {})), (ignoreDiscussion ? { drid: { $exists: false } } : {})), (users.length ? { 'u.username': { $in: users } } : {}));
        return this.find(query, Object.assign({ projection: { 'file._id': 1 } }, options));
    }
    findDiscussionByRoomIdPinnedTimestampAndUsers(rid, excludePinned, ts, users = [], options = {}) {
        const query = Object.assign(Object.assign({ rid,
            ts, drid: { $exists: true } }, (excludePinned ? { pinned: { $ne: true } } : {})), (users.length ? { 'u.username': { $in: users } } : {}));
        return this.find(query, options);
    }
    findVisibleByRoomId(rid, options) {
        const query = {
            _hidden: {
                $ne: true,
            },
            rid,
        };
        return this.find(query, options);
    }
    findVisibleByIds(ids, options) {
        const query = {
            _id: { $in: ids },
            _hidden: {
                $ne: true,
            },
        };
        return this.find(query, options);
    }
    findVisibleThreadByThreadId(tmid, options) {
        const query = {
            _hidden: {
                $ne: true,
            },
            tmid,
        };
        return this.find(query, options);
    }
    findVisibleByRoomIdNotContainingTypes(roomId, types, options, showThreadMessages = true) {
        const query = Object.assign(Object.assign({ _hidden: {
                $ne: true,
            }, rid: roomId }, (!showThreadMessages && {
            $or: [
                {
                    tmid: { $exists: false },
                },
                {
                    tshow: true,
                },
            ],
        })), (Array.isArray(types) &&
            types.length > 0 && {
            t: { $nin: types },
        }));
        return this.find(query, options);
    }
    findVisibleByRoomIdAfterTimestamp(roomId, timestamp, options) {
        const query = {
            _hidden: {
                $ne: true,
            },
            rid: roomId,
            ts: {
                $gt: timestamp,
            },
        };
        return this.find(query, options);
    }
    findForUpdates(roomId, timestamp, options) {
        const query = {
            rid: roomId,
            _hidden: { $ne: true },
            _updatedAt: timestamp,
        };
        return this.find(query, options);
    }
    findVisibleByRoomIdBeforeTimestamp(roomId, timestamp, options) {
        const query = {
            _hidden: {
                $ne: true,
            },
            rid: roomId,
            ts: {
                $lt: timestamp,
            },
        };
        return this.find(query, options);
    }
    findVisibleByRoomIdBeforeTimestampNotContainingTypes(roomId, timestamp, types, options, showThreadMessages = true, inclusive = false) {
        const query = Object.assign(Object.assign({ _hidden: {
                $ne: true,
            }, rid: roomId, ts: {
                [inclusive ? '$lte' : '$lt']: timestamp,
            } }, (!showThreadMessages && {
            $or: [
                {
                    tmid: { $exists: false },
                },
                {
                    tshow: true,
                },
            ],
        })), (Array.isArray(types) &&
            types.length > 0 && {
            t: { $nin: types },
        }));
        return this.find(query, options);
    }
    findVisibleByRoomIdBetweenTimestampsNotContainingTypes(roomId, afterTimestamp, beforeTimestamp, types, options = {}, showThreadMessages = true, inclusive = false) {
        const query = Object.assign(Object.assign({ _hidden: {
                $ne: true,
            }, rid: roomId, ts: {
                [inclusive ? '$gte' : '$gt']: afterTimestamp,
                [inclusive ? '$lte' : '$lt']: beforeTimestamp,
            } }, (!showThreadMessages && {
            $or: [
                {
                    tmid: { $exists: false },
                },
                {
                    tshow: true,
                },
            ],
        })), (Array.isArray(types) &&
            types.length > 0 && {
            t: { $nin: types },
        }));
        return this.find(query, options);
    }
    countVisibleByRoomIdBetweenTimestampsNotContainingTypes(roomId, afterTimestamp, beforeTimestamp, types, showThreadMessages = true, inclusive = false) {
        const query = Object.assign(Object.assign({ _hidden: {
                $ne: true,
            }, rid: roomId, ts: {
                [inclusive ? '$gte' : '$gt']: afterTimestamp,
                [inclusive ? '$lte' : '$lt']: beforeTimestamp,
            } }, (!showThreadMessages && {
            $or: [
                {
                    tmid: { $exists: false },
                },
                {
                    tshow: true,
                },
            ],
        })), (Array.isArray(types) &&
            types.length > 0 && {
            t: { $nin: types },
        }));
        return this.col.countDocuments(query);
    }
    getLastTimestamp() {
        return __awaiter(this, arguments, void 0, function* (options = { projection: { _id: 0, ts: 1 } }) {
            options.sort = { ts: -1 };
            options.limit = 1;
            const [message] = yield this.find({}, options).toArray();
            return message === null || message === void 0 ? void 0 : message.ts;
        });
    }
    findByRoomIdAndMessageIds(rid, messageIds, options) {
        const query = {
            rid,
            _id: {
                $in: messageIds,
            },
        };
        return this.find(query, options);
    }
    findOneBySlackBotIdAndSlackTs(slackBotId, slackTs) {
        const query = {
            slackBotId,
            slackTs,
        };
        return this.findOne(query);
    }
    findOneBySlackTs(slackTs) {
        const query = { slackTs };
        return this.findOne(query);
    }
    findOneByRoomIdAndMessageId(rid, messageId, options) {
        const query = {
            rid,
            _id: messageId,
        };
        return this.findOne(query, options);
    }
    getLastVisibleUserMessageSentByRoomId(rid, messageId) {
        const query = Object.assign({ rid, _hidden: { $ne: true }, $or: [{ t: 'e2e' }, { t: { $exists: false }, tmid: { $exists: false } }, { t: { $exists: false }, tshow: true }] }, (messageId && { _id: { $ne: messageId } }));
        const options = {
            sort: {
                ts: -1,
            },
        };
        return this.findOne(query, options);
    }
    cloneAndSaveAsHistoryByRecord(record, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id: _ } = record, nRecord = __rest(record, ["_id"]);
            return this.insertOne(Object.assign(Object.assign({}, nRecord), { _hidden: true, 
                // @ts-expect-error - mongo allows it, but types don't :(
                parent: record._id, editedAt: new Date(), editedBy: {
                    _id: user._id,
                    username: user.username,
                } }));
        });
    }
    cloneAndSaveAsHistoryById(_id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield this.findOneById(_id);
            if (!record) {
                throw new Error('Record not found');
            }
            return this.cloneAndSaveAsHistoryByRecord(record, user);
        });
    }
    // UPDATE
    setHiddenById(_id, hidden) {
        if (hidden == null) {
            hidden = true;
        }
        const query = { _id };
        const update = {
            $set: {
                _hidden: hidden,
            },
        };
        return this.updateOne(query, update);
    }
    setHiddenByIds(ids, hidden) {
        if (hidden == null) {
            hidden = true;
        }
        const query = { _id: { $in: ids } };
        const update = {
            $set: {
                _hidden: hidden,
            },
        };
        return this.updateMany(query, update);
    }
    setAsDeletedByIdAndUser(_id, user) {
        const query = { _id };
        const update = {
            $set: {
                msg: '',
                t: 'rm',
                urls: [],
                mentions: [],
                attachments: [],
                reactions: {},
                editedAt: new Date(),
                editedBy: {
                    _id: user._id,
                    username: user.username,
                },
            },
            $unset: {
                md: 1,
                blocks: 1,
                tshow: 1,
            },
        };
        return this.updateOne(query, update);
    }
    setAsDeletedByIdsAndUser(ids, user) {
        const query = { _id: { $in: ids } };
        const update = {
            $set: {
                msg: '',
                t: 'rm',
                urls: [],
                mentions: [],
                attachments: [],
                reactions: {},
                editedAt: new Date(),
                editedBy: {
                    _id: user._id,
                    username: user.username,
                },
            },
            $unset: {
                md: 1,
                blocks: 1,
                tshow: 1,
            },
        };
        return this.updateMany(query, update);
    }
    setPinnedByIdAndUserId(_id, pinnedBy, pinned, pinnedAt) {
        if (pinned == null) {
            pinned = true;
        }
        if (pinnedAt == null) {
            pinnedAt = undefined;
        }
        const query = { _id };
        const update = {
            $set: {
                pinned,
                pinnedAt: pinnedAt || new Date(),
                pinnedBy,
            },
        };
        return this.updateOne(query, update);
    }
    setUrlsById(_id, urls) {
        const query = { _id };
        const update = {
            $set: {
                urls,
            },
        };
        return this.updateOne(query, update);
    }
    updateAllUsernamesByUserId(userId, username) {
        const query = { 'u._id': userId };
        const update = {
            $set: {
                'u.username': username,
            },
        };
        return this.updateMany(query, update);
    }
    updateUsernameOfEditByUserId(userId, username) {
        const query = { 'editedBy._id': userId };
        const update = {
            $set: {
                'editedBy.username': username,
            },
        };
        return this.updateMany(query, update);
    }
    updateUsernameAndMessageOfMentionByIdAndOldUsername(_id, oldUsername, newUsername, newMessage) {
        const query = {
            _id,
            'mentions.username': oldUsername,
        };
        const update = {
            $set: {
                'mentions.$.username': newUsername,
                'msg': newMessage,
            },
            $unset: {
                md: 1,
            },
        };
        return this.updateOne(query, update);
    }
    updateUserStarById(_id, userId, starred) {
        let update;
        const query = { _id };
        if (starred) {
            update = {
                $addToSet: {
                    starred: { _id: userId },
                },
            };
        }
        else {
            update = {
                $pull: {
                    starred: { _id: userId },
                },
            };
        }
        return this.updateOne(query, update);
    }
    setMessageAttachments(_id, attachments) {
        const query = { _id };
        const update = {
            $set: {
                attachments,
            },
        };
        return this.updateOne(query, update);
    }
    setSlackBotIdAndSlackTs(_id, slackBotId, slackTs) {
        const query = { _id };
        const update = {
            $set: {
                slackBotId,
                slackTs,
            },
        };
        return this.updateOne(query, update);
    }
    unlinkUserId(userId, newUserId, newUsername, newNameAlias) {
        const query = {
            'u._id': userId,
        };
        const update = {
            $set: {
                'alias': newNameAlias,
                'u._id': newUserId,
                'u.username': newUsername,
                'u.name': undefined,
            },
        };
        return this.updateMany(query, update);
    }
    // INSERT
    createWithTypeRoomIdMessageUserAndUnread(type, rid, message, user, unread, extraData) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = Object.assign({ t: type, rid, ts: new Date(), msg: message, u: {
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                }, groupable: false }, (unread && { unread: true }));
            const data = Object.assign(record, extraData);
            return this.insertOne(data);
        });
    }
    // REMOVE
    removeByRoomIds(rids) {
        return this.deleteMany({ rid: { $in: rids } });
    }
    findThreadsByRoomIdPinnedTimestampAndUsers({ rid, pinned, ignoreDiscussion = true, ts, users = [], }, options) {
        const query = Object.assign({ rid,
            ts, tlm: { $exists: true }, tcount: { $exists: true } }, (users.length > 0 && { 'u.username': { $in: users } }));
        if (pinned) {
            query.pinned = { $ne: true };
        }
        if (ignoreDiscussion) {
            query.drid = { $exists: false };
        }
        return this.find(query, options);
    }
    findByIdPinnedTimestampLimitAndUsers(rid_1, ignorePinned_1) {
        return __awaiter(this, arguments, void 0, function* (rid, ignorePinned, ignoreDiscussion = true, ts, limit, users = [], ignoreThreads = true) {
            const query = Object.assign({ rid,
                ts }, (users.length > 0 && { 'u.username': { $in: users } }));
            if (ignorePinned) {
                query.pinned = { $ne: true };
            }
            if (ignoreDiscussion) {
                query.drid = { $exists: false };
            }
            if (ignoreThreads) {
                query.tmid = { $exists: false };
                query.tcount = { $exists: false };
            }
            return (yield this.find(query, {
                projection: {
                    _id: 1,
                },
                limit,
            }).toArray()).map(({ _id }) => _id);
        });
    }
    removeByIdPinnedTimestampLimitAndUsers(rid_1, ignorePinned_1) {
        return __awaiter(this, arguments, void 0, function* (rid, ignorePinned, ignoreDiscussion = true, ts, limit, users = [], ignoreThreads = true, selectedMessageIds = []) {
            const query = Object.assign({ rid,
                ts }, (users.length > 0 && { 'u.username': { $in: users } }));
            if (ignorePinned) {
                query.pinned = { $ne: true };
            }
            if (ignoreDiscussion) {
                query.drid = { $exists: false };
            }
            if (ignoreThreads) {
                query.tmid = { $exists: false };
                query.tcount = { $exists: false };
            }
            const notCountedMessages = (yield this.find(Object.assign(Object.assign({}, query), { $or: [{ _hidden: true }, { editedAt: { $exists: true }, editedBy: { $exists: true }, t: 'rm' }] }), {
                projection: {
                    _id: 1,
                },
                limit,
            }).toArray()).length;
            if (!limit) {
                const count = (yield this.deleteMany(query)).deletedCount - notCountedMessages;
                return count;
            }
            const count = (yield this.deleteMany({
                _id: {
                    $in: selectedMessageIds,
                },
            })).deletedCount - notCountedMessages;
            return count;
        });
    }
    removeByUserId(userId) {
        const query = { 'u._id': userId };
        return this.deleteMany(query);
    }
    getMessageByFileId(fileID) {
        return this.findOne({ 'file._id': fileID });
    }
    getMessageByFileIdAndUsername(fileID, userId) {
        const query = {
            'file._id': fileID,
            'u._id': userId,
        };
        const options = {
            projection: {
                unread: 0,
                mentions: 0,
                channels: 0,
                groupable: 0,
            },
        };
        return this.findOne(query, options);
    }
    setVisibleMessagesAsRead(rid, until) {
        return this.updateMany({
            rid,
            unread: true,
            ts: { $lt: until },
            $or: [
                {
                    tmid: { $exists: false },
                },
                {
                    tshow: true,
                },
            ],
        }, {
            $unset: {
                unread: 1,
            },
        });
    }
    setThreadMessagesAsRead(tmid, until) {
        return this.updateMany({
            tmid,
            unread: true,
            ts: { $lt: until },
        }, {
            $unset: {
                unread: 1,
            },
        });
    }
    setAsReadById(_id) {
        return this.updateOne({
            _id,
        }, {
            $unset: {
                unread: 1,
            },
        });
    }
    findVisibleUnreadMessagesByRoomAndDate(rid, after) {
        const query = Object.assign({ unread: true, rid, $or: [
                {
                    tmid: { $exists: false },
                },
                {
                    tshow: true,
                },
            ] }, (after && { ts: { $gt: after } }));
        return this.find(query, {
            projection: {
                _id: 1,
                t: 1,
                pinned: 1,
                drid: 1,
                tmid: 1,
            },
        });
    }
    findUnreadThreadMessagesByDate(tmid, userId, after) {
        const query = Object.assign({ 'u._id': { $ne: userId }, 'unread': true, tmid, 'tshow': { $exists: false } }, (after && { ts: { $gt: after } }));
        return this.find(query, {
            projection: {
                _id: 1,
                t: 1,
                pinned: 1,
                drid: 1,
                tmid: 1,
            },
        });
    }
    /**
     * Copy metadata from the discussion to the system message in the parent channel
     * which links to the discussion.
     * Since we don't pass this metadata into the model's function, it is not a subject
     * to race conditions: If multiple updates occur, the current state will be updated
     * only if the new state of the discussion room is really newer.
     */
    refreshDiscussionMetadata(room) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id: drid, msgs: dcount, lm: dlm } = room;
            const query = {
                drid,
            };
            return this.findOneAndUpdate(query, {
                $set: {
                    dcount,
                    dlm,
                },
            }, { returnDocument: 'after' });
        });
    }
    // //////////////////////////////////////////////////////////////////
    // threads
    countThreads() {
        return this.col.countDocuments({ tcount: { $exists: true } });
    }
    updateRepliesByThreadId(tmid, replies, ts) {
        const query = {
            _id: tmid,
        };
        const update = {
            $addToSet: {
                replies: {
                    $each: replies,
                },
            },
            $set: {
                tlm: ts,
            },
            $inc: {
                tcount: 1,
            },
        };
        return this.updateOne(query, update);
    }
    getThreadFollowsByThreadId(tmid) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = yield this.findOneById(tmid, { projection: { replies: 1 } });
            return msg === null || msg === void 0 ? void 0 : msg.replies;
        });
    }
    addThreadFollowerByThreadId(tmid, userId) {
        const query = {
            _id: tmid,
        };
        const update = {
            $addToSet: {
                replies: userId,
            },
        };
        return this.updateOne(query, update);
    }
    removeThreadFollowerByThreadId(tmid, userId) {
        const query = {
            _id: tmid,
        };
        const update = {
            $pull: {
                replies: userId,
            },
        };
        return this.updateOne(query, update);
    }
    findThreadsByRoomId(rid, skip, limit) {
        return this.find({ rid, tcount: { $exists: true } }, { sort: { tlm: -1 }, skip, limit });
    }
    findAgentLastMessageByVisitorLastMessageTs(roomId, visitorLastMessageTs) {
        const query = {
            rid: roomId,
            ts: { $gt: visitorLastMessageTs },
            token: { $exists: false },
        };
        return this.findOne(query, { sort: { ts: 1 } });
    }
    findAllImportedMessagesWithFilesToDownload() {
        const query = {
            '_importFile.downloadUrl': {
                $exists: true,
            },
            '_importFile.rocketChatUrl': {
                $exists: false,
            },
            '_importFile.downloaded': {
                $ne: true,
            },
            '_importFile.external': {
                $ne: true,
            },
        };
        return this.find(query);
    }
    countAllImportedMessagesWithFilesToDownload() {
        const query = {
            '_importFile.downloadUrl': {
                $exists: true,
            },
            '_importFile.rocketChatUrl': {
                $exists: false,
            },
            '_importFile.downloaded': {
                $ne: true,
            },
            '_importFile.external': {
                $ne: true,
            },
        };
        return this.col.countDocuments(query);
    }
    decreaseReplyCountById(_id, inc = -1) {
        const query = { _id };
        const update = {
            $inc: {
                tcount: inc,
            },
        };
        return this.updateOne(query, update);
    }
}
exports.MessagesRaw = MessagesRaw;
