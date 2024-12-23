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
exports.VideoConferenceRaw = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const BaseRaw_1 = require("./BaseRaw");
class VideoConferenceRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'video_conference', trash);
    }
    modelIndexes() {
        return [
            { key: { rid: 1, createdAt: 1 }, unique: false },
            { key: { type: 1, status: 1 }, unique: false },
            { key: { discussionRid: 1 }, unique: false },
        ];
    }
    findPaginatedByRoomId(rid, { offset, count } = {}) {
        return this.findPaginated({ rid }, {
            sort: { createdAt: -1 },
            skip: offset,
            limit: count,
            projection: {
                providerData: 0,
            },
        });
    }
    findAllLongRunning(minDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.find({
                createdAt: {
                    $lte: minDate,
                },
                endedAt: {
                    $exists: false,
                },
            }, {
                projection: {
                    _id: 1,
                },
            });
        });
    }
    countByTypeAndStatus(type, status, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.countDocuments({
                type,
                status,
            }, options);
        });
    }
    createDirect(_a) {
        return __awaiter(this, void 0, void 0, function* () {
            var { providerName } = _a, callDetails = __rest(_a, ["providerName"]);
            const call = Object.assign({ type: 'direct', users: [], messages: {}, status: core_typings_1.VideoConferenceStatus.CALLING, createdAt: new Date(), providerName: providerName.toLowerCase(), ringing: true }, callDetails);
            return (yield this.insertOne(call)).insertedId;
        });
    }
    createGroup(_a) {
        return __awaiter(this, void 0, void 0, function* () {
            var { providerName } = _a, callDetails = __rest(_a, ["providerName"]);
            const call = Object.assign({ type: 'videoconference', users: [], messages: {}, status: core_typings_1.VideoConferenceStatus.STARTED, anonymousUsers: 0, createdAt: new Date(), providerName: providerName.toLowerCase() }, callDetails);
            return (yield this.insertOne(call)).insertedId;
        });
    }
    createLivechat(_a) {
        return __awaiter(this, void 0, void 0, function* () {
            var { providerName } = _a, callDetails = __rest(_a, ["providerName"]);
            const call = Object.assign({ type: 'livechat', users: [], messages: {}, status: core_typings_1.VideoConferenceStatus.STARTED, createdAt: new Date(), providerName: providerName.toLowerCase() }, callDetails);
            return (yield this.insertOne(call)).insertedId;
        });
    }
    updateOneById(_id, update, options) {
        return this.updateOne({ _id }, update, options);
    }
    setEndedById(callId, endedBy, endedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOneById(callId, {
                $set: {
                    endedBy,
                    endedAt: endedAt || new Date(),
                },
            });
        });
    }
    setDataById(callId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOneById(callId, {
                $set: data,
            });
        });
    }
    setRingingById(callId, ringing) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOneById(callId, {
                $set: {
                    ringing,
                },
            });
        });
    }
    setStatusById(callId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOneById(callId, {
                $set: {
                    status,
                },
            });
        });
    }
    setUrlById(callId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOneById(callId, {
                $set: {
                    url,
                },
            });
        });
    }
    setProviderDataById(callId, providerData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOneById(callId, Object.assign({}, (providerData
                ? {
                    $set: {
                        providerData,
                    },
                }
                : {
                    $unset: {
                        providerData: 1,
                    },
                })));
        });
    }
    addUserById(callId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOneById(callId, {
                $addToSet: {
                    users: {
                        _id: user._id,
                        username: user.username,
                        name: user.name,
                        avatarETag: user.avatarETag,
                        ts: user.ts || new Date(),
                    },
                },
            });
        });
    }
    setMessageById(callId, messageType, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOneById(callId, {
                $set: {
                    [`messages.${messageType}`]: messageId,
                },
            }); // TODO: Remove this cast when TypeScript is updated
            // TypeScript is not smart enough to infer that `messages.${'start' | 'end'}` matches two keys of `VideoConference`
        });
    }
    updateUserReferences(userId, username, name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateMany({
                'users._id': userId,
            }, {
                $set: {
                    'users.$.name': name,
                    'users.$.username': username,
                },
            });
            yield this.updateMany({
                'createdBy._id': userId,
            }, {
                $set: {
                    'createdBy.name': name,
                    'createdBy.username': username,
                },
            });
            yield this.updateMany({
                'endedBy._id': userId,
            }, {
                $set: {
                    'endedBy.name': name,
                    'endedBy.username': username,
                },
            });
        });
    }
    increaseAnonymousCount(callId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({ _id: callId }, {
                $inc: {
                    anonymousUsers: 1,
                },
            });
        });
    }
    setDiscussionRidById(callId, discussionRid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({ _id: callId }, { $set: { discussionRid } });
        });
    }
    unsetDiscussionRidById(callId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({ _id: callId }, { $unset: { discussionRid: true } });
        });
    }
    unsetDiscussionRid(discussionRid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateMany({
                discussionRid,
            }, {
                $unset: {
                    discussionRid: 1,
                },
            });
        });
    }
}
exports.VideoConferenceRaw = VideoConferenceRaw;
