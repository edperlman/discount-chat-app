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
exports.LivechatInquiryRaw = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const BaseRaw_1 = require("./BaseRaw");
const inquiries_1 = require("../../../app/livechat/lib/inquiries");
const readSecondaryPreferred_1 = require("../../database/readSecondaryPreferred");
class LivechatInquiryRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'livechat_inquiry', trash);
    }
    modelIndexes() {
        return [
            {
                key: {
                    rid: 1,
                },
            },
            {
                key: {
                    name: 1,
                },
            },
            {
                key: {
                    message: 1,
                },
            },
            {
                key: {
                    ts: 1,
                },
            },
            {
                key: {
                    department: 1,
                },
            },
            {
                key: {
                    status: 1,
                },
            },
            {
                key: {
                    priorityId: 1,
                    priorityWeight: 1,
                },
                sparse: true,
            },
            {
                key: {
                    priorityWeight: 1,
                    ts: 1,
                },
                partialFilterExpression: {
                    status: { $eq: core_typings_1.LivechatInquiryStatus.QUEUED },
                },
            },
            {
                key: {
                    estimatedWaitingTimeQueue: 1,
                    ts: 1,
                },
                partialFilterExpression: {
                    status: { $eq: core_typings_1.LivechatInquiryStatus.QUEUED },
                },
            },
            {
                key: {
                    'v.token': 1,
                    'status': 1,
                },
            },
            {
                key: {
                    locked: 1,
                    lockedAt: 1,
                },
                sparse: true,
            },
            { key: { 'v._id': 1 } },
        ];
    }
    findOneQueuedByRoomId(rid) {
        const query = {
            rid,
            status: core_typings_1.LivechatInquiryStatus.QUEUED,
        };
        return this.findOne(query);
    }
    findOneByRoomId(rid, options) {
        const query = {
            rid,
        };
        return this.findOne(query, options);
    }
    findOneReadyByRoomId(rid, options) {
        const query = {
            rid,
            status: core_typings_1.LivechatInquiryStatus.READY,
        };
        return this.findOne(query, options);
    }
    findIdsByVisitorToken(token) {
        return this.find({ 'v.token': token }, { projection: { _id: 1 } });
    }
    getDistinctQueuedDepartments(options) {
        return this.col.distinct('department', { status: core_typings_1.LivechatInquiryStatus.QUEUED }, options);
    }
    setDepartmentByInquiryId(inquiryId, department) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.findOneAndUpdate({ _id: inquiryId }, { $set: { department } }, { returnDocument: 'after' });
            return updated === null || updated === void 0 ? void 0 : updated.value;
        });
    }
    setLastMessageByRoomId(rid, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.findOneAndUpdate({ rid }, { $set: { lastMessage: message } }, { returnDocument: 'after' });
            return updated === null || updated === void 0 ? void 0 : updated.value;
        });
    }
    findNextAndLock(queueSortBy, department) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            const result = yield this.findOneAndUpdate(Object.assign(Object.assign({ status: core_typings_1.LivechatInquiryStatus.QUEUED }, (department ? { department } : { department: { $exists: false } })), { $or: [
                    {
                        locked: true,
                        lockedAt: {
                            $lte: new Date(date.getTime() - 5000),
                        },
                    },
                    {
                        locked: { $ne: true },
                    },
                ] }), {
                $set: {
                    locked: true,
                    // apply 5 secs lock lifetime
                    lockedAt: new Date(),
                },
            }, {
                sort: (0, inquiries_1.getOmniChatSortQuery)(queueSortBy),
            });
            return result.value;
        });
    }
    unlock(inquiryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateOne({ _id: inquiryId }, { $unset: { locked: 1, lockedAt: 1 } });
        });
    }
    unlockAndQueue(inquiryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateOne({ _id: inquiryId }, { $unset: { locked: 1, lockedAt: 1 }, $set: { status: core_typings_1.LivechatInquiryStatus.QUEUED, queuedAt: new Date() } });
        });
    }
    unlockAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateMany({ locked: { $exists: true } }, { $unset: { locked: 1, lockedAt: 1 }, $set: { status: core_typings_1.LivechatInquiryStatus.QUEUED, queuedAt: new Date() } });
        });
    }
    getCurrentSortedQueueAsync(_a) {
        return __awaiter(this, arguments, void 0, function* ({ inquiryId, department, queueSortBy, }) {
            const filter = [
                {
                    $match: Object.assign({ status: 'queued' }, (department && { department })),
                },
                { $sort: (0, inquiries_1.getOmniChatSortQuery)(queueSortBy) },
                {
                    $group: {
                        _id: 1,
                        inquiry: {
                            $push: {
                                _id: '$_id',
                                rid: '$rid',
                                name: '$name',
                                ts: '$ts',
                                status: '$status',
                                department: '$department',
                            },
                        },
                    },
                },
                {
                    $unwind: {
                        path: '$inquiry',
                        includeArrayIndex: 'position',
                    },
                },
                {
                    $project: {
                        _id: '$inquiry._id',
                        rid: '$inquiry.rid',
                        name: '$inquiry.name',
                        ts: '$inquiry.ts',
                        status: '$inquiry.status',
                        department: '$inquiry.department',
                        position: 1,
                    },
                },
            ];
            // To get the current room position in the queue, we need to apply the next $match after the $project
            if (inquiryId) {
                filter.push({ $match: { _id: inquiryId } });
            }
            return this.col
                .aggregate(filter, {
                readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)(),
            })
                .toArray();
        });
    }
    setSlaForRoom(_rid, _data) {
        throw new Error('Method not implemented on the community edition.');
    }
    unsetSlaForRoom(_roomId) {
        throw new Error('Method not implemented on the community edition.');
    }
    bulkUnsetSla(_roomIds) {
        throw new Error('Method not implemented on the community edition.');
    }
    setPriorityForRoom(_rid, _priority) {
        throw new Error('Method not implemented on the community edition.');
    }
    unsetPriorityForRoom(_rid) {
        throw new Error('Method not implemented on the community edition.');
    }
    removeByRoomId(rid, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteOne({ rid }, options);
        });
    }
    getQueuedInquiries(options) {
        return this.find({ status: core_typings_1.LivechatInquiryStatus.QUEUED }, options);
    }
    takeInquiry(inquiryId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({
                _id: inquiryId,
            }, {
                $set: { status: core_typings_1.LivechatInquiryStatus.TAKEN, takenAt: new Date() },
                $unset: { defaultAgent: 1, estimatedInactivityCloseTimeAt: 1, queuedAt: 1 },
            });
        });
    }
    openInquiry(inquiryId) {
        return this.updateOne({
            _id: inquiryId,
        }, {
            $set: { status: core_typings_1.LivechatInquiryStatus.OPEN },
        });
    }
    queueInquiry(inquiryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.findOneAndUpdate({
                _id: inquiryId,
            }, {
                $set: { status: core_typings_1.LivechatInquiryStatus.QUEUED, queuedAt: new Date() },
                $unset: { takenAt: 1 },
            }, { returnDocument: 'after' });
            return result === null || result === void 0 ? void 0 : result.value;
        });
    }
    queueInquiryAndRemoveDefaultAgent(inquiryId) {
        return this.updateOne({
            _id: inquiryId,
        }, {
            $set: { status: core_typings_1.LivechatInquiryStatus.QUEUED, queuedAt: new Date() },
            $unset: { takenAt: 1, defaultAgent: 1 },
        });
    }
    readyInquiry(inquiryId) {
        return this.updateOne({
            _id: inquiryId,
        }, {
            $set: {
                status: core_typings_1.LivechatInquiryStatus.READY,
            },
        });
    }
    changeDepartmentIdByRoomId(rid, department) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                rid,
            };
            const updateObj = {
                $set: {
                    department,
                },
            };
            yield this.updateOne(query, updateObj);
        });
    }
    getStatus(inquiryId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = (yield this.findOne({ _id: inquiryId }))) === null || _a === void 0 ? void 0 : _a.status;
        });
    }
    updateVisitorStatus(token, status) {
        const query = {
            'v.token': token,
            'status': core_typings_1.LivechatInquiryStatus.QUEUED,
        };
        const update = {
            $set: {
                'v.status': status,
            },
        };
        return this.updateOne(query, update);
    }
    setDefaultAgentById(inquiryId, defaultAgent) {
        return this.updateOne({
            _id: inquiryId,
        }, {
            $set: {
                defaultAgent,
            },
        });
    }
    setStatusById(inquiryId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.findOneAndUpdate({ _id: inquiryId }, { $set: { status } }, {
                upsert: true,
                returnDocument: 'after',
            });
            if (!result.value) {
                throw new Error('error-failed-to-set-inquiry-status');
            }
            return result.value;
        });
    }
    setNameByRoomId(rid, name) {
        const query = { rid };
        const update = {
            $set: {
                name,
            },
        };
        return this.updateOne(query, update);
    }
    findOneByToken(token) {
        const query = {
            'v.token': token,
            'status': core_typings_1.LivechatInquiryStatus.QUEUED,
        };
        return this.findOne(query);
    }
    removeDefaultAgentById(inquiryId) {
        return this.updateOne({
            _id: inquiryId,
        }, {
            $unset: { defaultAgent: 1 },
        });
    }
    removeByVisitorToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                'v.token': token,
            };
            yield this.deleteMany(query);
        });
    }
    markInquiryActiveForPeriod(rid, period) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.findOneAndUpdate({ rid }, { $addToSet: { 'v.activity': period } });
            return updated === null || updated === void 0 ? void 0 : updated.value;
        });
    }
    updateNameByVisitorIds(visitorIds, name) {
        const query = { 'v._id': { $in: visitorIds } };
        const update = {
            $set: { name },
        };
        return this.updateMany(query, update);
    }
    findByVisitorIds(visitorIds, options) {
        return this.find({ 'v._id': { $in: visitorIds } }, options);
    }
}
exports.LivechatInquiryRaw = LivechatInquiryRaw;
