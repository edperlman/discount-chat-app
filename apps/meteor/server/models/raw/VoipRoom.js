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
exports.VoipRoomRaw = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const BaseRaw_1 = require("./BaseRaw");
class VoipRoomRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'room', trash);
        this.logger = new logger_1.Logger('VoipRoomsRaw');
    }
    findOneOpenByVisitorToken(visitorToken_1) {
        return __awaiter(this, arguments, void 0, function* (visitorToken, options = {}) {
            const query = {
                't': 'v',
                'open': true,
                'v.token': visitorToken,
            };
            return this.findOne(query, options);
        });
    }
    findOpenByAgentId(agentId) {
        return this.find({
            't': 'v',
            'open': true,
            'servedBy._id': agentId,
        });
    }
    findOneByAgentId(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({
                't': 'v',
                'open': true,
                'servedBy._id': agentId,
            });
        });
    }
    findOneVoipRoomById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, options = {}) {
            const query = {
                t: 'v',
                _id: id,
            };
            return this.findOne(query, options);
        });
    }
    findOneOpenByRoomIdAndVisitorToken(roomId_1, visitorToken_1) {
        return __awaiter(this, arguments, void 0, function* (roomId, visitorToken, options = {}) {
            const query = {
                't': 'v',
                '_id': roomId,
                'open': true,
                'v.token': visitorToken,
            };
            return this.findOne(query, options);
        });
    }
    findOneByVisitorToken(visitorToken_1) {
        return __awaiter(this, arguments, void 0, function* (visitorToken, options = {}) {
            const query = {
                't': 'v',
                'v.token': visitorToken,
            };
            return this.findOne(query, options);
        });
    }
    findOneByIdAndVisitorToken(_id_1, visitorToken_1) {
        return __awaiter(this, arguments, void 0, function* (_id, visitorToken, options = {}) {
            const query = {
                't': 'v',
                _id,
                'v.token': visitorToken,
            };
            return this.findOne(query, options);
        });
    }
    closeByRoomId(roomId, closeInfo) {
        const { closer, closedBy, closedAt, callDuration, serviceTimeDuration } = closeInfo, extraData = __rest(closeInfo, ["closer", "closedBy", "closedAt", "callDuration", "serviceTimeDuration"]);
        return this.updateOne({
            _id: roomId,
            t: 'v',
        }, {
            $set: Object.assign({ closer,
                closedBy,
                closedAt,
                callDuration, 'metrics.serviceTimeDuration': serviceTimeDuration, 'v.status': core_typings_1.UserStatus.OFFLINE }, extraData),
            $unset: {
                open: 1,
            },
        });
    }
    findRoomsWithCriteria({ agents, open, createdAt, closedAt, tags, queue, visitorId, direction, roomName, options = {}, }) {
        const query = Object.assign(Object.assign({ t: 'v' }, (visitorId && visitorId !== 'undefined' && { 'v._id': visitorId })), (agents && { 'servedBy._id': { $in: agents } }));
        if (open !== undefined) {
            query.open = { $exists: open };
        }
        if (createdAt && Object.keys(createdAt).length) {
            query.ts = {};
            if (createdAt.start) {
                query.ts.$gte = new Date(createdAt.start);
            }
            if (createdAt.end) {
                query.ts.$lte = new Date(createdAt.end);
            }
        }
        if (closedAt && Object.keys(closedAt).length) {
            query.closedAt = {};
            if (closedAt.start) {
                query.closedAt.$gte = new Date(closedAt.start);
            }
            if (closedAt.end) {
                query.closedAt.$lte = new Date(closedAt.end);
            }
        }
        if (tags) {
            query.tags = { $in: tags };
        }
        if (queue) {
            query.queue = queue;
        }
        if (direction) {
            query.direction = direction;
        }
        if (roomName) {
            query.name = new RegExp((0, string_helpers_1.escapeRegExp)(roomName), 'i');
        }
        return this.findPaginated(query, {
            sort: options.sort || { name: 1 },
            skip: options.offset,
            limit: options.count,
        });
    }
}
exports.VoipRoomRaw = VoipRoomRaw;
