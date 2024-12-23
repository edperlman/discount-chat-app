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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsRaw = void 0;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const lodash_1 = require("lodash");
const mem_1 = __importDefault(require("mem"));
const BaseRaw_1 = require("./BaseRaw");
const getDefaultSubscriptionPref_1 = require("../../../app/utils/lib/getDefaultSubscriptionPref");
class SubscriptionsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'subscription', trash);
        this.cachedFindByUserId = (0, mem_1.default)(this.findByUserId.bind(this), { maxAge: 5000 });
    }
    modelIndexes() {
        // Add all indexes from constructor to here
        return [
            { key: { E2EKey: 1 }, unique: true, sparse: true },
            { key: { 'rid': 1, 'u._id': 1 }, unique: true },
            { key: { 'rid': 1, 'u._id': 1, 'open': 1 } },
            { key: { 'rid': 1, 'u.username': 1 } },
            { key: { 'rid': 1, 'alert': 1, 'u._id': 1 } },
            { key: { rid: 1, roles: 1 } },
            { key: { 'u._id': 1, 'name': 1, 't': 1 } },
            { key: { name: 1, t: 1 } },
            { key: { open: 1 } },
            { key: { alert: 1 } },
            { key: { ts: 1 } },
            { key: { ls: 1 } },
            { key: { desktopNotifications: 1 }, sparse: true },
            { key: { mobilePushNotifications: 1 }, sparse: true },
            { key: { emailNotifications: 1 }, sparse: true },
            { key: { autoTranslate: 1 }, sparse: true },
            { key: { autoTranslateLanguage: 1 }, sparse: true },
            { key: { 'userHighlights.0': 1 }, sparse: true },
            { key: { prid: 1 } },
            { key: { 'u._id': 1, 'open': 1, 'department': 1 } },
            { key: { rid: 1, ls: 1 } },
            { key: { 'u._id': 1, 'autotranslate': 1 } },
            { key: { 'v._id': 1, 'open': 1 } },
        ];
    }
    getBadgeCount(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.col
                .aggregate([
                { $match: { 'u._id': uid, 'archived': { $ne: true } } },
                {
                    $group: {
                        _id: 'total',
                        total: { $sum: '$unread' },
                    },
                },
            ])
                .toArray();
            return (result === null || result === void 0 ? void 0 : result.total) || 0;
        });
    }
    findOneByRoomIdAndUserId(rid, uid, options = {}) {
        const query = {
            rid,
            'u._id': uid,
        };
        return this.findOne(query, options);
    }
    findByUserIdAndRoomIds(userId, roomIds, options = {}) {
        const query = {
            'u._id': userId,
            'rid': {
                $in: roomIds,
            },
        };
        return this.find(query, options);
    }
    findByRoomId(roomId, options = {}) {
        const query = {
            rid: roomId,
        };
        return this.find(query, options);
    }
    findUnarchivedByRoomId(roomId, options = {}) {
        const query = {
            'rid': roomId,
            'archived': { $ne: true },
            'u._id': { $exists: true },
        };
        return this.find(query, options);
    }
    findByRoomIdAndNotUserId(roomId, userId, options = {}) {
        const query = {
            'rid': roomId,
            'u._id': {
                $ne: userId,
            },
        };
        return this.find(query, options);
    }
    countByRoomIdAndNotUserId(rid, uid) {
        const query = {
            rid,
            'u._id': {
                $ne: uid,
            },
        };
        return this.col.countDocuments(query);
    }
    findByLivechatRoomIdAndNotUserId(roomId, userId, options = {}) {
        const query = {
            'rid': roomId,
            'servedBy._id': {
                $ne: userId,
            },
        };
        return this.find(query, options);
    }
    countByRoomIdAndUserId(rid, uid) {
        const query = {
            rid,
            'u._id': uid,
        };
        return this.col.countDocuments(query);
    }
    countUnarchivedByRoomId(rid) {
        const query = {
            rid,
            'archived': { $ne: true },
            'u._id': { $exists: true },
        };
        return this.col.countDocuments(query);
    }
    isUserInRole(uid, roleId, rid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (rid == null) {
                return false;
            }
            const query = {
                'u._id': uid,
                rid,
                'roles': roleId,
            };
            return !!(yield this.findOne(query, { projection: { _id: 1 } }));
        });
    }
    setAsReadByRoomIdAndUserId(rid, uid, readThreads = false, alert = false, options = {}) {
        const query = {
            rid,
            'u._id': uid,
        };
        const update = Object.assign(Object.assign({}, (readThreads && {
            $unset: {
                tunread: 1,
                tunreadUser: 1,
                tunreadGroup: 1,
            },
        })), { $set: {
                open: true,
                alert,
                unread: 0,
                userMentions: 0,
                groupMentions: 0,
                ls: new Date(),
            } });
        return this.updateOne(query, update, options);
    }
    removeRolesByUserId(uid, roles, rid) {
        const query = {
            'u._id': uid,
            rid,
        };
        const update = {
            $pullAll: {
                roles,
            },
        };
        return this.updateOne(query, update);
    }
    findUsersInRoles(roles, rid, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = Object.assign({ roles: { $in: roles } }, (rid && { rid }));
            const subscriptions = yield this.find(query, { projection: { 'u._id': 1 } }).toArray();
            const users = (0, lodash_1.compact)(subscriptions.map((subscription) => { var _a; return (_a = subscription.u) === null || _a === void 0 ? void 0 : _a._id; }).filter(Boolean));
            // TODO remove dependency to other models - this logic should be inside a function/service
            return models_1.Users.find({ _id: { $in: users } }, options || {});
        });
    }
    countUsersInRoles(roles, rid) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = Object.assign({ roles: { $in: roles } }, (rid && { rid }));
            // Ideally, the count of subscriptions would be the same (or really similar) to the count in users
            // As sub/user/room is a 1:1 relation.
            return this.countDocuments(query);
        });
    }
    addRolesByUserId(uid, roles, rid) {
        if (!Array.isArray(roles)) {
            roles = [roles];
            process.env.NODE_ENV === 'development' && console.warn('[WARN] Subscriptions.addRolesByUserId: roles should be an array');
        }
        const query = {
            'u._id': uid,
            rid,
        };
        const update = {
            $addToSet: {
                roles: { $each: roles },
            },
        };
        return this.updateOne(query, update);
    }
    isUserInRoleScope(uid, rid) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                'u._id': uid,
                rid,
            };
            if (!rid) {
                return false;
            }
            const options = {
                projection: { _id: 1 },
            };
            const found = yield this.findOne(query, options);
            return !!found;
        });
    }
    updateAllRoomTypesByRoomId(roomId, roomType) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateMany({ rid: roomId }, { $set: { t: roomType } });
        });
    }
    updateAllRoomNamesByRoomId(roomId, name, fname) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateMany({ rid: roomId }, { $set: { name, fname } });
        });
    }
    findByRolesAndRoomId({ roles, rid }, options) {
        return this.find(Object.assign({ roles }, (rid && { rid })), options || {});
    }
    findByUserIdAndTypes(userId, types, options) {
        const query = {
            'u._id': userId,
            't': {
                $in: types,
            },
        };
        return this.find(query, options || {});
    }
    findOpenByVisitorIds(visitorIds, options) {
        const query = {
            'open': true,
            'v._id': { $in: visitorIds },
        };
        return this.find(query, options || {});
    }
    findByRoomIdAndNotAlertOrOpenExcludingUserIds({ roomId, uidsExclude, uidsInclude, onlyRead, }, options) {
        const query = Object.assign(Object.assign({ rid: roomId }, ((uidsExclude === null || uidsExclude === void 0 ? void 0 : uidsExclude.length) && {
            'u._id': { $nin: uidsExclude },
        })), (onlyRead && {
            $or: [...((uidsInclude === null || uidsInclude === void 0 ? void 0 : uidsInclude.length) ? [{ 'u._id': { $in: uidsInclude } }] : []), { alert: { $ne: true } }, { open: { $ne: true } }],
        }));
        return this.find(query, options || {});
    }
    removeByRoomId(roomId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                rid: roomId,
            };
            const deleteResult = yield this.deleteMany(query, options);
            if (deleteResult === null || deleteResult === void 0 ? void 0 : deleteResult.deletedCount) {
                yield models_1.Rooms.incUsersCountByIds([roomId], -deleteResult.deletedCount, { session: options === null || options === void 0 ? void 0 : options.session });
            }
            yield models_1.Users.removeRoomByRoomId(roomId, { session: options === null || options === void 0 ? void 0 : options.session });
            return deleteResult;
        });
    }
    findByRoomIdExcludingUserIds(roomId, userIds, options = {}) {
        const query = {
            'rid': roomId,
            'u._id': {
                $nin: userIds,
            },
        };
        return this.find(query, options);
    }
    findConnectedUsersExcept(userId_1, searchTerm_1, exceptions_1, searchFields_1, extraConditions_1, limit_1, roomType_1) {
        return __awaiter(this, arguments, void 0, function* (userId, searchTerm, exceptions, searchFields, extraConditions, limit, roomType, { startsWith = false, endsWith = false } = {}, options = {}) {
            const termRegex = new RegExp((startsWith ? '^' : '') + (0, string_helpers_1.escapeRegExp)(searchTerm) + (endsWith ? '$' : ''), 'i');
            const orStatement = searchFields.reduce((acc, el) => {
                acc.push({ [el.trim()]: termRegex });
                return acc;
            }, []);
            return this.col
                .aggregate([
                // Match all subscriptions of the requester
                {
                    $match: Object.assign({ 'u._id': userId }, (roomType ? { t: roomType } : {})),
                },
                // Group by room id and drop all other subcription data
                {
                    $group: {
                        _id: '$rid',
                    },
                },
                // find all subscriptions to the same rooms by other users
                {
                    $lookup: {
                        from: 'rocketchat_subscription',
                        as: 'subscription',
                        let: {
                            rid: '$_id',
                        },
                        pipeline: [{ $match: { '$expr': { $eq: ['$rid', '$$rid'] }, 'u._id': { $ne: userId } } }],
                    },
                },
                // Unwind the subscription so we have a separate document for each
                {
                    $unwind: {
                        path: '$subscription',
                    },
                },
                // Group the data by user id, keeping track of how many documents each user had
                {
                    $group: {
                        _id: '$subscription.u._id',
                        score: {
                            $sum: 1,
                        },
                    },
                },
                // Load the data for the subscription's user, ignoring those who don't match the search terms
                {
                    $lookup: {
                        from: 'users',
                        as: 'user',
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: Object.assign(Object.assign(Object.assign({ $expr: { $eq: ['$_id', '$$id'] } }, extraConditions), { active: true, username: Object.assign({ $exists: true }, (exceptions.length > 0 && { $nin: exceptions })) }), (searchTerm && orStatement.length > 0 && { $or: orStatement })),
                            },
                        ],
                    },
                },
                // Discard documents that didn't load any user data in the previous step:
                {
                    $unwind: {
                        path: '$user',
                    },
                },
                // Use group to organize the data at the same time that we pick what to project to the end result
                {
                    $group: {
                        _id: '$_id',
                        score: {
                            $sum: '$score',
                        },
                        name: { $first: '$user.name' },
                        username: { $first: '$user.username' },
                        nickname: { $first: '$user.nickname' },
                        status: { $first: '$user.status' },
                        statusText: { $first: '$user.statusText' },
                        avatarETag: { $first: '$user.avatarETag' },
                    },
                },
                // Sort by score
                {
                    $sort: {
                        score: -1,
                    },
                },
                // Limit the number of results
                {
                    $limit: limit,
                },
            ], options)
                .toArray();
        });
    }
    incUnreadForRoomIdExcludingUserIds(roomId, userIds, inc) {
        if (inc == null) {
            inc = 1;
        }
        const query = {
            'rid': roomId,
            'u._id': {
                $nin: userIds,
            },
        };
        const update = {
            $set: {
                alert: true,
                open: true,
            },
            $inc: {
                unread: inc,
            },
        };
        return this.updateMany(query, update);
    }
    setAlertForRoomIdExcludingUserId(roomId, userId) {
        const query = {
            'rid': roomId,
            'u._id': {
                $ne: userId,
            },
            'alert': { $ne: true },
        };
        const update = {
            $set: {
                alert: true,
            },
        };
        return this.updateMany(query, update);
    }
    setOpenForRoomIdExcludingUserId(roomId, userId) {
        const query = {
            'rid': roomId,
            'u._id': {
                $ne: userId,
            },
            'open': { $ne: true },
        };
        const update = {
            $set: {
                open: true,
            },
        };
        return this.updateMany(query, update);
    }
    updateNameAndFnameByRoomId(roomId, name, fname) {
        const query = { rid: roomId };
        const update = {
            $set: {
                name,
                fname,
            },
        };
        return this.updateMany(query, update);
    }
    updateNameAndFnameByVisitorIds(visitorIds, name) {
        const query = { 'v._id': { $in: visitorIds } };
        const update = {
            $set: {
                name,
                fname: name,
            },
        };
        return this.updateMany(query, update);
    }
    setGroupE2EKeyAndOldRoomKeys(_id, key, oldRoomKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { _id };
            const update = { $set: Object.assign({ E2EKey: key }, (oldRoomKeys && { oldRoomKeys })) };
            return this.updateOne(query, update);
        });
    }
    setGroupE2EKey(_id, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { _id };
            const update = { $set: { E2EKey: key } };
            return this.updateOne(query, update);
        });
    }
    setGroupE2ESuggestedKey(uid, rid, key) {
        const query = { rid, 'u._id': uid };
        const update = { $set: { E2ESuggestedKey: key } };
        return this.findOneAndUpdate(query, update, { returnDocument: 'after' });
    }
    setE2EKeyByUserIdAndRoomId(userId, rid, key) {
        const query = { rid, 'u._id': userId };
        const update = { $set: { E2EKey: key } };
        return this.findOneAndUpdate(query, update, { returnDocument: 'after' });
    }
    setGroupE2ESuggestedKeyAndOldRoomKeys(uid, rid, key, suggestedOldRoomKeys) {
        const query = { rid, 'u._id': uid };
        const update = { $set: Object.assign({ E2ESuggestedKey: key }, (suggestedOldRoomKeys && { suggestedOldRoomKeys })) };
        return this.findOneAndUpdate(query, update, { returnDocument: 'after' });
    }
    unsetGroupE2ESuggestedKeyAndOldRoomKeys(_id) {
        const query = { _id };
        return this.updateOne(query, { $unset: { E2ESuggestedKey: 1, suggestedOldRoomKeys: 1 } });
    }
    setOnHoldByRoomId(rid) {
        return this.updateOne({ rid }, { $set: { onHold: true } });
    }
    unsetOnHoldByRoomId(rid) {
        return this.updateOne({ rid }, { $unset: { onHold: 1 } });
    }
    findByRoomIds(roomIds, options) {
        const query = {
            rid: {
                $in: roomIds,
            },
        };
        return this.find(query, options);
    }
    removeByVisitorToken(token) {
        const query = {
            'v.token': token,
        };
        return this.deleteMany(query);
    }
    findByToken(token, options) {
        const query = {
            'v.token': token,
        };
        return this.find(query, options);
    }
    updateAutoTranslateById(_id, autoTranslate) {
        const query = {
            _id,
        };
        let update;
        if (autoTranslate) {
            update = {
                $set: {
                    autoTranslate,
                },
            };
        }
        else {
            update = {
                $unset: {
                    autoTranslate: 1,
                },
            };
        }
        return this.updateOne(query, update);
    }
    updateAllAutoTranslateLanguagesByUserId(userId, language) {
        const query = {
            'u._id': userId,
            'autoTranslate': true,
        };
        const update = {
            $set: {
                autoTranslateLanguage: language,
            },
        };
        return this.updateMany(query, update);
    }
    findByAutoTranslateAndUserId(userId, autoTranslate = true, options) {
        const query = {
            'u._id': userId,
            autoTranslate,
        };
        return this.find(query, options);
    }
    disableAutoTranslateByRoomId(roomId) {
        const query = {
            rid: roomId,
        };
        return this.updateMany(query, { $unset: { autoTranslate: 1 } });
    }
    updateAutoTranslateLanguageById(_id, autoTranslateLanguage) {
        const query = {
            _id,
        };
        const update = {
            $set: {
                autoTranslateLanguage,
            },
        };
        return this.updateOne(query, update);
    }
    getAutoTranslateLanguagesByRoomAndNotUser(rid, userId) {
        const query = {
            rid,
            'u._id': { $ne: userId },
            'autoTranslate': true,
        };
        return this.col.distinct('autoTranslateLanguage', query);
    }
    /**
     * @param {string} userId
     * @param {string} scope the value for the role scope (room id)
     */
    roleBaseQuery(userId, scope) {
        if (scope == null) {
            return;
        }
        const query = Object.assign({ 'u._id': userId }, (scope !== undefined && { rid: scope }));
        return query;
    }
    findByRidWithoutE2EKey(rid, options) {
        const query = {
            rid,
            E2EKey: {
                $exists: false,
            },
        };
        return this.find(query, options);
    }
    findUsersWithPublicE2EKeyByRids(rids, excludeUserId, usersLimit = 50) {
        return this.col.aggregate([
            {
                $match: {
                    'rid': {
                        $in: rids,
                    },
                    'E2EKey': {
                        $exists: false,
                    },
                    'E2ESuggestedKey': { $exists: false },
                    'u._id': {
                        $ne: excludeUserId,
                    },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'u._id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $match: {
                    'user.e2e.public_key': {
                        $exists: 1,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        rid: '$rid',
                    },
                    users: { $push: { _id: '$user._id', public_key: '$user.e2e.public_key' } },
                },
            },
            {
                $project: {
                    rid: '$_id.rid',
                    users: { $slice: ['$users', usersLimit] },
                    _id: 0,
                },
            },
        ]);
    }
    updateAudioNotificationValueById(_id, audioNotificationValue) {
        const query = {
            _id,
        };
        const update = {
            $set: {
                audioNotificationValue,
            },
        };
        return this.updateOne(query, update);
    }
    clearAudioNotificationValueById(_id) {
        const query = {
            _id,
        };
        const update = {
            $unset: {
                audioNotificationValue: 1,
            },
        };
        return this.updateOne(query, update);
    }
    updateNotificationsPrefById(_id, notificationPref, notificationField, notificationPrefOrigin) {
        const query = {
            _id,
        };
        const update = {};
        if (notificationPref === null) {
            update.$unset = {
                [notificationField]: 1,
                [notificationPrefOrigin]: 1,
            };
        }
        else {
            // @ts-expect-error TODO: fix this
            update.$set = {
                [notificationField]: notificationPref.value,
                [notificationPrefOrigin]: notificationPref.origin,
            };
        }
        return this.updateOne(query, update);
    }
    updateUnreadAlertById(_id, unreadAlert) {
        const query = {
            _id,
        };
        const update = {
            $set: {
                unreadAlert,
            },
        };
        return this.updateOne(query, update);
    }
    updateDisableNotificationsById(_id, disableNotifications) {
        const query = {
            _id,
        };
        const update = {
            $set: {
                disableNotifications,
            },
        };
        return this.updateOne(query, update);
    }
    updateHideUnreadStatusById(_id, hideUnreadStatus) {
        const query = {
            _id,
        };
        const update = Object.assign({}, (hideUnreadStatus === true ? { $set: { hideUnreadStatus } } : { $unset: { hideUnreadStatus: 1 } }));
        return this.updateOne(query, update);
    }
    updateHideMentionStatusById(_id, hideMentionStatus) {
        const query = {
            _id,
        };
        const update = hideMentionStatus === true
            ? {
                $set: {
                    hideMentionStatus,
                },
            }
            : {
                $unset: {
                    hideMentionStatus: 1,
                },
            };
        return this.updateOne(query, update);
    }
    updateMuteGroupMentions(_id, muteGroupMentions) {
        const query = {
            _id,
        };
        const update = {
            $set: {
                muteGroupMentions,
            },
        };
        return this.updateOne(query, update);
    }
    changeDepartmentByRoomId(rid, department) {
        const query = {
            rid,
        };
        const update = {
            $set: {
                department,
            },
        };
        return this.updateOne(query, update);
    }
    findAlwaysNotifyDesktopUsersByRoomId(roomId) {
        const query = {
            rid: roomId,
            desktopNotifications: 'all',
        };
        return this.find(query);
    }
    findDontNotifyDesktopUsersByRoomId(roomId) {
        const query = {
            rid: roomId,
            desktopNotifications: 'nothing',
        };
        return this.find(query);
    }
    findAlwaysNotifyMobileUsersByRoomId(roomId) {
        const query = {
            rid: roomId,
            mobilePushNotifications: 'all',
        };
        return this.find(query);
    }
    findDontNotifyMobileUsersByRoomId(roomId) {
        const query = {
            rid: roomId,
            mobilePushNotifications: 'nothing',
        };
        return this.find(query);
    }
    findWithSendEmailByRoomId(roomId) {
        const query = {
            rid: roomId,
            emailNotifications: {
                $exists: true,
            },
        };
        return this.find(query, { projection: { emailNotifications: 1, u: 1 } });
    }
    resetUserE2EKey(userId) {
        return this.updateMany({ 'u._id': userId }, {
            $unset: {
                E2EKey: '',
                E2ESuggestedKey: 1,
                oldRoomKeys: 1,
            },
        });
    }
    findByUserIdWithoutE2E(userId, options) {
        const query = {
            'u._id': userId,
            'E2EKey': {
                $exists: false,
            },
        };
        return this.find(query, options);
    }
    findOneByRoomIdAndUsername(roomId, username, options) {
        const query = {
            'rid': roomId,
            'u.username': username,
        };
        return this.findOne(query, options);
    }
    findOneByRoomNameAndUserId(roomName, userId) {
        const query = {
            'name': roomName,
            'u._id': userId,
        };
        return this.findOne(query);
    }
    // FIND
    findByUserId(userId, options) {
        const query = { 'u._id': userId };
        return this.find(query, options);
    }
    findByUserIdExceptType(userId, typeException, options) {
        const query = {
            'u._id': userId,
            't': { $ne: typeException },
        };
        return this.find(query, options);
    }
    findByUserIdAndType(userId, type, options) {
        const query = {
            'u._id': userId,
            't': type,
        };
        return this.find(query, options);
    }
    /**
     * @param {IUser['_id']} userId
     * @param {IRole['_id'][]} roles
     * @param {any} options
     */
    findByUserIdAndRoles(userId, roles, options) {
        const query = {
            'u._id': userId,
            'roles': { $in: roles },
        };
        return this.find(query, options);
    }
    findByUserIdUpdatedAfter(userId, updatedAt, options) {
        const query = {
            'u._id': userId,
            '_updatedAt': {
                $gt: updatedAt,
            },
        };
        return this.find(query, options);
    }
    /**
     * @param {string} roomId
     * @param {IRole['_id'][]} roles the list of roles
     * @param {any} options
     */
    findByRoomIdAndRoles(roomId, roles, options) {
        roles = [].concat(roles);
        const query = {
            rid: roomId,
            roles: { $in: roles },
        };
        return this.find(query, options);
    }
    countByRoomIdAndRoles(roomId, roles) {
        roles = [].concat(roles);
        const query = {
            rid: roomId,
            roles: { $in: roles },
        };
        return this.col.countDocuments(query);
    }
    countByUserId(userId) {
        const query = { 'u._id': userId };
        return this.col.countDocuments(query);
    }
    countByRoomId(roomId, options) {
        const query = {
            rid: roomId,
        };
        if (options) {
            return this.col.countDocuments(query, options);
        }
        return this.col.countDocuments(query);
    }
    findByType(types, options) {
        const query = {
            t: {
                $in: types,
            },
        };
        return this.find(query, options);
    }
    findByTypeAndUserId(type, userId, options) {
        const query = {
            't': type,
            'u._id': userId,
        };
        return this.find(query, options);
    }
    findByRoomWithUserHighlights(roomId, options) {
        const query = {
            'rid': roomId,
            'userHighlights.0': { $exists: true },
        };
        return this.find(query, options);
    }
    getLastSeen() {
        return __awaiter(this, arguments, void 0, function* (options = { projection: { _id: 0, ls: 1 } }) {
            options.sort = { ls: -1 };
            options.limit = 1;
            const [subscription] = yield this.find({}, options).toArray();
            return subscription === null || subscription === void 0 ? void 0 : subscription.ls;
        });
    }
    findByRoomIdAndUserIds(roomId, userIds, options) {
        const query = {
            'rid': roomId,
            'u._id': {
                $in: userIds,
            },
        };
        return this.find(query, options);
    }
    findByRoomIdAndUserIdsOrAllMessages(roomId, userIds) {
        const query = {
            rid: roomId,
            $or: [{ 'u._id': { $in: userIds } }, { emailNotifications: 'all' }],
        };
        return this.find(query);
    }
    findByRoomIdWhenUserIdExists(rid, options) {
        const query = { rid, 'u._id': { $exists: true } };
        return this.find(query, options);
    }
    findByRoomIdWhenUsernameExists(rid, options) {
        const query = { rid, 'u.username': { $exists: true } };
        return this.find(query, options);
    }
    countByRoomIdWhenUsernameExists(rid) {
        const query = { rid, 'u.username': { $exists: true } };
        return this.col.countDocuments(query);
    }
    findUnreadByUserId(userId) {
        const query = {
            'u._id': userId,
            'unread': {
                $gt: 0,
            },
        };
        return this.find(query, { projection: { unread: 1 } });
    }
    getMinimumLastSeenByRoomId(rid) {
        return this.findOne({
            rid,
        }, {
            sort: {
                ls: 1,
            },
            projection: {
                ls: 1,
            },
        });
    }
    // UPDATE
    archiveByRoomId(roomId) {
        const query = { rid: roomId };
        const update = {
            $set: {
                alert: false,
                open: false,
                archived: true,
            },
        };
        return this.updateMany(query, update);
    }
    unarchiveByRoomId(roomId) {
        const query = { rid: roomId };
        const update = {
            $set: {
                alert: false,
                open: true,
                archived: false,
            },
        };
        return this.updateMany(query, update);
    }
    hideByRoomIdAndUserId(roomId, userId) {
        const query = {
            'rid': roomId,
            'u._id': userId,
        };
        const update = {
            $set: {
                alert: false,
                open: false,
            },
        };
        return this.updateOne(query, update);
    }
    setAsUnreadByRoomIdAndUserId(roomId, userId, firstMessageUnreadTimestamp) {
        const query = {
            'rid': roomId,
            'u._id': userId,
        };
        const update = {
            $set: {
                open: true,
                alert: true,
                ls: new Date(firstMessageUnreadTimestamp.getTime() - 1), // make sure last seen is before the first unread message
                unread: 1,
            },
        };
        return this.updateOne(query, update);
    }
    setCustomFieldsDirectMessagesByUserId(userId, fields) {
        const query = {
            'u._id': userId,
            't': 'd',
        };
        const update = { $set: { customFields: fields } };
        return this.updateMany(query, update);
    }
    findByUserIdAndRoomType(userId, type, options) {
        const query = {
            'u._id': userId,
            't': type,
        };
        return this.find(query, options);
    }
    findByNameAndRoomType(filter, options) {
        if (!filter.name && !filter.t) {
            throw new Error('invalid filter');
        }
        const query = Object.assign(Object.assign({}, (filter.name && { name: filter.name })), (filter.t && { t: filter.t }));
        return this.find(query, options);
    }
    setFavoriteByRoomIdAndUserId(roomId, userId, favorite) {
        if (favorite == null) {
            favorite = true;
        }
        const query = {
            'rid': roomId,
            'u._id': userId,
        };
        const update = {
            $set: {
                f: favorite,
            },
        };
        return this.updateOne(query, update);
    }
    updateNameAndAlertByRoomId(roomId, name, fname) {
        const query = { rid: roomId };
        const update = {
            $set: {
                name,
                fname,
                alert: true,
            },
        };
        return this.updateMany(query, update);
    }
    updateDisplayNameByRoomId(roomId, fname) {
        const query = { rid: roomId };
        const update = {
            $set: {
                fname,
                name: fname,
            },
        };
        return this.updateMany(query, update);
    }
    updateFnameByRoomId(rid, fname) {
        const query = { rid };
        const update = {
            $set: {
                fname,
            },
        };
        return this.updateMany(query, update);
    }
    updateNameAndFnameById(_id, name, fname) {
        const query = { _id };
        const update = {
            $set: {
                name,
                fname,
            },
        };
        return this.updateMany(query, update);
    }
    setUserUsernameByUserId(userId, username) {
        const query = { 'u._id': userId };
        const update = {
            $set: {
                'u.username': username,
            },
        };
        return this.updateMany(query, update);
    }
    setNameForDirectRoomsWithOldName(oldName, name) {
        const query = {
            name: oldName,
            t: 'd',
        };
        const update = {
            $set: {
                name,
            },
        };
        return this.updateMany(query, update);
    }
    updateDirectNameAndFnameByName(name, newName, newFname) {
        const query = {
            name,
            t: 'd',
        };
        const update = {
            $set: Object.assign(Object.assign({}, (newName && { name: newName })), (newFname && { fname: newFname })),
        };
        return this.updateMany(query, update);
    }
    incGroupMentionsAndUnreadForRoomIdExcludingUserId(roomId, userId, incGroup = 1, incUnread = 1) {
        const query = {
            'rid': roomId,
            'u._id': {
                $ne: userId,
            },
        };
        const update = {
            $set: {
                alert: true,
                open: true,
            },
            $inc: {
                unread: incUnread,
                groupMentions: incGroup,
            },
        };
        return this.updateMany(query, update);
    }
    incUserMentionsAndUnreadForRoomIdAndUserIds(roomId, userIds, incUser = 1, incUnread = 1) {
        const query = {
            'rid': roomId,
            'u._id': {
                $in: userIds,
            },
        };
        const update = {
            $set: {
                alert: true,
                open: true,
            },
            $inc: {
                unread: incUnread,
                userMentions: incUser,
            },
        };
        return this.updateMany(query, update);
    }
    ignoreUser({ _id, ignoredUser: ignored, ignore = true }) {
        const query = {
            _id,
        };
        const update = {};
        if (ignore) {
            update.$addToSet = { ignored };
        }
        else {
            update.$pull = { ignored };
        }
        return this.updateOne(query, update);
    }
    setAlertForRoomIdAndUserIds(roomId, uids) {
        const query = {
            'rid': roomId,
            'u._id': { $in: uids },
            'alert': { $ne: true },
        };
        const update = {
            $set: {
                alert: true,
            },
        };
        return this.updateMany(query, update);
    }
    setOpenForRoomIdAndUserIds(roomId, uids) {
        const query = {
            'rid': roomId,
            'u._id': { $in: uids },
            'open': { $ne: true },
        };
        const update = {
            $set: {
                open: true,
            },
        };
        return this.updateMany(query, update);
    }
    setLastReplyForRoomIdAndUserIds(roomId, uids, lr) {
        const query = {
            'rid': roomId,
            'u._id': { $in: uids },
        };
        const update = {
            $set: {
                lr,
            },
        };
        return this.updateMany(query, update);
    }
    setBlockedByRoomId(rid, blocked, blocker) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                rid,
                'u._id': blocked,
            };
            const update = {
                $set: {
                    blocked: true,
                },
            };
            const query2 = {
                rid,
                'u._id': blocker,
            };
            const update2 = {
                $set: {
                    blocker: true,
                },
            };
            return Promise.all([this.updateOne(query, update), this.updateOne(query2, update2)]);
        });
    }
    unsetBlockedByRoomId(rid, blocked, blocker) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                rid,
                'u._id': blocked,
            };
            const update = {
                $unset: {
                    blocked: 1,
                },
            };
            const query2 = {
                rid,
                'u._id': blocker,
            };
            const update2 = {
                $unset: {
                    blocker: 1,
                },
            };
            return Promise.all([this.updateOne(query, update), this.updateOne(query2, update2)]);
        });
    }
    updateCustomFieldsByRoomId(rid, cfields) {
        const query = { rid };
        const customFields = cfields || {};
        const update = {
            $set: {
                customFields,
            },
        };
        return this.updateMany(query, update);
    }
    updateTypeByRoomId(roomId, type) {
        const query = { rid: roomId };
        const update = {
            $set: {
                t: type,
            },
        };
        return this.updateMany(query, update);
    }
    /**
     * @param {string} _id the subscription id
     * @param {IRole['_id']} role the id of the role
     */
    addRoleById(_id, role) {
        const query = { _id };
        const update = {
            $addToSet: {
                roles: role,
            },
        };
        return this.updateOne(query, update);
    }
    /**
     * @param {string} _id the subscription id
     * @param {IRole['_id']} role the id of the role
     */
    removeRoleById(_id, role) {
        const query = { _id };
        const update = {
            $pull: {
                roles: role,
            },
        };
        return this.updateOne(query, update);
    }
    setArchivedByUsername(username, archived) {
        const query = {
            t: 'd',
            name: username,
        };
        const update = {
            $set: {
                archived,
            },
        };
        return this.updateMany(query, update);
    }
    clearNotificationUserPreferences(userId, notificationField, notificationOriginField) {
        const query = {
            'u._id': userId,
            [notificationOriginField]: 'user',
        };
        const update = {
            $unset: {
                [notificationOriginField]: 1,
                [notificationField]: 1,
            },
        };
        return this.updateMany(query, update);
    }
    updateNotificationUserPreferences(userId, userPref, notificationField, notificationOriginField) {
        const query = {
            'u._id': userId,
            [notificationOriginField]: {
                $ne: 'subscription',
            },
        };
        const update = {
            // @ts-expect-error - :(
            $set: {
                [notificationField]: userPref,
                [notificationOriginField]: 'user',
            },
        };
        return this.updateMany(query, update);
    }
    findByUserPreferences(userId, notificationOriginField, notificationOriginValue, options) {
        const value = notificationOriginValue === 'user' ? 'user' : { $ne: 'subscription' };
        const query = {
            'u._id': userId,
            [notificationOriginField]: value,
        };
        return this.find(query, options);
    }
    updateUserHighlights(userId, userHighlights) {
        const query = {
            'u._id': userId,
        };
        const update = {
            $set: {
                userHighlights,
            },
        };
        return this.updateMany(query, update);
    }
    updateDirectFNameByName(name, fname) {
        const query = {
            t: 'd',
            name,
        };
        let update;
        if (fname) {
            update = {
                $set: {
                    fname,
                },
            };
        }
        else {
            update = {
                $unset: {
                    fname: true,
                },
            };
        }
        return this.updateMany(query, update);
    }
    // INSERT
    createWithRoomAndUser(room_1, user_1) {
        return __awaiter(this, arguments, void 0, function* (room, user, extraData = {}) {
            const subscription = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ open: false, alert: false, unread: 0, userMentions: 0, groupMentions: 0, ts: room.ts, rid: room._id, name: room.name, fname: room.fname }, (room.customFields && { customFields: room.customFields })), { t: room.t, u: {
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                } }), (room.prid && { prid: room.prid })), (0, getDefaultSubscriptionPref_1.getDefaultSubscriptionPref)(user)), extraData);
            // @ts-expect-error - types not good :(
            const result = yield this.insertOne(subscription);
            yield models_1.Rooms.incUsersCountById(room._id, 1);
            if (!['d', 'l'].includes(room.t)) {
                yield models_1.Users.addRoomByUserId(user._id, room._id);
            }
            return result;
        });
    }
    createWithRoomAndManyUsers(room_1) {
        return __awaiter(this, arguments, void 0, function* (room, users = []) {
            const subscriptions = users.map(({ user, extraData }) => (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ open: false, alert: false, unread: 0, userMentions: 0, groupMentions: 0, ts: room.ts, rid: room._id, name: room.name, fname: room.fname }, (room.customFields && { customFields: room.customFields })), { t: room.t, u: {
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                } }), (room.prid && { prid: room.prid })), (0, getDefaultSubscriptionPref_1.getDefaultSubscriptionPref)(user)), extraData)));
            // @ts-expect-error - types not good :(
            return this.insertMany(subscriptions);
        });
    }
    // REMOVE
    removeByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                'u._id': userId,
            };
            const roomIds = (yield this.findByUserId(userId).toArray()).map((s) => s.rid);
            const result = (yield this.deleteMany(query)).deletedCount;
            if (typeof result === 'number' && result > 0) {
                yield models_1.Rooms.incUsersCountNotDMsByIds(roomIds, -1);
            }
            yield models_1.Users.removeAllRoomsByUserId(userId);
            return result;
        });
    }
    removeByRoomIdAndUserId(roomId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                'rid': roomId,
                'u._id': userId,
            };
            const { value: doc } = yield this.findOneAndDelete(query);
            if (doc) {
                yield models_1.Rooms.incUsersCountById(roomId, -1);
            }
            yield models_1.Users.removeRoomByUserId(userId, roomId);
            return doc;
        });
    }
    removeByRoomIds(rids, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.deleteMany({ rid: { $in: rids } }, options);
            yield models_1.Users.removeRoomByRoomIds(rids);
            return result;
        });
    }
    removeByRoomIdsAndUserId(rids, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.deleteMany({ 'rid': { $in: rids }, 'u._id': userId })).deletedCount;
            if (typeof result === 'number' && result > 0) {
                yield models_1.Rooms.incUsersCountByIds(rids, -1);
            }
            yield models_1.Users.removeRoomsByRoomIdsAndUserId(rids, userId);
            return result;
        });
    }
    // //////////////////////////////////////////////////////////////////
    // threads
    addUnreadThreadByRoomIdAndUserIds(rid_1, users_1, tmid_1) {
        return __awaiter(this, arguments, void 0, function* (rid, users, tmid, { groupMention = false, userMention = false } = {}) {
            if (!users) {
                return;
            }
            return this.updateMany({
                'u._id': { $in: users },
                rid,
            }, {
                $addToSet: Object.assign(Object.assign({ tunread: tmid }, (groupMention && { tunreadGroup: tmid })), (userMention && { tunreadUser: tmid })),
            });
        });
    }
    removeUnreadThreadByRoomIdAndUserId(rid, userId, tmid, clearAlert = false) {
        const update = {
            $pull: {
                tunread: tmid,
                tunreadGroup: tmid,
                tunreadUser: tmid,
            },
        };
        if (clearAlert) {
            update.$set = { alert: false };
        }
        return this.updateOne({
            'u._id': userId,
            rid,
        }, update);
    }
    removeUnreadThreadsByRoomId(rid, tunread) {
        const query = {
            rid,
            tunread: { $in: tunread },
        };
        const update = {
            $pullAll: {
                tunread,
                tunreadUser: tunread,
                tunreadGroup: tunread,
            },
        };
        return this.updateMany(query, update);
    }
    findUnreadThreadsByRoomId(rid, tunread, options) {
        const query = {
            rid,
            tunread: { $in: tunread },
        };
        return this.find(query, options);
    }
    openByRoomIdAndUserId(roomId, userId) {
        const query = {
            'rid': roomId,
            'u._id': userId,
        };
        const update = {
            $set: {
                open: true,
            },
        };
        return this.updateOne(query, update);
    }
}
exports.SubscriptionsRaw = SubscriptionsRaw;
