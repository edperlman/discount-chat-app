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
exports.SessionsRaw = exports.aggregates = void 0;
const models_1 = require("@rocket.chat/models");
const BaseRaw_1 = require("./BaseRaw");
const readSecondaryPreferred_1 = require("../../database/readSecondaryPreferred");
const matchBasedOnDate = (start, end) => {
    if (start.year === end.year && start.month === end.month) {
        return {
            year: start.year,
            month: start.month,
            day: { $gte: start.day, $lte: end.day },
        };
    }
    if (start.year === end.year) {
        return {
            year: start.year,
            $and: [
                {
                    $or: [
                        {
                            month: { $gt: start.month },
                        },
                        {
                            month: start.month,
                            day: { $gte: start.day },
                        },
                    ],
                },
                {
                    $or: [
                        {
                            month: { $lt: end.month },
                        },
                        {
                            month: end.month,
                            day: { $lte: end.day },
                        },
                    ],
                },
            ],
        };
    }
    return {
        $and: [
            {
                $or: [
                    {
                        year: { $gt: start.year },
                    },
                    {
                        year: start.year,
                        month: { $gt: start.month },
                    },
                    {
                        year: start.year,
                        month: start.month,
                        day: { $gte: start.day },
                    },
                ],
            },
            {
                $or: [
                    {
                        year: { $lt: end.year },
                    },
                    {
                        year: end.year,
                        month: { $lt: end.month },
                    },
                    {
                        year: end.year,
                        month: end.month,
                        day: { $lte: end.day },
                    },
                ],
            },
        ],
    };
};
const getGroupSessionsByHour = (_id) => {
    const isOpenSession = { $not: ['$session.closedAt'] };
    const isAfterLoginAt = { $gte: ['$range', { $hour: '$session.loginAt' }] };
    const isBeforeClosedAt = { $lte: ['$range', { $hour: '$session.closedAt' }] };
    const listGroup = {
        $group: {
            _id,
            usersList: {
                $addToSet: {
                    $cond: [
                        {
                            $or: [{ $and: [isOpenSession, isAfterLoginAt] }, { $and: [isAfterLoginAt, isBeforeClosedAt] }],
                        },
                        '$session.userId',
                        '$$REMOVE',
                    ],
                },
            },
        },
    };
    const countGroup = {
        $addFields: {
            users: { $size: '$usersList' },
        },
    };
    return { listGroup, countGroup };
};
const getSortByFullDate = () => ({
    year: -1,
    month: -1,
    day: -1,
});
const getProjectionByFullDate = () => ({
    day: '$_id.day',
    month: '$_id.month',
    year: '$_id.year',
});
const getProjectionFullDate = () => ({
    day: '$day',
    month: '$month',
    year: '$year',
});
exports.aggregates = {
    dailySessions(collection, { start, end }) {
        const pipeline = [
            {
                $match: Object.assign({ userId: { $exists: true }, lastActivityAt: { $exists: true }, device: { $exists: true }, type: 'session' }, matchBasedOnDate(start, end)),
            },
            {
                $project: {
                    userId: 1,
                    device: 1,
                    day: 1,
                    month: 1,
                    year: 1,
                    mostImportantRole: 1,
                    time: { $trunc: { $divide: [{ $subtract: ['$lastActivityAt', '$loginAt'] }, 1000] } },
                },
            },
            {
                $match: {
                    time: { $gt: 0 },
                },
            },
            {
                $group: {
                    _id: Object.assign({ userId: '$userId', device: '$device' }, getProjectionFullDate()),
                    mostImportantRole: { $first: '$mostImportantRole' },
                    time: { $sum: '$time' },
                    sessions: { $sum: 1 },
                },
            },
            {
                $sort: {
                    time: -1,
                },
            },
            {
                $group: {
                    _id: Object.assign({ userId: '$_id.userId' }, getProjectionByFullDate()),
                    mostImportantRole: { $first: '$mostImportantRole' },
                    time: { $sum: '$time' },
                    sessions: { $sum: '$sessions' },
                    devices: {
                        $push: {
                            sessions: '$sessions',
                            time: '$time',
                            device: '$_id.device',
                        },
                    },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
            {
                $project: Object.assign(Object.assign({ _id: 0, type: { $literal: 'user_daily' }, _computedAt: { $literal: new Date() } }, getProjectionByFullDate()), { userId: '$_id.userId', mostImportantRole: 1, time: 1, sessions: 1, devices: 1 }),
            },
        ];
        return collection.aggregate(pipeline, { allowDiskUse: true });
    },
    getUniqueUsersOfYesterday(collection_1, _a) {
        return __awaiter(this, arguments, void 0, function* (collection, { year, month, day }) {
            return collection
                .aggregate([
                {
                    $match: {
                        year,
                        month,
                        day,
                        type: 'user_daily',
                    },
                },
                {
                    $group: {
                        _id: Object.assign(Object.assign({}, getProjectionFullDate()), { mostImportantRole: '$mostImportantRole' }),
                        count: {
                            $sum: 1,
                        },
                        sessions: {
                            $sum: '$sessions',
                        },
                        time: {
                            $sum: '$time',
                        },
                    },
                },
                {
                    $group: {
                        _id: Object.assign({}, getProjectionFullDate()),
                        roles: {
                            $push: {
                                role: '$_id.mostImportantRole',
                                count: '$count',
                                sessions: '$sessions',
                                time: '$time',
                            },
                        },
                        count: {
                            $sum: '$count',
                        },
                        sessions: {
                            $sum: '$sessions',
                        },
                        time: {
                            $sum: '$time',
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        sessions: 1,
                        time: 1,
                        roles: 1,
                    },
                },
            ])
                .toArray();
        });
    },
    getUniqueUsersOfLastMonthOrWeek(collection_1, _a) {
        return __awaiter(this, arguments, void 0, function* (collection, { year, month, day, type = 'month' }) {
            return collection
                .aggregate([
                {
                    $match: Object.assign({ type: 'user_daily' }, exports.aggregates.getMatchOfLastMonthOrWeek({ year, month, day, type })),
                },
                {
                    $group: {
                        _id: {
                            userId: '$userId',
                        },
                        mostImportantRole: { $first: '$mostImportantRole' },
                        sessions: {
                            $sum: '$sessions',
                        },
                        time: {
                            $sum: '$time',
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            mostImportantRole: '$mostImportantRole',
                        },
                        count: {
                            $sum: 1,
                        },
                        sessions: {
                            $sum: '$sessions',
                        },
                        time: {
                            $sum: '$time',
                        },
                    },
                },
                {
                    $sort: {
                        time: -1,
                    },
                },
                {
                    $group: {
                        _id: 1,
                        roles: {
                            $push: {
                                role: '$_id.mostImportantRole',
                                count: '$count',
                                sessions: '$sessions',
                                time: '$time',
                            },
                        },
                        count: {
                            $sum: '$count',
                        },
                        sessions: {
                            $sum: '$sessions',
                        },
                        time: {
                            $sum: '$time',
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        roles: 1,
                        sessions: 1,
                        time: 1,
                    },
                },
            ], { allowDiskUse: true })
                .toArray();
        });
    },
    getMatchOfLastMonthOrWeek({ year, month, day, type = 'month' }) {
        let startOfPeriod;
        if (type === 'month') {
            const pastMonthLastDay = new Date(year, month - 1, 0).getDate();
            const currMonthLastDay = new Date(year, month, 0).getDate();
            startOfPeriod = new Date(year, month - 1, day);
            startOfPeriod.setMonth(startOfPeriod.getMonth() - 1, (currMonthLastDay === day ? pastMonthLastDay : Math.min(pastMonthLastDay, day)) + 1);
        }
        else {
            startOfPeriod = new Date(year, month - 1, day - 6);
        }
        const startOfPeriodObject = {
            year: startOfPeriod.getFullYear(),
            month: startOfPeriod.getMonth() + 1,
            day: startOfPeriod.getDate(),
        };
        if (year === startOfPeriodObject.year && month === startOfPeriodObject.month) {
            return {
                year,
                month,
                day: { $gte: startOfPeriodObject.day, $lte: day },
            };
        }
        if (year === startOfPeriodObject.year) {
            return {
                year,
                $and: [
                    {
                        $or: [
                            {
                                month: { $gt: startOfPeriodObject.month },
                            },
                            {
                                month: startOfPeriodObject.month,
                                day: { $gte: startOfPeriodObject.day },
                            },
                        ],
                    },
                    {
                        $or: [
                            {
                                month: { $lt: month },
                            },
                            {
                                month,
                                day: { $lte: day },
                            },
                        ],
                    },
                ],
            };
        }
        return {
            $and: [
                {
                    $or: [
                        {
                            year: { $gt: startOfPeriodObject.year },
                        },
                        {
                            year: startOfPeriodObject.year,
                            month: { $gt: startOfPeriodObject.month },
                        },
                        {
                            year: startOfPeriodObject.year,
                            month: startOfPeriodObject.month,
                            day: { $gte: startOfPeriodObject.day },
                        },
                    ],
                },
                {
                    $or: [
                        {
                            year: { $lt: year },
                        },
                        {
                            year,
                            month: { $lt: month },
                        },
                        {
                            year,
                            month,
                            day: { $lte: day },
                        },
                    ],
                },
            ],
        };
    },
    getUniqueDevicesOfLastMonthOrWeek(collection_1, _a) {
        return __awaiter(this, arguments, void 0, function* (collection, { year, month, day, type = 'month' }) {
            return collection
                .aggregate([
                {
                    $match: Object.assign({ type: 'user_daily' }, exports.aggregates.getMatchOfLastMonthOrWeek({ year, month, day, type })),
                },
                {
                    $unwind: '$devices',
                },
                {
                    $group: {
                        _id: {
                            type: '$devices.device.type',
                            name: '$devices.device.name',
                            version: '$devices.device.version',
                        },
                        count: {
                            $sum: '$devices.sessions',
                        },
                        time: {
                            $sum: '$devices.time',
                        },
                    },
                },
                {
                    $sort: {
                        time: -1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        type: '$_id.type',
                        name: '$_id.name',
                        version: '$_id.version',
                        count: 1,
                        time: 1,
                    },
                },
            ], { allowDiskUse: true })
                .toArray();
        });
    },
    getUniqueDevicesOfYesterday(collection, { year, month, day }) {
        return collection
            .aggregate([
            {
                $match: {
                    year,
                    month,
                    day,
                    type: 'user_daily',
                },
            },
            {
                $unwind: '$devices',
            },
            {
                $group: {
                    _id: {
                        type: '$devices.device.type',
                        name: '$devices.device.name',
                        version: '$devices.device.version',
                    },
                    count: {
                        $sum: '$devices.sessions',
                    },
                    time: {
                        $sum: '$devices.time',
                    },
                },
            },
            {
                $sort: {
                    time: -1,
                },
            },
            {
                $project: {
                    _id: 0,
                    type: '$_id.type',
                    name: '$_id.name',
                    version: '$_id.version',
                    count: 1,
                    time: 1,
                },
            },
        ])
            .toArray();
    },
    getUniqueOSOfLastMonthOrWeek(collection, { year, month, day, type = 'month' }) {
        return collection
            .aggregate([
            {
                $match: Object.assign({ 'type': 'user_daily', 'devices.device.os.name': {
                        $exists: true,
                    } }, exports.aggregates.getMatchOfLastMonthOrWeek({ year, month, day, type })),
            },
            {
                $unwind: '$devices',
            },
            {
                $group: {
                    _id: {
                        name: '$devices.device.os.name',
                        version: '$devices.device.os.version',
                    },
                    count: {
                        $sum: '$devices.sessions',
                    },
                    time: {
                        $sum: '$devices.time',
                    },
                },
            },
            {
                $sort: {
                    time: -1,
                },
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id.name',
                    version: '$_id.version',
                    count: 1,
                    time: 1,
                },
            },
        ], { allowDiskUse: true })
            .toArray();
    },
    getUniqueOSOfYesterday(collection, { year, month, day }) {
        return collection
            .aggregate([
            {
                $match: {
                    year,
                    month,
                    day,
                    'type': 'user_daily',
                    'devices.device.os.name': {
                        $exists: true,
                    },
                },
            },
            {
                $unwind: '$devices',
            },
            {
                $group: {
                    _id: {
                        name: '$devices.device.os.name',
                        version: '$devices.device.os.version',
                    },
                    count: {
                        $sum: '$devices.sessions',
                    },
                    time: {
                        $sum: '$devices.time',
                    },
                },
            },
            {
                $sort: {
                    time: -1,
                },
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id.name',
                    version: '$_id.version',
                    count: 1,
                    time: 1,
                },
            },
        ])
            .toArray();
    },
};
class SessionsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'sessions', trash);
        this.secondaryCollection = db.collection((0, models_1.getCollectionName)('sessions'), { readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)(db) });
    }
    aggregateSessionsByUserId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ uid, sort, search, offset = 0, count = 10, }) {
            const searchQuery = search ? [{ searchTerm: { $regex: search, $options: 'i' } }] : [];
            const matchOperator = {
                $match: {
                    $and: [
                        ...searchQuery,
                        {
                            userId: {
                                $eq: uid,
                            },
                        },
                        {
                            loginToken: {
                                $exists: true,
                                $ne: '',
                            },
                        },
                        {
                            logoutAt: {
                                $exists: false,
                            },
                        },
                    ],
                },
            };
            const sortOperator = {
                $sort: {
                    loginAt: -1,
                },
            };
            const customSortOp = !sort ? [] : [{ $sort: sort }];
            const groupOperator = {
                $group: {
                    _id: '$loginToken',
                    sessionId: {
                        $first: '$sessionId',
                    },
                    userId: {
                        $first: '$userId',
                    },
                    device: {
                        $first: '$device',
                    },
                    host: {
                        $first: '$host',
                    },
                    ip: {
                        $first: '$ip',
                    },
                    loginAt: {
                        $first: '$loginAt',
                    },
                },
            };
            const skipOperator = offset >= 1 ? [{ $skip: offset }] : [];
            const limitOperator = { $limit: count };
            const projectOperator = {
                $project: {
                    _id: '$sessionId',
                    sessionId: 1,
                    userId: 1,
                    device: 1,
                    host: 1,
                    ip: 1,
                    loginAt: 1,
                },
            };
            const facetOperator = {
                $facet: {
                    docs: [sortOperator, ...skipOperator, limitOperator, ...customSortOp],
                    count: [
                        {
                            $count: 'total',
                        },
                    ],
                },
            };
            const queryArray = [matchOperator, sortOperator, groupOperator, projectOperator, facetOperator];
            const [{ docs: sessions, count: [{ total } = { total: 0 }], },] = yield this.col.aggregate(queryArray).toArray();
            return { sessions, total, count, offset };
        });
    }
    aggregateSessionsAndPopulate(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sort, search, offset = 0, count = 10, }) {
            const searchQuery = search ? [{ searchTerm: { $regex: search, $options: 'i' } }] : [];
            const matchOperator = {
                $match: {
                    $and: [
                        ...searchQuery,
                        {
                            loginToken: {
                                $exists: true,
                                $ne: '',
                            },
                            sessionId: {
                                $exists: true,
                                $ne: '',
                            },
                        },
                        {
                            logoutAt: {
                                $exists: false,
                            },
                        },
                    ],
                },
            };
            const sortOperator = {
                $sort: {
                    loginAt: -1,
                },
            };
            const customSortOp = !sort ? [] : [{ $sort: sort }];
            const groupOperator = {
                $group: {
                    _id: '$loginToken',
                    sessionId: {
                        $first: '$sessionId',
                    },
                    userId: {
                        $first: '$userId',
                    },
                    device: {
                        $first: '$device',
                    },
                    host: {
                        $first: '$host',
                    },
                    ip: {
                        $first: '$ip',
                    },
                    loginAt: {
                        $first: '$loginAt',
                    },
                },
            };
            const limitOperator = { $limit: count };
            const skipOperator = offset >= 1 ? [{ $skip: offset }] : [];
            const lookupOperator = {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: '_user',
                },
            };
            const unwindOperator = {
                $unwind: {
                    path: '$_user',
                    preserveNullAndEmptyArrays: true,
                },
            };
            const projectOperator = {
                $project: {
                    _id: '$sessionId',
                    sessionId: 1,
                    device: 1,
                    host: 1,
                    ip: 1,
                    loginAt: 1,
                    userId: 1,
                    _user: {
                        name: 1,
                        username: 1,
                        avatarETag: 1,
                        avatarOrigin: 1,
                    },
                },
            };
            const facetOperator = {
                $facet: {
                    docs: [sortOperator, ...skipOperator, limitOperator, lookupOperator, unwindOperator, projectOperator, ...customSortOp],
                    count: [
                        {
                            $count: 'total',
                        },
                    ],
                },
            };
            const queryArray = [matchOperator, sortOperator, groupOperator, facetOperator];
            const [{ docs: sessions, count: [{ total } = { total: 0 }], },] = yield this.col.aggregate(queryArray).toArray();
            return { sessions, total, count, offset };
        });
    }
    modelIndexes() {
        return [
            { key: { createdAt: -1 } },
            { key: { loginAt: -1 } },
            { key: { searchTerm: 1 }, partialFilterExpression: { searchTerm: { $exists: true } }, background: true },
            { key: { ip: 1, loginAt: -1 } },
            { key: { userId: 1, sessionId: 1 } },
            { key: { type: 1, year: 1, month: 1, day: 1 } },
            { key: { sessionId: 1, instanceId: 1, year: 1, month: 1, day: 1 } },
            { key: { _computedAt: 1 }, expireAfterSeconds: 60 * 60 * 24 * 45 },
            {
                key: { 'loginToken': 1, 'logoutAt': 1, 'userId': 1, 'device.name': 1, 'device.os.name': 1, 'logintAt': -1 },
                partialFilterExpression: { loginToken: { $exists: true } },
                background: true,
            },
        ];
    }
    getActiveUsersBetweenDates(_a) {
        return __awaiter(this, arguments, void 0, function* ({ start, end }) {
            return this.col
                .aggregate([
                {
                    $match: Object.assign(Object.assign({}, matchBasedOnDate(start, end)), { type: 'user_daily' }),
                },
                {
                    $group: {
                        _id: '$userId',
                    },
                },
            ])
                .toArray();
        });
    }
    findLastLoginByIp(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({
                ip,
            }, {
                sort: { loginAt: -1 },
                limit: 1,
            });
        });
    }
    findOneBySessionId(sessionId) {
        return this.findOne({ sessionId });
    }
    findOneBySessionIdAndUserId(sessionId, userId) {
        return this.findOne({ sessionId, userId, loginToken: { $exists: true, $ne: '' } });
    }
    findSessionsNotClosedByDateWithoutLastActivity({ year, month, day }) {
        return this.find({
            year,
            month,
            day,
            type: 'session',
            closedAt: { $exists: false },
            lastActivityAt: { $exists: false },
        });
    }
    getActiveUsersOfPeriodByDayBetweenDates(_a) {
        return __awaiter(this, arguments, void 0, function* ({ start, end }) {
            return this.col
                .aggregate([
                {
                    $match: Object.assign(Object.assign({}, matchBasedOnDate(start, end)), { type: 'user_daily', mostImportantRole: { $ne: 'anonymous' } }),
                },
                {
                    $group: {
                        _id: Object.assign(Object.assign({}, getProjectionFullDate()), { userId: '$userId' }),
                    },
                },
                {
                    $group: {
                        _id: Object.assign({}, getProjectionByFullDate()),
                        usersList: {
                            $addToSet: '$_id.userId',
                        },
                        users: { $sum: 1 },
                    },
                },
                {
                    $project: Object.assign(Object.assign({ _id: 0 }, getProjectionByFullDate()), { usersList: 1, users: 1 }),
                },
                {
                    $sort: Object.assign({}, getSortByFullDate()),
                },
            ])
                .toArray();
        });
    }
    getBusiestTimeWithinHoursPeriod(_a) {
        return __awaiter(this, arguments, void 0, function* ({ start, end, groupSize }) {
            const match = {
                $match: {
                    type: 'computed-session',
                    loginAt: { $gte: start, $lte: end },
                },
            };
            const rangeProject = {
                $project: {
                    range: {
                        $range: [0, 24, groupSize],
                    },
                    session: '$$ROOT',
                },
            };
            const unwind = {
                $unwind: '$range',
            };
            const groups = getGroupSessionsByHour('$range');
            const presentationProject = {
                $project: {
                    _id: 0,
                    hour: '$_id',
                    users: 1,
                },
            };
            const sort = {
                $sort: {
                    hour: -1,
                },
            };
            return this.col
                .aggregate([match, rangeProject, unwind, groups.listGroup, groups.countGroup, presentationProject, sort])
                .toArray();
        });
    }
    getTotalOfSessionsByDayBetweenDates(_a) {
        return __awaiter(this, arguments, void 0, function* ({ start, end }) {
            return this.col
                .aggregate([
                {
                    $match: Object.assign(Object.assign({}, matchBasedOnDate(start, end)), { type: 'user_daily', mostImportantRole: { $ne: 'anonymous' } }),
                },
                {
                    $group: {
                        _id: Object.assign({}, getProjectionFullDate()),
                        users: { $sum: 1 },
                    },
                },
                {
                    $project: Object.assign(Object.assign({ _id: 0 }, getProjectionByFullDate()), { users: 1 }),
                },
                {
                    $sort: Object.assign({}, getSortByFullDate()),
                },
            ])
                .toArray();
        });
    }
    getTotalOfSessionByHourAndDayBetweenDates(_a) {
        return __awaiter(this, arguments, void 0, function* ({ start, end }) {
            const match = {
                $match: {
                    type: 'computed-session',
                    loginAt: { $gte: start, $lte: end },
                },
            };
            const rangeProject = {
                $project: {
                    range: {
                        $range: [{ $hour: '$loginAt' }, { $sum: [{ $ifNull: [{ $hour: '$closedAt' }, 23] }, 1] }],
                    },
                    session: '$$ROOT',
                },
            };
            const unwind = {
                $unwind: '$range',
            };
            const groups = getGroupSessionsByHour({
                range: '$range',
                day: '$session.day',
                month: '$session.month',
                year: '$session.year',
            });
            const presentationProject = {
                $project: Object.assign(Object.assign({ _id: 0, hour: '$_id.range' }, getProjectionByFullDate()), { users: 1 }),
            };
            const sort = {
                $sort: Object.assign(Object.assign({}, getSortByFullDate()), { hour: -1 }),
            };
            return this.col
                .aggregate([match, rangeProject, unwind, groups.listGroup, groups.countGroup, presentationProject, sort])
                .toArray();
        });
    }
    getUniqueUsersOfYesterday() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return {
                year,
                month,
                day,
                data: yield exports.aggregates.getUniqueUsersOfYesterday(this.secondaryCollection, {
                    year,
                    month,
                    day,
                }),
            };
        });
    }
    getUniqueUsersOfLastMonth() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return {
                year,
                month,
                day,
                data: yield exports.aggregates.getUniqueUsersOfLastMonthOrWeek(this.secondaryCollection, {
                    year,
                    month,
                    day,
                }),
            };
        });
    }
    getUniqueUsersOfLastWeek() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return {
                year,
                month,
                day,
                data: yield exports.aggregates.getUniqueUsersOfLastMonthOrWeek(this.secondaryCollection, {
                    year,
                    month,
                    day,
                    type: 'week',
                }),
            };
        });
    }
    getUniqueDevicesOfYesterday() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return {
                year,
                month,
                day,
                data: yield exports.aggregates.getUniqueDevicesOfYesterday(this.secondaryCollection, {
                    year,
                    month,
                    day,
                }),
            };
        });
    }
    getUniqueDevicesOfLastMonth() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return {
                year,
                month,
                day,
                data: yield exports.aggregates.getUniqueDevicesOfLastMonthOrWeek(this.secondaryCollection, {
                    year,
                    month,
                    day,
                }),
            };
        });
    }
    getUniqueDevicesOfLastWeek() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return {
                year,
                month,
                day,
                data: yield exports.aggregates.getUniqueDevicesOfLastMonthOrWeek(this.secondaryCollection, {
                    year,
                    month,
                    day,
                    type: 'week',
                }),
            };
        });
    }
    getUniqueOSOfYesterday() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return {
                year,
                month,
                day,
                data: yield exports.aggregates.getUniqueOSOfYesterday(this.secondaryCollection, { year, month, day }),
            };
        });
    }
    getUniqueOSOfLastMonth() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return {
                year,
                month,
                day,
                data: yield exports.aggregates.getUniqueOSOfLastMonthOrWeek(this.secondaryCollection, {
                    year,
                    month,
                    day,
                }),
            };
        });
    }
    getUniqueOSOfLastWeek() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return {
                year,
                month,
                day,
                data: yield exports.aggregates.getUniqueOSOfLastMonthOrWeek(this.secondaryCollection, {
                    year,
                    month,
                    day,
                    type: 'week',
                }),
            };
        });
    }
    isValidData(data) {
        return Boolean(data.year && data.month && data.day && data.sessionId && data.instanceId);
    }
    createOrUpdate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: check if we should create a session when there is no loginToken or not
            const { year, month, day, sessionId, instanceId } = data;
            if (!this.isValidData(data)) {
                return;
            }
            const now = new Date();
            return this.updateOne({ instanceId, sessionId, year, month, day }, {
                $set: data,
                $setOnInsert: {
                    createdAt: now,
                },
            }, { upsert: true });
        });
    }
    closeByInstanceIdAndSessionId(instanceId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                instanceId,
                sessionId,
                closedAt: { $exists: false },
            };
            const closeTime = new Date();
            const update = {
                $set: {
                    closedAt: closeTime,
                    lastActivityAt: closeTime,
                },
            };
            return this.updateOne(query, update);
        });
    }
    updateActiveSessionsByDateAndInstanceIdAndIds() {
        return __awaiter(this, arguments, void 0, function* ({ year, month, day } = {}, instanceId, sessions, data = {}) {
            const query = {
                instanceId,
                year,
                month,
                day,
                sessionId: { $in: sessions },
                closedAt: { $exists: false },
            };
            const update = {
                $set: data,
            };
            return this.updateMany(query, update);
        });
    }
    updateActiveSessionsByDate(_a) {
        return __awaiter(this, arguments, void 0, function* ({ year, month, day }, data = {}) {
            const update = {
                $set: data,
            };
            return this.updateMany({
                year,
                month,
                day,
                type: 'session',
                closedAt: { $exists: false },
                lastActivityAt: { $exists: false },
            }, update);
        });
    }
    logoutByInstanceIdAndSessionIdAndUserId(instanceId, sessionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                instanceId,
                sessionId,
                userId,
                logoutAt: { $exists: false },
            };
            const logoutAt = new Date();
            const update = {
                $set: {
                    logoutAt,
                    lastActivityAt: logoutAt,
                },
            };
            return this.updateOne(query, update);
        });
    }
    logoutBySessionIdAndUserId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sessionId, userId, }) {
            const query = {
                sessionId,
                userId,
                logoutAt: { $exists: false },
            };
            const session = yield this.findOne(query, { projection: { loginToken: 1 } });
            const logoutAt = new Date();
            const updateObj = {
                $set: {
                    logoutAt,
                    lastActivityAt: logoutAt,
                    logoutBy: userId,
                },
            };
            return this.updateMany({ userId, loginToken: session === null || session === void 0 ? void 0 : session.loginToken }, updateObj);
        });
    }
    logoutByloginTokenAndUserId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ loginToken, userId, logoutBy, }) {
            const logoutAt = new Date();
            const updateObj = {
                $set: {
                    logoutAt,
                    logoutBy: logoutBy || userId,
                },
            };
            return this.updateMany({ userId, loginToken }, updateObj);
        });
    }
    createBatch(sessions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!sessions || sessions.length === 0) {
                return;
            }
            const ops = [];
            sessions.forEach((doc) => {
                const { year, month, day, sessionId, instanceId } = doc;
                delete doc._id;
                if (this.isValidData(doc)) {
                    ops.push({
                        updateOne: {
                            filter: { year, month, day, sessionId, instanceId },
                            update: {
                                $set: doc,
                            },
                            upsert: true,
                        },
                    });
                }
            });
            return this.col.bulkWrite(ops, { ordered: false });
        });
    }
    updateDailySessionById(_id, record) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateOne({ _id }, { $set: record }, { upsert: true });
        });
    }
    updateAllSessionsByDateToComputed(_a) {
        return __awaiter(this, arguments, void 0, function* ({ start, end }) {
            return this.updateMany(Object.assign({ type: 'session' }, matchBasedOnDate(start, end)), {
                $set: {
                    type: 'computed-session',
                    _computedAt: new Date(),
                },
            });
        });
    }
}
exports.SessionsRaw = SessionsRaw;
