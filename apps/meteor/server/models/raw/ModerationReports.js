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
exports.ModerationReportsRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
const readSecondaryPreferred_1 = require("../../database/readSecondaryPreferred");
class ModerationReportsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'moderation_reports', trash);
    }
    modelIndexes() {
        return [
            // TODO deprecated. remove within a migration in v7.0
            // { key: { 'ts': 1, 'reports.ts': 1 } },
            // { key: { 'message.u._id': 1, 'ts': 1 } },
            // { key: { 'reportedUser._id': 1, 'ts': 1 } },
            // { key: { 'message.rid': 1, 'ts': 1 } },
            // { key: { 'message._id': 1, 'ts': 1 } },
            // { key: { userId: 1, ts: 1 } },
            { key: { _hidden: 1, ts: 1 } },
            { key: { 'message._id': 1, '_hidden': 1, 'ts': 1 } },
            { key: { 'message.u._id': 1, '_hidden': 1, 'ts': 1 } },
            { key: { 'reportedUser._id': 1, '_hidden': 1, 'ts': 1 } },
        ];
    }
    createWithMessageDescriptionAndUserId(message, description, room, reportedBy) {
        const record = {
            message,
            description,
            reportedBy,
            room,
            ts: new Date(),
        };
        return this.insertOne(record);
    }
    createWithDescriptionAndUser(reportedUser, description, reportedBy) {
        const record = {
            description,
            reportedBy,
            reportedUser,
            ts: new Date(),
        };
        return this.insertOne(record);
    }
    findMessageReportsGroupedByUser(latest, oldest, selector, pagination) {
        const query = Object.assign({ _hidden: {
                $ne: true,
            }, ts: {
                $lt: latest,
                $gt: oldest,
            } }, this.getSearchQueryForSelector(selector));
        const { sort, offset, count } = pagination;
        const params = [
            { $match: query },
            {
                $group: {
                    _id: { user: '$message.u._id' },
                    reports: { $first: '$$ROOT' },
                    rooms: { $addToSet: '$room' }, // to be replaced with room
                    count: { $sum: 1 },
                },
            },
            {
                $sort: sort || {
                    'reports.ts': -1,
                },
            },
            {
                $skip: offset,
            },
            {
                $limit: count,
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id.user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                // TODO: maybe clean up the projection, i.e. exclude things we don't need
                $project: {
                    _id: 0,
                    message: '$reports.message.msg',
                    msgId: '$reports.message._id',
                    ts: '$reports.ts',
                    username: '$reports.message.u.username',
                    name: '$reports.message.u.name',
                    userId: '$reports.message.u._id',
                    isUserDeleted: { $cond: ['$user', false, true] },
                    count: 1,
                    rooms: 1,
                },
            },
        ];
        return this.col.aggregate(params, { allowDiskUse: true });
    }
    findUserReports(latest, oldest, selector, pagination) {
        const query = Object.assign({ _hidden: {
                $ne: true,
            }, ts: {
                $lt: latest,
                $gt: oldest,
            } }, this.getSearchQueryForSelectorUsers(selector));
        const { sort, offset, count } = pagination;
        const pipeline = [
            { $match: query },
            {
                $sort: {
                    ts: -1,
                },
            },
            {
                $group: {
                    _id: '$reportedUser._id',
                    count: { $sum: 1 },
                    reports: { $first: '$$ROOT' },
                },
            },
            {
                $sort: sort || {
                    'reports.ts': -1,
                },
            },
            {
                $skip: offset,
            },
            {
                $limit: count,
            },
            {
                $project: {
                    _id: 0,
                    reportedUser: '$reports.reportedUser',
                    ts: '$reports.ts',
                    count: 1,
                },
            },
        ];
        return this.col.aggregate(pipeline, { allowDiskUse: true, readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() });
    }
    getTotalUniqueReportedUsers(latest, oldest, selector, isMessageReports) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const query = Object.assign({ _hidden: {
                    $ne: true,
                }, ts: {
                    $lt: latest,
                    $gt: oldest,
                } }, (isMessageReports ? this.getSearchQueryForSelector(selector) : this.getSearchQueryForSelectorUsers(selector)));
            const field = isMessageReports ? 'message.u._id' : 'reportedUser._id';
            const pipeline = [{ $match: query }, { $group: { _id: `$${field}` } }, { $group: { _id: null, count: { $sum: 1 } } }];
            const result = yield this.col.aggregate(pipeline).toArray();
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
        });
    }
    countMessageReportsInRange(latest, oldest, selector) {
        return this.col.countDocuments(Object.assign({ _hidden: { $ne: true }, ts: { $lt: latest, $gt: oldest } }, this.getSearchQueryForSelector(selector)));
    }
    findReportedMessagesByReportedUserId(userId, selector, pagination, options = {}) {
        const query = {
            '_hidden': {
                $ne: true,
            },
            'message.u._id': userId,
        };
        const { sort, offset, count } = pagination;
        const fuzzyQuery = selector
            ? {
                'message.msg': {
                    $regex: selector,
                    $options: 'i',
                },
            }
            : {};
        const params = Object.assign({ sort: sort || {
                ts: -1,
            }, skip: offset, limit: count, projection: {
                _id: 1,
                message: 1,
                ts: 1,
                room: 1,
            } }, options);
        return this.findPaginated(Object.assign(Object.assign({}, query), fuzzyQuery), params);
    }
    findUserReportsByReportedUserId(userId, selector, pagination, options = {}) {
        const query = Object.assign({ '_hidden': {
                $ne: true,
            }, 'reportedUser._id': userId }, this.getSearchQueryForSelectorUsers(selector));
        const { count, offset, sort } = pagination;
        const opts = Object.assign({ sort: sort || {
                ts: -1,
            }, skip: offset, limit: count, projection: {
                _id: 1,
                description: 1,
                ts: 1,
                reportedBy: 1,
                reportedUser: 1,
            } }, options);
        return this.findPaginated(query, opts);
    }
    findReportsByMessageId(messageId, selector, pagination, options = {}) {
        const query = Object.assign({ '_hidden': {
                $ne: true,
            }, 'message._id': messageId }, this.getSearchQueryForSelector(selector));
        const { count, offset, sort } = pagination;
        const opts = Object.assign({ sort: sort || {
                ts: -1,
            }, skip: offset, limit: count, projection: {
                _id: 1,
                description: 1,
                ts: 1,
                reportedBy: 1,
                room: 1,
            } }, options);
        return this.findPaginated(query, opts);
    }
    hideMessageReportsByMessageId(messageId, userId, reason, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                'message._id': messageId,
            };
            const update = {
                $set: {
                    _hidden: true,
                    moderationInfo: { hiddenAt: new Date(), moderatedBy: userId, reason, action },
                },
            };
            return this.updateMany(query, update);
        });
    }
    hideMessageReportsByUserId(userId, moderatorId, reason, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                'message.u._id': userId,
            };
            const update = {
                $set: {
                    _hidden: true,
                    moderationInfo: { hiddenAt: new Date(), moderatedBy: moderatorId, reason, action },
                },
            };
            return this.updateMany(query, update);
        });
    }
    hideUserReportsByUserId(userId, moderatorId, reason, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                'reportedUser._id': userId,
            };
            const update = {
                $set: {
                    _hidden: true,
                    moderationInfo: { hiddenAt: new Date(), moderatedBy: moderatorId, reason, action },
                },
            };
            return this.updateMany(query, update);
        });
    }
    getSearchQueryForSelector(selector) {
        const messageExistsQuery = { message: { $exists: true } };
        if (!selector) {
            return messageExistsQuery;
        }
        return Object.assign(Object.assign({}, messageExistsQuery), { $or: [
                {
                    'message.msg': {
                        $regex: selector,
                        $options: 'i',
                    },
                },
                {
                    description: {
                        $regex: selector,
                        $options: 'i',
                    },
                },
                {
                    'message.u.username': {
                        $regex: selector,
                        $options: 'i',
                    },
                },
                {
                    'message.u.name': {
                        $regex: selector,
                        $options: 'i',
                    },
                },
            ] });
    }
    getSearchQueryForSelectorUsers(selector) {
        const messageAbsentQuery = { message: { $exists: false } };
        if (!selector) {
            return messageAbsentQuery;
        }
        return Object.assign(Object.assign({}, messageAbsentQuery), { $or: [
                {
                    'reportedUser.username': {
                        $regex: selector,
                        $options: 'i',
                    },
                },
                {
                    'reportedUser.name': {
                        $regex: selector,
                        $options: 'i',
                    },
                },
            ] });
    }
}
exports.ModerationReportsRaw = ModerationReportsRaw;
