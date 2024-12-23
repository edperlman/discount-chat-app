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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelVoipService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const underscore_1 = __importDefault(require("underscore"));
const sendMessage_1 = require("../../../app/lib/server/functions/sendMessage");
class OmnichannelVoipService extends core_services_1.ServiceClassInternal {
    constructor() {
        super();
        this.name = 'omnichannel-voip';
        this.logger = new logger_1.Logger('OmnichannelVoipService');
        // handle agent disconnections
        this.onEvent('watch.pbxevents', (_a) => __awaiter(this, [_a], void 0, function* ({ data }) {
            const extension = data.agentExtension;
            if (!extension) {
                return;
            }
            switch (data.event) {
                case 'ContactStatus': {
                    return this.processAgentDisconnect(extension);
                }
                case 'Hangup': {
                    return this.processCallerHangup(extension);
                }
            }
        }));
    }
    processCallerHangup(extension) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info(`Processing hangup event for call with agent on extension ${extension}`);
            const agent = yield models_1.Users.findOneByExtension(extension);
            if (!agent) {
                this.logger.error(`No agent found with extension ${extension}. Event won't proceed`);
                return;
            }
            const currentRoom = yield models_1.VoipRoom.findOneByAgentId(agent._id);
            if (!currentRoom) {
                this.logger.error(`No active call found for agent ${agent._id}`);
                return;
            }
            this.logger.debug(`Notifying agent ${agent._id} of hangup on room ${currentRoom._id}`);
            void core_services_1.api.broadcast('call.callerhangup', agent._id, { roomId: currentRoom._id });
        });
    }
    processAgentDisconnect(extension) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            this.logger.info(`Processing disconnection event for agent with extension ${extension}`);
            const agent = yield models_1.Users.findOneByExtension(extension);
            if (!agent) {
                this.logger.error(`No agent found with extension ${extension}. Event won't proceed`);
                // this should not even be possible, but just in case
                return;
            }
            const openRooms = yield models_1.VoipRoom.findOpenByAgentId(agent._id).toArray();
            this.logger.info(`Closing ${openRooms.length} for agent with extension ${extension}`);
            try {
                // In the best scenario, an agent would only have one active voip room
                // this is to handle the "just in case" scenario of a server and agent failure multiple times
                // and multiple rooms are left opened for one single agent. Best case this will iterate once
                for (var _d = true, openRooms_1 = __asyncValues(openRooms), openRooms_1_1; openRooms_1_1 = yield openRooms_1.next(), _a = openRooms_1_1.done, !_a; _d = true) {
                    _c = openRooms_1_1.value;
                    _d = false;
                    const room = _c;
                    yield this.handleEvent(core_typings_1.VoipClientEvents['VOIP-CALL-ENDED'], room, agent, 'Agent disconnected abruptly');
                    yield this.closeRoom(agent, room, agent, 'voip-call-ended-unexpectedly', { comment: 'Agent disconnected abruptly' });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = openRooms_1.return)) yield _b.call(openRooms_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    createVoipRoom(rid, name, agent, guest, direction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const status = core_typings_1.UserStatus.ONLINE;
            const { _id, department: departmentId } = guest;
            const newRoomAt = new Date();
            /**
             * This is a peculiar case for outbound. In case of outbound,
             * the room is created as soon as the remote use accepts a call.
             * We generate the DialEnd (dialstatus = 'ANSWERED') only when
             * the call is picked up. But the agent receiving 200 OK and the ContinuousMonitor
             * receiving DialEnd happens in any order. So just depending here on
             * DialEnd would result in creating a room which does not have a correct reference of the call.
             *
             * This may result in missed system messages or posting messages to wrong room.
             * So ContinuousMonitor adds a DialState (dialstatus = 'RINGING') event.
             * When this event gets added, findone call below will find the latest of
             * the 'QueueCallerJoin', 'DialEnd', 'DialState' event and create a correct association of the room.
             */
            // Use latest queue caller join event
            const numericPhone = (_b = (_a = guest === null || guest === void 0 ? void 0 : guest.phone) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.phoneNumber.replace(/\D/g, '');
            const callStartPbxEvent = yield models_1.PbxEvents.findOne({
                $or: [
                    {
                        phone: numericPhone, // Incoming calls will have phone number (connectedlinenum) without any symbol
                    },
                    { phone: `*${numericPhone}` }, // Outgoing calls will have phone number (connectedlinenum) with * prefix
                    { phone: `+${numericPhone}` }, // Just in case
                ],
                event: {
                    $in: ['QueueCallerJoin', 'DialEnd', 'DialState'],
                },
            }, { sort: { ts: -1 } });
            if (!callStartPbxEvent) {
                this.logger.warn(`Call for visitor ${guest._id} is not associated with a pbx event`);
            }
            const { queue = 'default', callUniqueId } = callStartPbxEvent || {};
            const room = {
                _id: rid,
                msgs: 0,
                usersCount: 1,
                lm: newRoomAt,
                name: `${name}-${callUniqueId}`,
                fname: name,
                t: 'v',
                ts: newRoomAt,
                departmentId,
                v: Object.assign({ _id, token: guest.token, status, username: guest.username }, (((_c = guest === null || guest === void 0 ? void 0 : guest.phone) === null || _c === void 0 ? void 0 : _c[0]) && { phone: guest.phone[0].phoneNumber })),
                servedBy: {
                    _id: agent.agentId,
                    ts: newRoomAt,
                    username: agent.username,
                },
                open: true,
                waitingResponse: true,
                // this should be overriden by extraRoomInfo when provided
                // in case it's not provided, we'll use this "default" type
                source: {
                    type: core_typings_1.OmnichannelSourceType.API,
                },
                queuedAt: newRoomAt,
                // We assume room is created when call is started (there could be small delay)
                callStarted: newRoomAt,
                queue,
                callUniqueId,
                uids: [],
                autoTranslateLanguage: '',
                livechatData: '',
                u: {
                    _id: agent.agentId,
                    username: agent.username,
                },
                direction,
                _updatedAt: newRoomAt,
            };
            return (yield models_1.VoipRoom.insertOne(room)).insertedId;
        });
    }
    getAllocatedExtesionAllocationData(projection) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = ['livechat-agent', 'livechat-manager', 'admin'];
            const options = {
                sort: {
                    username: 1,
                },
                projection,
            };
            const query = {
                extension: { $exists: true },
            };
            return models_1.Users.findUsersInRolesWithQuery(roles, query, options).toArray();
        });
    }
    getFreeExtensions() {
        return __awaiter(this, void 0, void 0, function* () {
            const allExtensions = yield core_services_1.VoipAsterisk.getExtensionList();
            const allocatedExtensions = yield this.getAllocatedExtesionAllocationData({
                extension: 1,
            });
            const filtered = underscore_1.default.difference(underscore_1.default.pluck(allExtensions.result, 'extension'), underscore_1.default.pluck(allocatedExtensions, 'extension'));
            return filtered;
        });
    }
    getExtensionAllocationDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const allocatedExtensions = yield this.getAllocatedExtesionAllocationData({
                username: 1,
                roles: 1,
                extension: 1,
            });
            return allocatedExtensions.map((user) => ({
                _id: user._id,
                agentName: user.username,
                extension: user.extension,
            }));
        });
    }
    /* Voip calls */
    getNewRoom(guest_1, agent_1, rid_1, direction_1) {
        return __awaiter(this, arguments, void 0, function* (guest, agent, rid, direction, options = {}) {
            let room = yield models_1.VoipRoom.findOneById(rid, options);
            let newRoom = false;
            if (room && !room.open) {
                room = null;
            }
            if (room == null) {
                const name = guest.name || guest.username;
                const roomId = yield this.createVoipRoom(rid, name, agent, guest, direction);
                room = yield models_1.VoipRoom.findOneVoipRoomById(roomId);
                newRoom = true;
            }
            if (!room) {
                throw new Error('cannot-access-room');
            }
            return {
                room,
                newRoom,
            };
        });
    }
    findRoom(token, rid) {
        return __awaiter(this, void 0, void 0, function* () {
            const projection = {
                t: 1,
                departmentId: 1,
                servedBy: 1,
                open: 1,
                v: 1,
                ts: 1,
                callUniqueId: 1,
            };
            if (!rid) {
                return models_1.VoipRoom.findOneByVisitorToken(token, { projection });
            }
            return models_1.VoipRoom.findOneByIdAndVisitorToken(rid, token, { projection });
        });
    }
    closeRoom(closerParam_1, room_1, user_1) {
        return __awaiter(this, arguments, void 0, function* (closerParam, room, user, sysMessageId = 'voip-call-wrapup', options) {
            if (!room || room.t !== 'v' || !room.open) {
                return false;
            }
            let { closeInfo, closeSystemMsgData } = yield this.getBaseRoomClosingData(closerParam, room, sysMessageId, options);
            const finalClosingData = yield this.getRoomClosingData(closeInfo, closeSystemMsgData, room, sysMessageId, options);
            closeInfo = finalClosingData.closeInfo;
            closeSystemMsgData = finalClosingData.closeSystemMsgData;
            yield (0, sendMessage_1.sendMessage)(user, closeSystemMsgData, room);
            // There's a race condition between receiving the call and receiving the event
            // Sometimes it happens before the connection on client, sometimes it happens after
            // For now, this data will be appended as a metric on room closing
            yield this.setCallWaitingQueueTimers(room);
            yield models_1.VoipRoom.closeByRoomId(room._id, closeInfo);
            return true;
        });
    }
    getRoomClosingData(closeInfo, closeSystemMsgData, _room, _sysMessageId, _options) {
        return __awaiter(this, void 0, void 0, function* () {
            return { closeInfo, closeSystemMsgData };
        });
    }
    getBaseRoomClosingData(closerParam, room, sysMessageId, _options) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const closer = (0, core_typings_1.isILivechatVisitor)(closerParam) ? 'visitor' : 'user';
            const closeData = {
                closedAt: now,
                callDuration: now.getTime() - room.ts.getTime(),
                closer,
                closedBy: {
                    _id: closerParam._id,
                    username: closerParam.username,
                },
            };
            const message = {
                t: sysMessageId,
                groupable: false,
            };
            return {
                closeInfo: closeData,
                closeSystemMsgData: message,
            };
        });
    }
    getQueuesForExt(ext, queueInfo) {
        return queueInfo.reduce((acc, queue) => {
            if (queue.members.includes(ext)) {
                acc.push(queue.name);
            }
            return acc;
        }, []);
    }
    getExtensionListWithAgentData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { result: extensions } = yield core_services_1.VoipAsterisk.getExtensionList();
            const summary = yield (yield core_services_1.VoipAsterisk.cachedQueueDetails())();
            const allocatedExtensions = yield this.getAllocatedExtesionAllocationData({
                extension: 1,
                _id: 1,
                username: 1,
                name: 1,
            });
            return extensions.map((ext) => {
                const user = allocatedExtensions.find((ex) => ex.extension === ext.extension);
                return Object.assign({ userId: user === null || user === void 0 ? void 0 : user._id, username: user === null || user === void 0 ? void 0 : user.username, name: user === null || user === void 0 ? void 0 : user.name, queues: this.getQueuesForExt(ext.extension, summary) }, ext);
            });
        });
    }
    findVoipRooms(_a) {
        return __awaiter(this, arguments, void 0, function* ({ agents, open, createdAt, closedAt, visitorId, tags, queue, direction, roomName, options: { offset = 0, count, fields, sort } = {}, }) {
            const { cursor, totalCount } = models_1.VoipRoom.findRoomsWithCriteria({
                agents,
                open,
                createdAt,
                closedAt,
                tags,
                queue,
                visitorId,
                direction,
                roomName,
                options: {
                    sort: sort || { ts: -1 },
                    offset,
                    count,
                    fields,
                },
            });
            const [rooms, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return {
                rooms,
                count: rooms.length,
                total,
                offset,
            };
        });
    }
    setCallWaitingQueueTimers(room) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch agent connected event for started call
            if (!room.callUniqueId) {
                return;
            }
            const agentCalledEvent = yield models_1.PbxEvents.findOneByEvent(room.callUniqueId, 'AgentConnect');
            // Update room with the agentconnect event information (hold time => time call was in queue)
            yield models_1.VoipRoom.updateOne({ _id: room._id }, {
                $set: {
                    // holdtime is stored in seconds, so convert to millis
                    callWaitingTime: Number(agentCalledEvent === null || agentCalledEvent === void 0 ? void 0 : agentCalledEvent.holdTime) * 1000,
                },
            });
        });
    }
    handleEvent(event, room, user, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = {
                t: event,
                msg: comment,
                groupable: false,
                voipData: {
                    callDuration: Number(room.callDuration) || 0,
                    callStarted: ((_a = room.callStarted) === null || _a === void 0 ? void 0 : _a.toISOString()) || new Date().toISOString(),
                },
            };
            if ((0, core_typings_1.isVoipRoom)(room) &&
                room.open &&
                room.callUniqueId &&
                // Check if call exists by looking if we have pbx events of it
                (yield models_1.PbxEvents.findOneByUniqueId(room.callUniqueId))) {
                yield (0, sendMessage_1.sendMessage)(user, message, room);
            }
            else {
                this.logger.warn({ msg: 'Invalid room type or event type', type: room.t, event });
            }
        });
    }
    getAvailableAgents(includeExtension, text, count, offset, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cursor, totalCount } = models_1.Users.getAvailableAgentsIncludingExt(includeExtension, text, { count, skip: offset, sort });
            const [agents, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return {
                agents,
                total,
            };
        });
    }
}
exports.OmnichannelVoipService = OmnichannelVoipService;
