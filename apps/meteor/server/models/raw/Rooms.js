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
exports.RoomsRaw = void 0;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const BaseRaw_1 = require("./BaseRaw");
const readSecondaryPreferred_1 = require("../../database/readSecondaryPreferred");
class RoomsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'room', trash);
    }
    modelIndexes() {
        return [
            {
                key: { name: 1 },
                unique: true,
                sparse: true,
            },
            {
                key: { default: 1 },
                sparse: true,
            },
            {
                key: { featured: 1 },
                sparse: true,
            },
            {
                key: { muted: 1 },
                sparse: true,
            },
            {
                key: { 'u._id': 1 },
            },
            {
                key: { ts: 1 },
            },
            // discussions
            {
                key: { prid: 1 },
                sparse: true,
            },
            {
                key: { fname: 1 },
                sparse: true,
            },
            // field used for DMs only
            {
                key: { uids: 1 },
                sparse: true,
            },
            {
                key: { createdOTR: 1 },
                sparse: true,
            },
            {
                key: { encrypted: 1 },
                sparse: true,
            }, // used on statistics
            {
                key: { broadcast: 1 },
                sparse: true,
            }, // used on statistics
            {
                key: {
                    teamId: 1,
                    teamDefault: 1,
                },
                sparse: true,
            },
            { key: { t: 1, ts: 1 } },
            {
                key: {
                    'usersWaitingForE2EKeys.userId': 1,
                },
                partialFilterExpression: {
                    'usersWaitingForE2EKeys.userId': {
                        $exists: true,
                    },
                },
            },
        ];
    }
    findOneByRoomIdAndUserId(rid, uid, options = {}) {
        const query = {
            '_id': rid,
            'u._id': uid,
        };
        return this.findOne(query, options);
    }
    findManyByRoomIds(roomIds, options = {}) {
        const query = {
            _id: {
                $in: roomIds,
            },
        };
        return this.find(query, options);
    }
    findPaginatedByIds(roomIds, options = {}) {
        return this.findPaginated({
            _id: { $in: roomIds },
        }, options);
    }
    getMostRecentAverageChatDurationTime(numberMostRecentChats, department) {
        return __awaiter(this, void 0, void 0, function* () {
            const aggregate = [
                {
                    $match: Object.assign(Object.assign({ t: 'l' }, (department && { departmentId: department })), { closedAt: { $exists: true } }),
                },
                { $sort: { closedAt: -1 } },
                { $limit: numberMostRecentChats },
                {
                    $group: {
                        _id: null,
                        chats: { $sum: 1 },
                        sumChatDuration: { $sum: '$metrics.chatDuration' },
                    },
                },
                { $project: { _id: '$_id', avgChatDuration: { $divide: ['$sumChatDuration', '$chats'] } } },
            ];
            const [statistic] = yield this.col
                .aggregate(aggregate, { readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() })
                .toArray();
            return statistic;
        });
    }
    findByNameOrFnameContainingAndTypes(name, types, discussion = false, teams = false, options = {}) {
        const nameRegex = new RegExp((0, string_helpers_1.escapeRegExp)(name).trim(), 'i');
        const nameCondition = {
            $or: [
                { name: nameRegex, federated: { $ne: true } },
                { fname: nameRegex },
                {
                    t: 'd',
                    usernames: nameRegex,
                },
            ],
        };
        const query = Object.assign(Object.assign({ $and: [
                name ? nameCondition : {},
                (types === null || types === void 0 ? void 0 : types.length) || discussion || teams
                    ? {
                        $or: [
                            {
                                t: {
                                    $in: types,
                                },
                            },
                            ...(discussion ? [{ prid: { $exists: true } }] : []),
                            ...(teams ? [{ teamMain: { $exists: true } }] : []),
                        ],
                    }
                    : {},
            ] }, (!discussion ? { prid: { $exists: false } } : {})), (!teams ? { teamMain: { $exists: false } } : {}));
        return this.findPaginated(query, options);
    }
    findByTeamId(teamId, options = {}) {
        const query = {
            teamId,
            teamMain: {
                $exists: false,
            },
        };
        return this.find(query, options);
    }
    countByTeamId(teamId) {
        const query = {
            teamId,
            teamMain: {
                $exists: false,
            },
        };
        return this.countDocuments(query);
    }
    findPaginatedByTeamIdContainingNameAndDefault(teamId, name, teamDefault, ids, options = {}) {
        const query = Object.assign(Object.assign(Object.assign({ teamId, teamMain: {
                $exists: false,
            } }, (name ? { name: new RegExp((0, string_helpers_1.escapeRegExp)(name), 'i') } : {})), (teamDefault === true ? { teamDefault } : {})), (ids ? { $or: [{ t: 'c' }, { _id: { $in: ids } }] } : {}));
        return this.findPaginated(query, options);
    }
    findByTeamIdAndRoomsId(teamId, rids, options = {}) {
        const query = {
            teamId,
            _id: {
                $in: rids,
            },
        };
        return this.find(query, options);
    }
    findRoomsByNameOrFnameStarting(name, options = {}) {
        const nameRegex = new RegExp(`^${(0, string_helpers_1.escapeRegExp)(name).trim()}`, 'i');
        const query = {
            t: {
                $in: ['c', 'p'],
            },
            $or: [
                {
                    name: nameRegex,
                },
                {
                    fname: nameRegex,
                },
            ],
        };
        return this.find(query, options);
    }
    findRoomsWithoutDiscussionsByRoomIds(name, roomIds, options = {}) {
        const nameRegex = new RegExp(`^${(0, string_helpers_1.escapeRegExp)(name).trim()}`, 'i');
        const query = {
            _id: {
                $in: roomIds,
            },
            t: {
                $in: ['c', 'p'],
            },
            name: nameRegex,
            $or: [
                {
                    teamId: {
                        $exists: false,
                    },
                },
                {
                    teamId: {
                        $exists: true,
                    },
                    _id: {
                        $in: roomIds,
                    },
                },
            ],
            prid: { $exists: false },
            $and: [{ federated: { $ne: true } }, { archived: { $ne: true } }],
        };
        return this.find(query, options);
    }
    findPaginatedRoomsWithoutDiscussionsByRoomIds(name, roomIds, options = {}) {
        const nameRegex = new RegExp(`^${(0, string_helpers_1.escapeRegExp)(name).trim()}`, 'i');
        const query = {
            _id: {
                $in: roomIds,
            },
            t: {
                $in: ['c', 'p'],
            },
            name: nameRegex,
            $or: [
                {
                    teamId: {
                        $exists: false,
                    },
                },
                {
                    teamId: {
                        $exists: true,
                    },
                    _id: {
                        $in: roomIds,
                    },
                },
            ],
            prid: { $exists: false },
            $and: [{ $or: [{ federated: { $exists: false } }, { federated: false }] }],
        };
        return this.findPaginated(query, options);
    }
    findChannelAndGroupListWithoutTeamsByNameStartingByOwner(name, groupsToAccept, options = {}) {
        const nameRegex = new RegExp(`^${(0, string_helpers_1.escapeRegExp)(name).trim()}`, 'i');
        const query = {
            teamId: {
                $exists: false,
            },
            prid: {
                $exists: false,
            },
            _id: {
                $in: groupsToAccept,
            },
            name: nameRegex,
            $and: [{ $or: [{ federated: { $exists: false } }, { federated: false }] }],
        };
        return this.find(query, options);
    }
    unsetTeamId(teamId, options = {}) {
        const query = { teamId };
        const update = {
            $unset: {
                teamId: '',
                teamDefault: '',
                teamMain: '',
            },
        };
        return this.updateMany(query, update, options);
    }
    unsetTeamById(rid, options = {}) {
        return this.updateOne({ _id: rid }, { $unset: { teamId: '', teamDefault: '' } }, options);
    }
    setTeamById(rid, teamId, teamDefault, options = {}) {
        return this.updateOne({ _id: rid }, { $set: { teamId, teamDefault } }, options);
    }
    setTeamMainById(rid, teamId, options = {}) {
        return this.updateOne({ _id: rid }, { $set: { teamId, teamMain: true } }, options);
    }
    setTeamByIds(rids, teamId, options = {}) {
        return this.updateMany({ _id: { $in: rids } }, { $set: { teamId } }, options);
    }
    setTeamDefaultById(rid, teamDefault, options = {}) {
        return this.updateOne({ _id: rid }, { $set: { teamDefault } }, options);
    }
    getChannelsWithNumberOfMessagesBetweenDateQuery({ types, start, end, startOfLastWeek, endOfLastWeek, options, }) {
        const typeMatch = {
            $match: {
                t: { $in: types },
            },
        };
        const lookup = {
            $lookup: {
                from: 'rocketchat_analytics',
                localField: '_id',
                foreignField: 'room._id',
                as: 'messages',
            },
        };
        const messagesProject = {
            $project: {
                room: '$$ROOT',
                messages: {
                    $filter: {
                        input: '$messages',
                        as: 'message',
                        cond: {
                            $and: [{ $gte: ['$$message.date', start] }, { $lte: ['$$message.date', end] }],
                        },
                    },
                },
                lastWeekMessages: {
                    $filter: {
                        input: '$messages',
                        as: 'message',
                        cond: {
                            $and: [{ $gte: ['$$message.date', startOfLastWeek] }, { $lte: ['$$message.date', endOfLastWeek] }],
                        },
                    },
                },
            },
        };
        const messagesUnwind = {
            $unwind: {
                path: '$messages',
                preserveNullAndEmptyArrays: true,
            },
        };
        const messagesGroup = {
            $group: {
                _id: {
                    _id: '$room._id',
                },
                room: { $first: '$room' },
                messages: { $sum: '$messages.messages' },
                lastWeekMessages: { $first: '$lastWeekMessages' },
            },
        };
        const lastWeekMessagesUnwind = {
            $unwind: {
                path: '$lastWeekMessages',
                preserveNullAndEmptyArrays: true,
            },
        };
        const lastWeekMessagesGroup = {
            $group: {
                _id: {
                    _id: '$room._id',
                },
                room: { $first: '$room' },
                messages: { $first: '$messages' },
                lastWeekMessages: { $sum: '$lastWeekMessages.messages' },
            },
        };
        const presentationProject = {
            $project: {
                _id: 0,
                room: {
                    _id: '$_id._id',
                    name: { $ifNull: ['$room.name', '$room.fname'] },
                    ts: '$room.ts',
                    t: '$room.t',
                    _updatedAt: '$room._updatedAt',
                    usernames: '$room.usernames',
                },
                messages: '$messages',
                lastWeekMessages: '$lastWeekMessages',
                diffFromLastWeek: { $subtract: ['$messages', '$lastWeekMessages'] },
            },
        };
        const firstParams = [typeMatch, lookup, messagesProject, messagesUnwind, messagesGroup];
        const lastParams = [lastWeekMessagesUnwind, lastWeekMessagesGroup, presentationProject];
        const sort = { $sort: (options === null || options === void 0 ? void 0 : options.sort) || { messages: -1 } };
        const sortAndPaginationParams = [sort];
        if (options === null || options === void 0 ? void 0 : options.offset) {
            sortAndPaginationParams.push({ $skip: options.offset });
        }
        if (options === null || options === void 0 ? void 0 : options.count) {
            sortAndPaginationParams.push({ $limit: options.count });
        }
        const params = [...firstParams];
        if (options === null || options === void 0 ? void 0 : options.sort) {
            params.push(...lastParams, ...sortAndPaginationParams);
        }
        else {
            params.push(...sortAndPaginationParams, ...lastParams, sort);
        }
        return params;
    }
    findChannelsByTypesWithNumberOfMessagesBetweenDate(params) {
        const aggregationParams = this.getChannelsWithNumberOfMessagesBetweenDateQuery(params);
        return this.col.aggregate(aggregationParams, {
            allowDiskUse: true,
            readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)(),
        });
    }
    findOneByNameOrFname(name, options = {}) {
        const query = {
            $or: [
                {
                    name,
                },
                {
                    fname: name,
                },
            ],
        };
        return this.findOne(query, options);
    }
    findOneByJoinCodeAndId(joinCode, rid, options = {}) {
        const query = {
            _id: rid,
            joinCode,
        };
        return this.findOne(query, options);
    }
    findOneByNonValidatedName(name_1) {
        return __awaiter(this, arguments, void 0, function* (name, options = {}) {
            const room = yield this.findOneByNameOrFname(name, options);
            if (room) {
                return room;
            }
            return this.findOneByName(name, options);
        });
    }
    findOneByName(name, options = {}) {
        return this.col.findOne({ name }, options);
    }
    findDefaultRoomsForTeam(teamId) {
        return this.col.find({
            teamId,
            teamDefault: true,
            teamMain: {
                $exists: false,
            },
        });
    }
    incUsersCountByIds(ids, inc = 1, options) {
        const query = {
            _id: {
                $in: ids,
            },
        };
        const update = {
            $inc: {
                usersCount: inc,
            },
        };
        return this.updateMany(query, update, options);
    }
    allRoomSourcesCount() {
        return this.col.aggregate([
            {
                $match: {
                    source: {
                        $exists: true,
                    },
                    t: 'l',
                },
            },
            {
                $group: {
                    _id: '$source',
                    count: { $sum: 1 },
                },
            },
        ]);
    }
    findByBroadcast(options = {}) {
        return this.find({
            broadcast: true,
        }, options);
    }
    countByBroadcast(options) {
        return this.countDocuments({
            broadcast: true,
        }, options);
    }
    setAsFederated(roomId) {
        return this.updateOne({ _id: roomId }, { $set: { federated: true } });
    }
    setRoomTypeById(roomId, roomType) {
        return this.updateOne({ _id: roomId }, { $set: { t: roomType } });
    }
    setRoomNameById(roomId, name) {
        return this.updateOne({ _id: roomId }, { $set: { name } });
    }
    setSidepanelById(roomId, sidepanel) {
        return this.updateOne({ _id: roomId }, { $set: { sidepanel } });
    }
    setFnameById(_id, fname) {
        const query = { _id };
        const update = {
            $set: {
                fname,
            },
        };
        return this.updateOne(query, update);
    }
    setRoomTopicById(roomId, topic) {
        return this.updateOne({ _id: roomId }, { $set: { description: topic } });
    }
    findByE2E(options = {}) {
        return this.find({
            encrypted: true,
        }, options);
    }
    countByE2E(options) {
        return this.countDocuments({
            encrypted: true,
        }, options);
    }
    findE2ERoomById(roomId, options = {}) {
        return this.findOne({
            _id: roomId,
            encrypted: true,
        }, options);
    }
    findRoomsInsideTeams(autoJoin = false) {
        return this.find(Object.assign({ teamId: { $exists: true }, teamMain: { $exists: false } }, (autoJoin && { teamDefault: true })));
    }
    countRoomsInsideTeams(autoJoin = false) {
        return this.countDocuments(Object.assign({ teamId: { $exists: true }, teamMain: { $exists: false } }, (autoJoin && { teamDefault: true })));
    }
    countByType(t) {
        return this.col.countDocuments({ t });
    }
    findPaginatedByNameOrFNameAndRoomIdsIncludingTeamRooms(searchTerm, teamIds, roomIds, options = {}) {
        const query = {
            $and: [
                { teamMain: { $exists: false } },
                { prid: { $exists: false } },
                {
                    $or: [
                        {
                            t: 'c',
                            teamId: { $exists: false },
                        },
                        {
                            t: 'c',
                            teamId: { $in: teamIds },
                        },
                        ...((roomIds === null || roomIds === void 0 ? void 0 : roomIds.length) > 0
                            ? [
                                {
                                    _id: {
                                        $in: roomIds,
                                    },
                                },
                            ]
                            : []),
                    ],
                },
                ...(searchTerm
                    ? [
                        {
                            $or: [
                                {
                                    name: searchTerm,
                                },
                                {
                                    fname: searchTerm,
                                },
                            ],
                        },
                    ]
                    : []),
            ],
        };
        return this.findPaginated(query, options);
    }
    findPaginatedContainingNameOrFNameInIdsAsTeamMain(searchTerm, rids, options = {}) {
        const query = {
            teamMain: true,
            $and: [
                {
                    $or: [
                        {
                            t: 'p',
                            _id: {
                                $in: rids,
                            },
                        },
                        {
                            t: 'c',
                        },
                    ],
                },
            ],
        };
        if (searchTerm && query.$and) {
            query.$and.push({
                $or: [
                    {
                        name: searchTerm,
                    },
                    {
                        fname: searchTerm,
                    },
                ],
            });
        }
        return this.findPaginated(query, options);
    }
    findPaginatedByTypeAndIds(type, ids, options = {}) {
        const query = {
            t: type,
            _id: {
                $in: ids,
            },
        };
        return this.findPaginated(query, options);
    }
    findOneDirectRoomContainingAllUserIDs(uid, options = {}) {
        const query = {
            t: 'd',
            uids: { $size: uid.length, $all: uid },
        };
        return this.findOne(query, options);
    }
    findFederatedRooms(options = {}) {
        const query = {
            federated: true,
        };
        return this.find(query, options);
    }
    findCountOfRoomsWithActiveCalls() {
        const query = {
            // No matter the actual "status" of the call, if the room has a callStatus, it means there is/was a call
            callStatus: { $exists: true },
        };
        return this.col.countDocuments(query);
    }
    findBiggestFederatedRoomInNumberOfUsers(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const asc = false;
            return this.findFederatedRoomByAmountOfUsers(options, asc);
        });
    }
    findFederatedRoomByAmountOfUsers(options_1) {
        return __awaiter(this, arguments, void 0, function* (options, asc = true) {
            const query = {
                federated: true,
            };
            const room = yield (yield this.find(query, options)
                .sort({ usersCount: asc ? 1 : -1 })
                .limit(1)
                .toArray()).shift();
            return room;
        });
    }
    findSmallestFederatedRoomInNumberOfUsers(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const asc = true;
            return this.findFederatedRoomByAmountOfUsers(options, asc);
        });
    }
    countFederatedRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.col.countDocuments({ federated: true });
        });
    }
    incMsgCountById(_id, inc = 1) {
        const query = { _id };
        const update = {
            $inc: {
                msgs: inc,
            },
        };
        return this.updateOne(query, update);
    }
    getIncMsgCountUpdateQuery(inc, roomUpdater) {
        return roomUpdater.inc('msgs', inc);
    }
    decreaseMessageCountById(_id, count = 1) {
        return this.incMsgCountById(_id, -count);
    }
    findOneByIdOrName(_idOrName, options = {}) {
        const query = {
            $or: [
                {
                    _id: _idOrName,
                },
                {
                    name: _idOrName,
                },
            ],
        };
        return this.findOne(query, options);
    }
    findOneByIdAndType(roomId, type, options = {}) {
        return this.findOne({ _id: roomId, t: type }, options);
    }
    setCallStatus(_id, status) {
        const query = {
            _id,
        };
        const update = {
            $set: {
                callStatus: status,
            },
        };
        return this.updateOne(query, update);
    }
    setCallStatusAndCallStartTime(_id, status) {
        const query = {
            _id,
        };
        const update = {
            $set: {
                callStatus: status,
                webRtcCallStartTime: new Date(),
            },
        };
        return this.updateOne(query, update);
    }
    setReactionsInLastMessage(roomId, reactions) {
        return this.updateOne({ _id: roomId }, { $set: { 'lastMessage.reactions': reactions } });
    }
    unsetReactionsInLastMessage(roomId) {
        return this.updateOne({ _id: roomId }, { $unset: { 'lastMessage.reactions': 1 } });
    }
    unsetAllImportIds() {
        const query = {
            importIds: {
                $exists: true,
            },
        };
        const update = {
            $unset: {
                importIds: 1,
            },
        };
        return this.updateMany(query, update);
    }
    updateLastMessageStar(roomId, userId, starred) {
        let update;
        const query = { _id: roomId };
        if (starred) {
            update = {
                $addToSet: {
                    'lastMessage.starred': { _id: userId },
                },
            };
        }
        else {
            update = {
                $pull: {
                    'lastMessage.starred': { _id: userId },
                },
            };
        }
        return this.updateOne(query, update);
    }
    setLastMessagePinned(roomId, pinnedBy, pinned, pinnedAt) {
        const query = { _id: roomId };
        const update = {
            $set: {
                'lastMessage.pinned': pinned,
                'lastMessage.pinnedAt': pinnedAt || new Date(),
                'lastMessage.pinnedBy': pinnedBy,
            },
        };
        return this.updateOne(query, update);
    }
    setLastMessageAsRead(roomId) {
        return this.updateOne({
            _id: roomId,
        }, {
            $unset: {
                'lastMessage.unread': 1,
            },
        });
    }
    setDescriptionById(_id, description) {
        const query = {
            _id,
        };
        const update = {
            $set: {
                description,
            },
        };
        return this.updateOne(query, update);
    }
    setReadOnlyById(_id, readOnly) {
        const query = {
            _id,
        };
        const update = {
            $set: {
                ro: readOnly,
            },
        };
        return this.updateOne(query, update);
    }
    setDmReadOnlyByUserId(_id, ids, readOnly, reactWhenReadOnly) {
        const query = Object.assign(Object.assign({ uids: {
                $size: 2,
                $in: [_id],
            } }, (ids && Array.isArray(ids) ? { _id: { $in: ids } } : {})), { t: 'd' });
        const update = {
            $set: {
                ro: readOnly,
                reactWhenReadOnly,
            },
        };
        return this.updateMany(query, update);
    }
    getDirectConversationsByUserId(_id, options = {}) {
        return this.find({ t: 'd', uids: { $size: 2, $in: [_id] } }, options);
    }
    // 2
    setAllowReactingWhenReadOnlyById(_id, allowReacting) {
        const query = {
            _id,
        };
        const update = {
            $set: {
                reactWhenReadOnly: allowReacting,
            },
        };
        return this.updateOne(query, update);
    }
    setAvatarData(_id, origin, etag) {
        const update = {
            $set: {
                avatarOrigin: origin,
                avatarETag: etag,
            },
        };
        return this.updateOne({ _id }, update);
    }
    unsetAvatarData(_id) {
        const update = {
            $set: {
                avatarETag: Date.now().toString(),
            },
            $unset: {
                avatarOrigin: 1,
            },
        };
        return this.updateOne({ _id }, update);
    }
    setSystemMessagesById(_id, systemMessages) {
        const query = {
            _id,
        };
        const update = Array.isArray(systemMessages) && systemMessages.length > 0
            ? {
                $set: {
                    sysMes: systemMessages,
                },
            }
            : {
                $unset: {
                    sysMes: '',
                },
            };
        return this.updateOne(query, update);
    }
    setE2eKeyId(_id, e2eKeyId, options = {}) {
        const query = {
            _id,
        };
        const update = {
            $set: {
                e2eKeyId,
            },
        };
        return this.updateOne(query, update, options);
    }
    findOneByImportId(_id, options = {}) {
        const query = { importIds: _id };
        return this.findOne(query, options);
    }
    findOneByNameAndNotId(name, rid) {
        const query = {
            _id: { $ne: rid },
            name,
        };
        return this.findOne(query);
    }
    findOneByDisplayName(fname, options = {}) {
        const query = { fname };
        return this.findOne(query, options);
    }
    findOneByNameAndType(name, type, options = {}, includeFederatedRooms = false) {
        const query = Object.assign({ t: type, teamId: {
                $exists: false,
            } }, (includeFederatedRooms
            ? { $or: [{ $and: [{ $or: [{ federated: { $exists: false } }, { federated: false }], name }] }, { federated: true, fname: name }] }
            : { $or: [{ federated: { $exists: false } }, { federated: false }], name }));
        return this.findOne(query, options);
    }
    // FIND
    findById(roomId, options = {}) {
        return this.findOne({ _id: roomId }, options);
    }
    findByIds(roomIds, options = {}) {
        return this.find({ _id: { $in: roomIds } }, options);
    }
    findByType(type, options = {}) {
        const query = { t: type };
        return this.find(query, options);
    }
    findByTypeInIds(type, ids, options = {}) {
        const query = {
            _id: {
                $in: ids,
            },
            t: type,
        };
        return this.find(query, options);
    }
    findBySubscriptionUserId(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, options = {}) {
            const data = (yield models_1.Subscriptions.findByUserId(userId, { projection: { rid: 1 } }).toArray()).map((item) => item.rid);
            const query = {
                _id: {
                    $in: data,
                },
                $or: [
                    {
                        teamId: {
                            $exists: false,
                        },
                    },
                    {
                        teamId: {
                            $exists: true,
                        },
                        _id: {
                            $in: data,
                        },
                    },
                ],
            };
            return this.find(query, options);
        });
    }
    findBySubscriptionUserIdUpdatedAfter(userId_1, _updatedAt_1) {
        return __awaiter(this, arguments, void 0, function* (userId, _updatedAt, options = {}) {
            const ids = (yield models_1.Subscriptions.findByUserId(userId, { projection: { rid: 1 } }).toArray()).map((item) => item.rid);
            const query = {
                _id: {
                    $in: ids,
                },
                _updatedAt: {
                    $gt: _updatedAt,
                },
                $or: [
                    {
                        teamId: {
                            $exists: false,
                        },
                    },
                    {
                        teamId: {
                            $exists: true,
                        },
                        _id: {
                            $in: ids,
                        },
                    },
                ],
            };
            return this.find(query, options);
        });
    }
    findByNameAndTypeNotDefault(name, type, options = {}, includeFederatedRooms = false) {
        const query = {
            t: type,
            default: {
                $ne: true,
            },
            $and: [
                {
                    $or: [
                        {
                            teamId: {
                                $exists: false,
                            },
                        },
                        {
                            teamMain: true,
                        },
                    ],
                },
                includeFederatedRooms
                    ? {
                        $or: [{ $and: [{ $or: [{ federated: { $exists: false } }, { federated: false }], name }] }, { federated: true, fname: name }],
                    }
                    : { $or: [{ federated: { $exists: false } }, { federated: false }], name },
            ],
        };
        // do not use cache
        return this.find(query, options);
    }
    // 3
    findByNameOrFNameAndTypesNotInIds(name, types, ids, options = {}, includeFederatedRooms = false) {
        const nameCondition = {
            $or: [{ name }, { fname: name }],
        };
        const query = {
            _id: {
                $nin: ids,
            },
            t: {
                $in: types,
            },
            $and: [
                {
                    $or: [
                        {
                            teamId: {
                                $exists: false,
                            },
                        },
                        {
                            teamId: {
                                $exists: true,
                            },
                            _id: {
                                $in: ids,
                            },
                        },
                        {
                            // Also return the main room of public teams
                            // this will have no effect if the method is called without the 'c' type, as the type filter is outside the $or group.
                            teamMain: true,
                            t: 'c',
                        },
                    ],
                },
                includeFederatedRooms
                    ? {
                        $or: [
                            { $and: [{ $or: [{ federated: { $exists: false } }, { federated: false }] }, nameCondition] },
                            { federated: true, fname: name },
                        ],
                    }
                    : { $and: [{ $or: [{ federated: { $exists: false } }, { federated: false }] }, nameCondition] },
            ],
        };
        // do not use cache
        return this.find(query, options);
    }
    findByDefaultAndTypes(defaultValue, types, options = {}) {
        const query = Object.assign({ t: {
                $in: types,
            } }, (defaultValue ? { default: true } : { default: { $ne: true } }));
        return this.find(query, options);
    }
    findDirectRoomContainingAllUsernames(usernames, options = {}) {
        const query = {
            t: 'd',
            usernames: { $size: usernames.length, $all: usernames },
            usersCount: usernames.length,
        };
        return this.findOne(query, options);
    }
    findByTypeAndName(type, name, options = {}) {
        const query = {
            name,
            t: type,
        };
        return this.findOne(query, options);
    }
    findByTypeAndNameOrId(type, identifier, options = {}) {
        const query = {
            t: type,
            $or: [{ name: identifier }, { _id: identifier }],
        };
        return this.findOne(query, options);
    }
    findByTypeAndNameContaining(type, name, options = {}) {
        const nameRegex = new RegExp((0, string_helpers_1.escapeRegExp)(name).trim(), 'i');
        const query = {
            name: nameRegex,
            t: type,
        };
        return this.find(query, options);
    }
    findByTypeInIdsAndNameContaining(type, ids, name, options = {}) {
        const nameRegex = new RegExp((0, string_helpers_1.escapeRegExp)(name).trim(), 'i');
        const query = {
            _id: {
                $in: ids,
            },
            name: nameRegex,
            t: type,
        };
        return this.find(query, options);
    }
    findGroupDMsByUids(uids, options = {}) {
        return this.find({
            usersCount: { $gt: 2 },
            uids: { $in: uids },
        }, options);
    }
    countGroupDMsByUids(uids) {
        return this.countDocuments({
            usersCount: { $gt: 2 },
            uids: { $in: uids },
        });
    }
    find1On1ByUserId(userId, options = {}) {
        return this.find({
            uids: userId,
            usersCount: 2,
        }, options);
    }
    findByCreatedOTR() {
        return this.find({ createdOTR: true });
    }
    countByCreatedOTR(options) {
        return this.countDocuments({ createdOTR: true }, options);
    }
    findByUsernamesOrUids(uids, usernames) {
        return this.find({ $or: [{ usernames: { $in: usernames } }, { uids: { $in: uids } }] });
    }
    findDMsByUids(uids) {
        return this.find({ uids: { $size: 2, $in: [uids] }, t: 'd' });
    }
    // UPDATE
    addImportIds(_id, importIds) {
        const query = { _id };
        const update = {
            $addToSet: {
                importIds: {
                    $each: [].concat(importIds),
                },
            },
        };
        return this.updateOne(query, update);
    }
    archiveById(_id) {
        const query = { _id };
        const update = {
            $set: {
                archived: true,
            },
        };
        return this.updateOne(query, update);
    }
    unarchiveById(_id) {
        const query = { _id };
        const update = {
            $set: {
                archived: false,
            },
        };
        return this.updateOne(query, update);
    }
    setNameById(_id, name, fname) {
        const query = { _id };
        const update = {
            $set: {
                name,
                fname,
            },
        };
        return this.updateOne(query, update);
    }
    setIncMsgCountAndSetLastMessageUpdateQuery(inc, lastMessage, shouldStoreLastMessage, roomUpdater) {
        roomUpdater.inc('msgs', inc).set('lm', lastMessage.ts);
        if (shouldStoreLastMessage) {
            roomUpdater.set('lastMessage', lastMessage);
        }
        return roomUpdater;
    }
    incUsersCountById(_id, inc = 1) {
        const query = { _id };
        const update = {
            $inc: {
                usersCount: inc,
            },
        };
        return this.updateOne(query, update);
    }
    // 4
    incUsersCountNotDMsByIds(ids, inc = 1) {
        const query = {
            _id: {
                $in: ids,
            },
            t: { $ne: 'd' },
        };
        const update = {
            $inc: {
                usersCount: inc,
            },
        };
        return this.updateMany(query, update);
    }
    getLastMessageUpdateQuery(lastMessage, roomUpdater) {
        return roomUpdater.set('lastMessage', lastMessage);
    }
    resetLastMessageById(_id, lastMessage, msgCountDelta) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { _id };
            const update = Object.assign(Object.assign({}, (lastMessage ? { $set: { lastMessage } } : { $unset: { lastMessage: 1 } })), (msgCountDelta ? { $inc: { msgs: msgCountDelta } } : {}));
            return this.updateOne(query, update);
        });
    }
    replaceUsername(previousUsername, username) {
        const query = { usernames: previousUsername };
        const update = {
            $set: {
                'usernames.$': username,
            },
        };
        return this.updateMany(query, update);
    }
    replaceMutedUsername(previousUsername, username) {
        const query = { muted: previousUsername };
        const update = {
            $set: {
                'muted.$': username,
            },
        };
        return this.updateMany(query, update);
    }
    replaceUsernameOfUserByUserId(userId, username) {
        const query = { 'u._id': userId };
        const update = {
            $set: {
                'u.username': username,
            },
        };
        return this.updateMany(query, update);
    }
    setJoinCodeById(_id, joinCode) {
        let update;
        const query = { _id };
        if ((joinCode != null ? joinCode.trim() : undefined) !== '') {
            update = {
                $set: {
                    joinCodeRequired: true,
                    joinCode,
                },
            };
        }
        else {
            update = {
                $set: {
                    joinCodeRequired: false,
                },
                $unset: {
                    joinCode: 1,
                },
            };
        }
        return this.updateOne(query, update);
    }
    setTypeById(_id, type) {
        const query = { _id };
        const update = {
            $set: {
                t: type,
            },
        };
        if (type === 'p') {
            update.$unset = { default: '' };
        }
        return this.updateOne(query, update);
    }
    setTopicById(_id, topic) {
        const query = { _id };
        const update = {
            $set: {
                topic,
            },
        };
        return this.updateOne(query, update);
    }
    setAnnouncementById(_id, announcement, announcementDetails) {
        const query = { _id };
        const update = {
            $set: {
                announcement,
                announcementDetails,
            },
        };
        return this.updateOne(query, update);
    }
    setCustomFieldsById(_id, customFields) {
        const query = { _id };
        const update = {
            $set: {
                customFields,
            },
        };
        return this.updateOne(query, update);
    }
    muteUsernameByRoomId(_id, username) {
        const query = { _id };
        const update = {
            $addToSet: {
                muted: username,
            },
            $pull: {
                unmuted: username,
            },
        };
        return this.updateOne(query, update);
    }
    muteReadOnlyUsernameByRoomId(_id, username) {
        const query = { _id, ro: true };
        const update = {
            $pull: {
                unmuted: username,
            },
        };
        return this.updateOne(query, update);
    }
    unmuteMutedUsernameByRoomId(_id, username) {
        const query = { _id };
        const update = {
            $pull: {
                muted: username,
            },
        };
        return this.updateOne(query, update);
    }
    unmuteReadOnlyUsernameByRoomId(_id, username) {
        const query = { _id, ro: true };
        const update = {
            $pull: {
                muted: username,
            },
            $addToSet: {
                unmuted: username,
            },
        };
        return this.updateOne(query, update);
    }
    saveFeaturedById(_id, featured) {
        const query = { _id };
        const set = ['true', true].includes(featured);
        const update = {
            [set ? '$set' : '$unset']: {
                featured: true,
            },
        };
        return this.updateOne(query, update);
    }
    saveDefaultById(_id, defaultValue) {
        const query = { _id };
        const update = {
            $set: {
                default: defaultValue,
            },
        };
        return this.updateOne(query, update);
    }
    saveFavoriteById(_id, favorite, defaultValue) {
        const query = { _id };
        const update = Object.assign(Object.assign({}, (favorite && defaultValue && { $set: { favorite } })), ((!favorite || !defaultValue) && { $unset: { favorite: 1 } }));
        return this.updateOne(query, update);
    }
    saveRetentionEnabledById(_id, value) {
        const query = { _id };
        const update = {};
        if (value == null) {
            update.$unset = { 'retention.enabled': true };
        }
        else {
            update.$set = { 'retention.enabled': !!value };
        }
        return this.updateOne(query, update);
    }
    saveRetentionMaxAgeById(_id, value = 30) {
        const query = { _id };
        const update = {
            $set: {
                'retention.maxAge': value,
            },
        };
        return this.updateOne(query, update);
    }
    saveRetentionExcludePinnedById(_id, value) {
        const query = { _id };
        const update = {
            $set: {
                'retention.excludePinned': value === true,
            },
        };
        return this.updateOne(query, update);
    }
    saveRetentionIgnoreThreadsById(_id, value) {
        const query = { _id };
        const update = {
            $set: {
                'retention.ignoreThreads': value === true,
            },
        };
        return this.updateOne(query, update);
    }
    saveRetentionFilesOnlyById(_id, value) {
        const query = { _id };
        const update = {
            $set: {
                'retention.filesOnly': value === true,
            },
        };
        return this.updateOne(query, update);
    }
    saveRetentionOverrideGlobalById(_id, value) {
        const query = { _id };
        const update = {
            $set: {
                'retention.overrideGlobal': value === true,
            },
        };
        return this.updateOne(query, update);
    }
    saveEncryptedById(_id, value) {
        const query = { _id };
        const update = {
            $set: {
                encrypted: value === true,
            },
        };
        return this.updateOne(query, update);
    }
    updateGroupDMsRemovingUsernamesByUsername(username, userId) {
        const query = {
            t: 'd',
            usernames: username,
            usersCount: { $gt: 2 },
        };
        const update = {
            $pull: {
                usernames: username,
                uids: userId,
            },
        };
        return this.updateMany(query, update);
    }
    createWithIdTypeAndName(_id, type, name, extraData) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = {
                _id,
                ts: new Date(),
                t: type,
                name,
                usernames: [],
                msgs: 0,
                usersCount: 0,
                _updatedAt: new Date(),
                u: {
                    _id: 'rocket.cat',
                    username: 'rocket.cat',
                    name: 'Rocket.Cat',
                },
            };
            Object.assign(room, extraData);
            yield this.insertOne(room);
            return room;
        });
    }
    createWithFullRoomData(room) {
        return __awaiter(this, void 0, void 0, function* () {
            const newRoom = Object.assign({ _id: (yield this.insertOne(room)).insertedId, _updatedAt: new Date() }, room);
            return newRoom;
        });
    }
    // REMOVE
    removeById(_id) {
        const query = { _id };
        return this.deleteOne(query);
    }
    removeByIds(ids) {
        return this.deleteMany({ _id: { $in: ids } });
    }
    removeDirectRoomContainingUsername(username) {
        const query = {
            t: 'd',
            usernames: username,
            usersCount: { $lte: 2 },
        };
        return this.deleteMany(query);
    }
    countDiscussions() {
        return this.col.countDocuments({ prid: { $exists: true } });
    }
    setOTRForDMByRoomID(rid) {
        const query = { _id: rid, t: 'd' };
        const update = {
            $set: {
                createdOTR: true,
            },
        };
        return this.updateOne(query, update);
    }
    getSubscribedRoomIdsWithoutE2EKeys(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.col
                .aggregate([
                { $match: { encrypted: true } },
                {
                    $lookup: {
                        from: 'rocketchat_subscription',
                        localField: '_id',
                        foreignField: 'rid',
                        as: 'subs',
                    },
                },
                {
                    $unwind: '$subs',
                },
                {
                    $match: {
                        'subs.u._id': uid,
                        'subs.E2EKey': {
                            $exists: false,
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                    },
                },
            ])
                .toArray()).map(({ _id }) => _id);
        });
    }
    addUserIdToE2EEQueueByRoomIds(roomIds, uid) {
        const query = {
            '_id': {
                $in: roomIds,
            },
            'usersWaitingForE2EKeys.userId': { $ne: uid },
            'encrypted': true,
        };
        const update = {
            $push: {
                usersWaitingForE2EKeys: {
                    $each: [
                        {
                            userId: uid,
                            ts: new Date(),
                        },
                    ],
                    $slice: -50,
                },
            },
        };
        return this.updateMany(query, update);
    }
    removeUsersFromE2EEQueueByRoomId(roomId, uids) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                '_id': roomId,
                'usersWaitingForE2EKeys.userId': {
                    $in: uids,
                },
                'encrypted': true,
            };
            const update = {
                $pull: {
                    usersWaitingForE2EKeys: { userId: { $in: uids } },
                },
            };
            yield this.updateMany(query, update);
            return this.updateMany({
                '_id': roomId,
                'usersWaitingForE2EKeys.0': { $exists: false },
                'encrypted': true,
            }, { $unset: { usersWaitingForE2EKeys: 1 } });
        });
    }
    removeUserFromE2EEQueue(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                'usersWaitingForE2EKeys.userId': uid,
                'encrypted': true,
            };
            const update = {
                $pull: {
                    usersWaitingForE2EKeys: { userId: uid },
                },
            };
            return this.updateMany(query, update);
        });
    }
    findChildrenOfTeam(teamId, teamRoomId, userId, filter, type, options) {
        const nameFilter = filter ? new RegExp((0, string_helpers_1.escapeRegExp)(filter), 'i') : undefined;
        return this.col.aggregate([
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                ...(!type || type === 'channels' ? [{ teamId }] : []),
                                ...(!type || type === 'discussions' ? [{ prid: teamRoomId }] : []),
                            ],
                        },
                        ...(nameFilter ? [{ $or: [{ fname: nameFilter }, { name: nameFilter }] }] : []),
                    ],
                },
            },
            {
                $lookup: {
                    from: 'rocketchat_subscription',
                    let: {
                        roomId: '$_id',
                    },
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    {
                                        $expr: {
                                            $eq: ['$rid', '$$roomId'],
                                        },
                                    },
                                    {
                                        $expr: {
                                            $eq: ['$u._id', userId],
                                        },
                                    },
                                    {
                                        $expr: {
                                            $ne: ['$t', 'c'],
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $project: { _id: 1 },
                        },
                    ],
                    as: 'subscription',
                },
            },
            {
                $match: {
                    $or: [
                        { t: 'c' },
                        {
                            $expr: {
                                $ne: [{ $size: '$subscription' }, 0],
                            },
                        },
                    ],
                },
            },
            { $project: { subscription: 0 } },
            { $sort: (options === null || options === void 0 ? void 0 : options.sort) || { ts: 1 } },
            {
                $facet: {
                    totalCount: [{ $count: 'count' }],
                    paginatedResults: [{ $skip: (options === null || options === void 0 ? void 0 : options.skip) || 0 }, { $limit: (options === null || options === void 0 ? void 0 : options.limit) || 50 }],
                },
            },
        ]);
    }
    resetRoomKeyAndSetE2EEQueueByRoomId(roomId, e2eKeyId, e2eQueue) {
        return this.findOneAndUpdate({ _id: roomId }, { $set: Object.assign({ e2eKeyId }, (Array.isArray(e2eQueue) && { usersWaitingForE2EKeys: e2eQueue })) }, { returnDocument: 'after' });
    }
}
exports.RoomsRaw = RoomsRaw;
