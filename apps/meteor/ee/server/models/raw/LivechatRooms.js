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
exports.LivechatRoomsRawEE = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const readSecondaryPreferred_1 = require("../../../../server/database/readSecondaryPreferred");
const LivechatRooms_1 = require("../../../../server/models/raw/LivechatRooms");
class LivechatRoomsRawEE extends LivechatRooms_1.LivechatRoomsRaw {
    constructor(db, trash) {
        super(db, trash);
    }
    countPrioritizedRooms() {
        return this.col.countDocuments({ priorityId: { $exists: true } });
    }
    countRoomsWithSla() {
        return this.col.countDocuments({ slaId: { $exists: true } });
    }
    countRoomsWithPdfTranscriptRequested() {
        return this.col.countDocuments({ pdfTranscriptRequested: true });
    }
    countRoomsWithTranscriptSent() {
        return this.col.countDocuments({ pdfTranscriptFileId: { $exists: true } });
    }
    unsetAllPredictedVisitorAbandonment() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateMany({
                'open': true,
                't': 'l',
                'omnichannel.predictedVisitorAbandonmentAt': { $exists: true },
            }, {
                $unset: { 'omnichannel.predictedVisitorAbandonmentAt': 1 },
            }).then();
        });
    }
    setOnHoldByRoomId(roomId) {
        return this.updateOne({ _id: roomId }, { $set: { onHold: true } });
    }
    unsetOnHoldByRoomId(roomId) {
        return this.updateOne({ _id: roomId }, { $unset: { onHold: 1 } });
    }
    unsetOnHoldAndPredictedVisitorAbandonmentByRoomId(roomId) {
        return this.updateOne({
            _id: roomId,
        }, {
            $unset: {
                'omnichannel.predictedVisitorAbandonmentAt': 1,
                'onHold': 1,
            },
        });
    }
    setSlaForRoomById(roomId, sla) {
        const { _id: slaId, dueTimeInMinutes } = sla;
        return this.updateOne({
            _id: roomId,
        }, {
            $set: {
                slaId,
                estimatedWaitingTimeQueue: dueTimeInMinutes,
            },
        });
    }
    removeSlaFromRoomById(roomId) {
        return this.updateOne({
            _id: roomId,
        }, {
            $unset: {
                slaId: 1,
            },
            $set: {
                estimatedWaitingTimeQueue: core_typings_1.DEFAULT_SLA_CONFIG.ESTIMATED_WAITING_TIME_QUEUE,
            },
        });
    }
    bulkRemoveSlaFromRoomsById(slaId) {
        return this.updateMany({
            open: true,
            t: 'l',
            slaId,
        }, {
            $unset: { slaId: 1 },
            $set: {
                estimatedWaitingTimeQueue: core_typings_1.DEFAULT_SLA_CONFIG.ESTIMATED_WAITING_TIME_QUEUE,
            },
        });
    }
    findOpenBySlaId(slaId, options, extraQuery) {
        const query = Object.assign({ t: 'l', open: true, slaId }, extraQuery);
        return this.find(query, options);
    }
    setPriorityByRoomId(roomId, priority) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id: priorityId, sortItem: priorityWeight } = priority;
            return this.updateOne({ _id: roomId }, { $set: { priorityId, priorityWeight } });
        });
    }
    unsetPriorityByRoomId(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateOne({ _id: roomId }, {
                $unset: {
                    priorityId: 1,
                },
                $set: {
                    priorityWeight: core_typings_1.LivechatPriorityWeight.NOT_SPECIFIED,
                },
            });
        });
    }
    getPredictedVisitorAbandonmentByRoomIdUpdateQuery(date, roomUpdater = this.getUpdater()) {
        return roomUpdater.set('omnichannel.predictedVisitorAbandonmentAt', date);
    }
    setPredictedVisitorAbandonmentByRoomId(rid, willBeAbandonedAt) {
        const query = {
            _id: rid,
        };
        const update = {
            $set: {
                'omnichannel.predictedVisitorAbandonmentAt': willBeAbandonedAt,
            },
        };
        return this.updateOne(query, update);
    }
    findAbandonedOpenRooms(date, extraQuery) {
        return this.find(Object.assign({ 'omnichannel.predictedVisitorAbandonmentAt': { $lte: date }, 'waitingResponse': { $exists: false }, 'closedAt': { $exists: false }, 'open': true }, extraQuery));
    }
    unsetPredictedVisitorAbandonmentByRoomId(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateOne({
                _id: roomId,
            }, {
                $unset: { 'omnichannel.predictedVisitorAbandonmentAt': 1 },
            });
        });
    }
    associateRoomsWithDepartmentToUnit(departments, unitId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                $and: [
                    {
                        departmentId: { $in: departments },
                    },
                    {
                        $or: [
                            {
                                departmentAncestors: { $exists: false },
                            },
                            {
                                $and: [
                                    {
                                        departmentAncestors: { $exists: true },
                                    },
                                    {
                                        departmentAncestors: { $ne: unitId },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };
            const update = { $set: { departmentAncestors: [unitId] } };
            yield this.updateMany(query, update);
            const queryToDisassociateOldRoomsConnectedToUnit = {
                departmentAncestors: unitId,
                departmentId: { $nin: departments },
            };
            const updateToDisassociateRooms = { $unset: { departmentAncestors: 1 } };
            yield this.updateMany(queryToDisassociateOldRoomsConnectedToUnit, updateToDisassociateRooms);
        });
    }
    removeUnitAssociationFromRooms(unitId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                departmentAncestors: unitId,
            };
            const update = { $unset: { departmentAncestors: 1 } };
            yield this.updateMany(query, update);
        });
    }
    updateDepartmentAncestorsById(rid, departmentAncestors) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                _id: rid,
            };
            const update = departmentAncestors ? { $set: { departmentAncestors } } : { $unset: { departmentAncestors: 1 } };
            return this.updateOne(query, update);
        });
    }
    getConversationsBySource(start, end, extraQuery) {
        return this.col.aggregate([
            {
                $match: Object.assign({ source: {
                        $exists: true,
                    }, t: 'l', ts: {
                        $gte: start,
                        $lt: end,
                    } }, extraQuery),
            },
            {
                $group: {
                    _id: {
                        type: '$source.type',
                        alias: '$source.alias',
                    },
                    value: { $sum: 1 },
                },
            },
            {
                $sort: { value: -1 },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$value' },
                    data: {
                        $push: {
                            label: {
                                $ifNull: ['$_id.alias', '$_id.type'],
                            },
                            value: '$value',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ], { hint: 'source_1_ts_1', readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() });
    }
    getConversationsByStatus(start, end, extraQuery) {
        return this.col.aggregate([
            {
                $match: Object.assign({ t: 'l', ts: {
                        $gte: start,
                        $lt: end,
                    } }, extraQuery),
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    open: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$open', true] },
                                        {
                                            $or: [{ $not: ['$onHold'] }, { $eq: ['$onHold', false] }],
                                        },
                                        { $ifNull: ['$servedBy', false] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    closed: {
                        $sum: {
                            $cond: [
                                {
                                    $ifNull: ['$metrics.chatDuration', false],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    queued: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$open', true] },
                                        {
                                            $eq: [
                                                {
                                                    $ifNull: ['$servedBy', null],
                                                },
                                                null,
                                            ],
                                        },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    onhold: {
                        $sum: {
                            $cond: [{ $eq: ['$onHold', true] }, 1, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    total: 1,
                    data: [
                        { label: 'Open', value: '$open' },
                        { label: 'Closed', value: '$closed' },
                        { label: 'Queued', value: '$queued' },
                        { label: 'On_Hold', value: '$onhold' },
                    ],
                },
            },
            {
                $unwind: '$data',
            },
            {
                $sort: { 'data.value': -1 },
            },
            {
                $group: {
                    _id: '$_id',
                    total: { $first: '$total' },
                    data: { $push: '$data' },
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ], { readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() });
    }
    getConversationsByDepartment(start, end, sort, extraQuery) {
        return this.col.aggregate([
            {
                $match: Object.assign({ t: 'l', departmentId: {
                        $exists: true,
                    }, ts: {
                        $lt: end,
                        $gte: start,
                    } }, extraQuery),
            },
            {
                $group: {
                    _id: '$departmentId',
                    total: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'rocketchat_livechat_department',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'department',
                },
            },
            {
                $group: {
                    _id: {
                        $arrayElemAt: ['$department.name', 0],
                    },
                    total: {
                        $sum: '$total',
                    },
                },
            },
            {
                $match: {
                    _id: {
                        $ne: null,
                    },
                },
            },
            {
                $sort: sort || { total: 1 },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' },
                    data: {
                        $push: {
                            label: '$_id',
                            value: '$total',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ], { hint: 'departmentId_1_ts_1', readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() });
    }
    getTotalConversationsWithoutDepartmentBetweenDates(start, end, extraQuery) {
        return this.col.countDocuments(Object.assign({ t: 'l', departmentId: {
                $exists: false,
            }, ts: {
                $gte: start,
                $lt: end,
            } }, extraQuery));
    }
    getConversationsByTags(start, end, sort, extraQuery) {
        return this.col.aggregate([
            {
                $match: Object.assign({ t: 'l', ts: {
                        $lt: end,
                        $gte: start,
                    }, tags: {
                        $exists: true,
                        $ne: [],
                    } }, extraQuery),
            },
            {
                $group: {
                    _id: '$tags',
                    total: {
                        $sum: 1,
                    },
                },
            },
            {
                $unwind: '$_id',
            },
            {
                $group: {
                    _id: '$_id',
                    total: { $sum: '$total' },
                },
            },
            {
                $sort: sort || { total: 1 },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' },
                    data: {
                        $push: {
                            label: '$_id',
                            value: '$total',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ], { hint: 'tags.0_1_ts_1', readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() });
    }
    getConversationsWithoutTagsBetweenDate(start, end, extraQuery) {
        return this.col.countDocuments(Object.assign({ t: 'l', ts: {
                $gte: start,
                $lt: end,
            }, $or: [
                {
                    tags: {
                        $exists: false,
                    },
                },
                {
                    tags: {
                        $eq: [],
                    },
                },
            ] }, extraQuery));
    }
    getConversationsByAgents(start, end, sort, extraQuery) {
        return this.col.aggregate([
            {
                $match: Object.assign({ t: 'l', ts: {
                        $gte: start,
                        $lt: end,
                    }, servedBy: {
                        $exists: true,
                    } }, extraQuery),
            },
            {
                $group: {
                    _id: '$servedBy._id',
                    total: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'agent',
                },
            },
            {
                $set: {
                    agent: { $first: '$agent' },
                },
            },
            {
                $addFields: {
                    name: {
                        $ifNull: ['$agent.name', '$_id'],
                    },
                },
            },
            {
                $sort: sort || { name: 1 },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' },
                    data: {
                        $push: {
                            label: '$name',
                            value: '$total',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ], { hint: 'servedBy_1_ts_1', readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() });
    }
    getTotalConversationsWithoutAgentsBetweenDate(start, end, extraQuery) {
        return this.col.countDocuments(Object.assign({ t: 'l', ts: {
                $gte: start,
                $lt: end,
            }, servedBy: {
                $exists: false,
            } }, extraQuery));
    }
    updateMergedContactIds(contactIdsThatWereMerged, newContactId, options) {
        return this.updateMany({ contactId: { $in: contactIdsThatWereMerged } }, { $set: { contactId: newContactId } }, options);
    }
    findClosedRoomsByContactAndSourcePaginated({ contactId, source, options = {}, }) {
        return this.findPaginated(Object.assign({ contactId, closedAt: { $exists: true } }, (source && {
            $or: [{ 'source.type': new RegExp((0, string_helpers_1.escapeRegExp)(source), 'i') }, { 'source.alias': new RegExp((0, string_helpers_1.escapeRegExp)(source), 'i') }],
        })), options);
    }
}
exports.LivechatRoomsRawEE = LivechatRoomsRawEE;
