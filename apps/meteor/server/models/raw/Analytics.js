"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRaw = void 0;
const random_1 = require("@rocket.chat/random");
const BaseRaw_1 = require("./BaseRaw");
const readSecondaryPreferred_1 = require("../../database/readSecondaryPreferred");
class AnalyticsRaw extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'analytics', undefined, {
            collection: { readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)(db) },
        });
    }
    modelIndexes() {
        return [
            { key: { date: 1 } },
            { key: { 'room._id': 1, 'date': 1 }, unique: true, partialFilterExpression: { type: 'rooms' } },
            { key: { 'room.t': 1, 'date': 1 }, partialFilterExpression: { type: 'messages' } },
        ];
    }
    saveMessageSent({ room, date }) {
        return this.updateMany({ date, 'room._id': room._id, 'type': 'messages' }, {
            $set: {
                room: {
                    _id: room._id,
                    name: room.fname || room.name,
                    t: room.t,
                    usernames: room.usernames || [],
                },
            },
            $setOnInsert: {
                _id: random_1.Random.id(),
                date,
                type: 'messages',
            },
            $inc: { messages: 1 },
        }, { upsert: true });
    }
    saveUserData({ date }) {
        return this.updateMany({ date, type: 'users' }, {
            $setOnInsert: {
                _id: random_1.Random.id(),
                date,
                type: 'users',
            },
            $inc: { users: 1 },
        }, { upsert: true });
    }
    saveMessageDeleted({ room, date }) {
        return this.updateMany({ date, 'room._id': room._id }, {
            $inc: { messages: -1 },
        });
    }
    getMessagesSentTotalByDate({ start, end, options = {}, }) {
        return this.col.aggregate([
            {
                $match: {
                    type: 'messages',
                    date: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: '$date',
                    messages: { $sum: '$messages' },
                },
            },
            ...(options.sort ? [{ $sort: options.sort }] : []),
            ...(options.count ? [{ $limit: options.count }] : []),
        ], { readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() });
    }
    getMessagesOrigin({ start, end }) {
        const params = [
            {
                $match: {
                    type: 'messages',
                    date: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: { t: '$room.t' },
                    messages: { $sum: '$messages' },
                },
            },
            {
                $project: {
                    _id: 0,
                    t: '$_id.t',
                    messages: 1,
                },
            },
        ];
        return this.col.aggregate(params, { readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() });
    }
    getMostPopularChannelsByMessagesSentQuantity({ start, end, options = {}, }) {
        return this.col.aggregate([
            {
                $match: {
                    type: 'messages',
                    date: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: { t: '$room.t', name: '$room.name', usernames: '$room.usernames' },
                    messages: { $sum: '$messages' },
                },
            },
            {
                $project: {
                    _id: 0,
                    t: '$_id.t',
                    name: '$_id.name',
                    usernames: '$_id.usernames',
                    messages: 1,
                },
            },
            ...(options.sort ? [{ $sort: options.sort }] : []),
            ...(options.count ? [{ $limit: options.count }] : []),
        ], { readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() });
    }
    getTotalOfRegisteredUsersByDate({ start, end, options = {}, }) {
        return this.col.aggregate([
            {
                $match: {
                    type: 'users',
                    date: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: '$date',
                    users: { $sum: '$users' },
                },
            },
            ...(options.sort ? [{ $sort: options.sort }] : []),
            ...(options.count ? [{ $limit: options.count }] : []),
        ], { readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() });
    }
    findByTypeBeforeDate({ type, date }) {
        return this.find({ type, date: { $lte: date } });
    }
    getRoomsWithNumberOfMessagesBetweenDateQuery({ types, start, end, startOfLastWeek, endOfLastWeek, options, }) {
        const typeAndDateMatch = {
            $match: {
                'type': 'messages',
                'room.t': { $in: types },
                'date': { $gte: startOfLastWeek, $lte: end },
            },
        };
        const roomsGroup = {
            $group: {
                _id: '$room._id',
                room: { $first: '$room' },
                messages: { $sum: { $cond: [{ $gte: ['$date', start] }, '$messages', 0] } },
                lastWeekMessages: { $sum: { $cond: [{ $lte: ['$date', endOfLastWeek] }, '$messages', 0] } },
            },
        };
        const lookup = {
            $lookup: {
                from: 'rocketchat_room',
                localField: '_id',
                foreignField: '_id',
                as: 'room',
            },
        };
        const roomsUnwind = {
            $unwind: {
                path: '$room',
                preserveNullAndEmptyArrays: false,
            },
        };
        const project = {
            $project: {
                _id: 0,
                room: {
                    _id: '$room._id',
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
        const sort = { $sort: (options === null || options === void 0 ? void 0 : options.sort) || { messages: -1 } };
        const sortAndPaginationParams = [sort];
        if (options === null || options === void 0 ? void 0 : options.offset) {
            sortAndPaginationParams.push({ $skip: options.offset });
        }
        if (options === null || options === void 0 ? void 0 : options.count) {
            sortAndPaginationParams.push({ $limit: options.count });
        }
        const facet = {
            $facet: {
                channels: [...sortAndPaginationParams],
                total: [{ $count: 'total' }],
            },
        };
        const totalUnwind = { $unwind: '$total' };
        const totalProject = {
            $project: {
                channels: '$channels',
                total: '$total.total',
            },
        };
        const params = [
            typeAndDateMatch,
            roomsGroup,
            lookup,
            roomsUnwind,
            project,
            facet,
            totalUnwind,
            totalProject,
        ];
        return params;
    }
    findRoomsByTypesWithNumberOfMessagesBetweenDate(params) {
        const aggregationParams = this.getRoomsWithNumberOfMessagesBetweenDateQuery(params);
        return this.col.aggregate(aggregationParams, {
            allowDiskUse: true,
            readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)(),
        });
    }
}
exports.AnalyticsRaw = AnalyticsRaw;
