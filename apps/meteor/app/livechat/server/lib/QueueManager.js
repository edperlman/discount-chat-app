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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueManager = exports.queueInquiry = exports.saveQueueInquiry = void 0;
const apps_1 = require("@rocket.chat/apps");
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const Helper_1 = require("./Helper");
const LivechatTyped_1 = require("./LivechatTyped");
const RoutingManager_1 = require("./RoutingManager");
const isVerifiedChannelInSource_1 = require("./contacts/isVerifiedChannelInSource");
const getOnlineAgents_1 = require("./getOnlineAgents");
const settings_1 = require("./settings");
const Helper_2 = require("../../../../ee/app/livechat-enterprise/server/lib/Helper");
const callbacks_1 = require("../../../../lib/callbacks");
const server_1 = require("../../../lib/server");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_2 = require("../../../settings/server");
const i18n_1 = require("../../../utils/lib/i18n");
const logger = new logger_1.Logger('QueueManager');
const saveQueueInquiry = (inquiry) => __awaiter(void 0, void 0, void 0, function* () {
    const queuedInquiry = yield models_1.LivechatInquiry.queueInquiry(inquiry._id);
    if (!queuedInquiry) {
        return;
    }
    yield callbacks_1.callbacks.run('livechat.afterInquiryQueued', queuedInquiry);
    void (0, notifyListener_1.notifyOnLivechatInquiryChanged)(queuedInquiry, 'updated', {
        status: core_typings_1.LivechatInquiryStatus.QUEUED,
        queuedAt: new Date(),
        takenAt: undefined,
    });
});
exports.saveQueueInquiry = saveQueueInquiry;
/**
 *  @deprecated
 */
const queueInquiry = (inquiry, defaultAgent) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield models_1.LivechatRooms.findOneById(inquiry.rid, { projection: { v: 1 } });
    if (!room) {
        yield (0, exports.saveQueueInquiry)(inquiry);
        return;
    }
    return QueueManager.requeueInquiry(inquiry, room, defaultAgent);
});
exports.queueInquiry = queueInquiry;
const getDepartment = (department) => __awaiter(void 0, void 0, void 0, function* () {
    if (!department) {
        return;
    }
    if (yield models_1.LivechatDepartmentAgents.checkOnlineForDepartment(department)) {
        return department;
    }
    const departmentDocument = yield models_1.LivechatDepartment.findOneById(department, {
        projection: { fallbackForwardDepartment: 1 },
    });
    if (departmentDocument === null || departmentDocument === void 0 ? void 0 : departmentDocument.fallbackForwardDepartment) {
        return getDepartment(departmentDocument.fallbackForwardDepartment);
    }
});
class QueueManager {
    static requeueInquiry(inquiry, room, defaultAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield core_services_1.Omnichannel.isWithinMACLimit(room))) {
                logger.error({ msg: 'MAC limit reached, not routing inquiry', inquiry });
                // We'll queue these inquiries so when new license is applied, they just start rolling again
                // Minimizing disruption
                yield (0, exports.saveQueueInquiry)(inquiry);
                return;
            }
            const inquiryAgent = yield RoutingManager_1.RoutingManager.delegateAgent(defaultAgent, inquiry);
            logger.debug(`Delegating inquiry with id ${inquiry._id} to agent ${defaultAgent === null || defaultAgent === void 0 ? void 0 : defaultAgent.username}`);
            const dbInquiry = yield callbacks_1.callbacks.run('livechat.beforeRouteChat', inquiry, inquiryAgent);
            if (!dbInquiry) {
                throw new Error('inquiry-not-found');
            }
            if (dbInquiry.status === 'ready') {
                logger.debug(`Inquiry with id ${inquiry._id} is ready. Delegating to agent ${inquiryAgent === null || inquiryAgent === void 0 ? void 0 : inquiryAgent.username}`);
                return RoutingManager_1.RoutingManager.delegateInquiry(dbInquiry, inquiryAgent, undefined, room);
            }
        });
    }
    static patchInquiryStatus(fn) {
        this.fnQueueInquiryStatus = fn;
    }
    static getInquiryStatus(_b) {
        return __awaiter(this, arguments, void 0, function* ({ room, agent }) {
            var _c;
            if (this.fnQueueInquiryStatus) {
                return this.fnQueueInquiryStatus({ room, agent });
            }
            const needVerification = ['once', 'always'].includes(server_2.settings.get('Livechat_Require_Contact_Verification'));
            if (needVerification && !(yield this.isRoomContactVerified(room))) {
                return core_typings_1.LivechatInquiryStatus.VERIFYING;
            }
            if (!(yield core_services_1.Omnichannel.isWithinMACLimit(room))) {
                return core_typings_1.LivechatInquiryStatus.QUEUED;
            }
            if (server_2.settings.get('Livechat_waiting_queue')) {
                return core_typings_1.LivechatInquiryStatus.QUEUED;
            }
            if ((_c = RoutingManager_1.RoutingManager.getConfig()) === null || _c === void 0 ? void 0 : _c.autoAssignAgent) {
                return core_typings_1.LivechatInquiryStatus.READY;
            }
            if (!agent || !(yield (0, Helper_1.allowAgentSkipQueue)(agent))) {
                return core_typings_1.LivechatInquiryStatus.QUEUED;
            }
            return core_typings_1.LivechatInquiryStatus.READY;
        });
    }
    static processNewInquiry(inquiry, room, defaultAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (inquiry.status === core_typings_1.LivechatInquiryStatus.VERIFYING) {
                logger.debug({ msg: 'Inquiry is waiting for contact verification. Ignoring it', inquiry, defaultAgent });
                if (defaultAgent) {
                    yield models_1.LivechatInquiry.setDefaultAgentById(inquiry._id, defaultAgent);
                }
                return;
            }
            if (inquiry.status === core_typings_1.LivechatInquiryStatus.READY) {
                logger.debug({ msg: 'Inquiry is ready. Delegating', inquiry, defaultAgent });
                return RoutingManager_1.RoutingManager.delegateInquiry(inquiry, defaultAgent, undefined, room);
            }
            if (inquiry.status === core_typings_1.LivechatInquiryStatus.QUEUED) {
                yield callbacks_1.callbacks.run('livechat.afterInquiryQueued', inquiry);
                void callbacks_1.callbacks.run('livechat.chatQueued', room);
                return this.dispatchInquiryQueued(inquiry, room, defaultAgent);
            }
        });
    }
    static verifyInquiry(inquiry, room) {
        return __awaiter(this, void 0, void 0, function* () {
            if (inquiry.status !== core_typings_1.LivechatInquiryStatus.VERIFYING) {
                return;
            }
            const { defaultAgent: agent } = inquiry;
            const newStatus = yield _a.getInquiryStatus({ room, agent });
            if (newStatus === inquiry.status) {
                throw new Error('error-failed-to-verify-inquiry');
            }
            const newInquiry = yield models_1.LivechatInquiry.setStatusById(inquiry._id, newStatus);
            yield this.processNewInquiry(newInquiry, room, agent);
            const newRoom = yield models_1.LivechatRooms.findOneById(room._id, {
                projection: { servedBy: 1, departmentId: 1 },
            });
            if (!newRoom) {
                logger.error(`Room with id ${room._id} not found after inquiry verification.`);
                throw new Error('room-not-found');
            }
            yield this.dispatchInquiryPosition(inquiry, newRoom);
        });
    }
    static isRoomContactVerified(room) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!room.contactId) {
                return false;
            }
            const contact = yield models_1.LivechatContacts.findOneById(room.contactId, { projection: { channels: 1 } });
            if (!contact) {
                return false;
            }
            return Boolean(contact.channels.some((channel) => (0, isVerifiedChannelInSource_1.isVerifiedChannelInSource)(channel, room.v._id, room.source)));
        });
    }
    static requestRoom(_b) {
        return __awaiter(this, void 0, void 0, function* () {
            var _c;
            var { guest, rid = random_1.Random.id(), message, roomInfo, agent } = _b, _d = _b.extraData, _e = _d === void 0 ? {} : _d, { customFields } = _e, extraData = __rest(_e, ["customFields"]);
            logger.debug(`Requesting a room for guest ${guest._id}`);
            (0, check_1.check)(guest, check_1.Match.ObjectIncluding({
                _id: String,
                username: String,
                status: check_1.Match.Maybe(String),
                department: check_1.Match.Maybe(String),
                name: check_1.Match.Maybe(String),
                activity: check_1.Match.Maybe([String]),
            }));
            const defaultAgent = (yield callbacks_1.callbacks.run('livechat.beforeDelegateAgent', agent, {
                department: guest.department,
            })) || undefined;
            const department = guest.department && (yield getDepartment(guest.department));
            /**
             * we have 4 cases here
             * 1. agent and no department
             * 2. no agent and no department
             * 3. no agent and department
             * 4. agent and department informed
             *
             * in case 1, we check if the agent is online
             * in case 2, we check if there is at least one online agent in the whole service
             * in case 3, we check if there is at least one online agent in the department
             *
             * the case 4 is weird, but we are not throwing an error, just because the application works in some mysterious way
             * we don't have explicitly defined what to do in this case so we just kept the old behavior
             * it seems that agent has priority over department
             * but some cases department is handled before agent
             *
             */
            if (!server_2.settings.get('Livechat_accept_chats_with_no_agents')) {
                if (agent && !defaultAgent) {
                    throw new meteor_1.Meteor.Error('no-agent-online', 'Sorry, no online agents');
                }
                if (!defaultAgent && guest.department && !department) {
                    throw new meteor_1.Meteor.Error('no-agent-online', 'Sorry, no online agents');
                }
                if (!agent && !guest.department && !(yield LivechatTyped_1.Livechat.checkOnlineAgents())) {
                    throw new meteor_1.Meteor.Error('no-agent-online', 'Sorry, no online agents');
                }
            }
            const room = yield (0, Helper_1.createLivechatRoom)(rid, Object.assign(Object.assign({}, guest), (department && { department })), roomInfo, Object.assign(Object.assign({}, extraData), (Boolean(customFields) && { customFields })));
            if (!room) {
                logger.error(`Room for visitor ${guest._id} not found`);
                throw new Error('room-not-found');
            }
            logger.debug(`Room for visitor ${guest._id} created with id ${room._id}`);
            const inquiry = yield (0, Helper_1.createLivechatInquiry)({
                rid,
                name: room.fname,
                initialStatus: yield this.getInquiryStatus({ room, agent: defaultAgent }),
                guest,
                message,
                extraData: Object.assign(Object.assign({}, extraData), { source: roomInfo.source }),
            });
            if (!inquiry) {
                logger.error(`Inquiry for visitor ${guest._id} not found`);
                throw new Error('inquiry-not-found');
            }
            void ((_c = apps_1.Apps.self) === null || _c === void 0 ? void 0 : _c.triggerEvent(apps_1.AppEvents.IPostLivechatRoomStarted, room));
            const livechatSetting = yield models_1.LivechatRooms.updateRoomCount();
            if (livechatSetting) {
                void (0, notifyListener_1.notifyOnSettingChanged)(livechatSetting);
            }
            yield this.processNewInquiry(inquiry, room, defaultAgent);
            const newRoom = yield models_1.LivechatRooms.findOneById(rid);
            if (!newRoom) {
                logger.error(`Room with id ${rid} not found`);
                throw new Error('room-not-found');
            }
            yield this.dispatchInquiryPosition(inquiry, newRoom);
            return newRoom;
        });
    }
    static dispatchInquiryPosition(inquiry, room) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!room.servedBy &&
                inquiry.status !== core_typings_1.LivechatInquiryStatus.VERIFYING &&
                server_2.settings.get('Livechat_waiting_queue') &&
                server_2.settings.get('Omnichannel_calculate_dispatch_service_queue_statistics')) {
                const [inq] = yield models_1.LivechatInquiry.getCurrentSortedQueueAsync({
                    inquiryId: inquiry._id,
                    department: room.departmentId,
                    queueSortBy: (0, settings_1.getInquirySortMechanismSetting)(),
                });
                if (inq) {
                    void (0, Helper_2.dispatchInquiryPosition)(inq);
                }
            }
        });
    }
    static unarchiveRoom(archivedRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!archivedRoom) {
                throw new Error('no-room-to-unarchive');
            }
            const { _id: rid, open, closedAt, fname: name, servedBy, v, departmentId: department, lastMessage: message, source } = archivedRoom;
            if (!rid || !closedAt || !!open) {
                return archivedRoom;
            }
            logger.debug(`Attempting to unarchive room with id ${rid}`);
            const oldInquiry = yield models_1.LivechatInquiry.findOneByRoomId(rid, { projection: { _id: 1 } });
            if (oldInquiry) {
                logger.debug(`Removing old inquiry (${oldInquiry._id}) for room ${rid}`);
                yield models_1.LivechatInquiry.removeByRoomId(rid);
                void (0, notifyListener_1.notifyOnLivechatInquiryChangedById)(oldInquiry._id, 'removed');
            }
            const guest = Object.assign(Object.assign({}, v), (department && { department }));
            let defaultAgent;
            if ((servedBy === null || servedBy === void 0 ? void 0 : servedBy.username) && (yield models_1.Users.findOneOnlineAgentByUserList(servedBy.username))) {
                defaultAgent = { agentId: servedBy._id, username: servedBy.username };
            }
            yield models_1.LivechatRooms.unarchiveOneById(rid);
            const room = yield models_1.LivechatRooms.findOneById(rid);
            if (!room) {
                throw new Error('room-not-found');
            }
            const inquiry = yield (0, Helper_1.createLivechatInquiry)({
                rid,
                name,
                guest,
                message: message === null || message === void 0 ? void 0 : message.msg,
                extraData: { source },
            });
            if (!inquiry) {
                throw new Error('inquiry-not-found');
            }
            yield this.requeueInquiry(inquiry, room, defaultAgent);
            logger.debug(`Inquiry ${inquiry._id} queued`);
            return room;
        });
    }
}
exports.QueueManager = QueueManager;
_a = QueueManager;
QueueManager.dispatchInquiryQueued = (inquiry, room, agent) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_1, _c, _d;
    var _e;
    if ((_e = RoutingManager_1.RoutingManager.getConfig()) === null || _e === void 0 ? void 0 : _e.autoAssignAgent) {
        return;
    }
    logger.debug(`Notifying agents of new inquiry ${inquiry._id} queued`);
    const { department, rid, v } = inquiry;
    // Alert only the online agents of the queued request
    const onlineAgents = yield (0, getOnlineAgents_1.getOnlineAgents)(department, agent);
    if (!onlineAgents) {
        logger.debug('Cannot notify agents of queued inquiry. No online agents found');
        return;
    }
    const notificationUserName = v && (v.name || v.username);
    try {
        for (var _f = true, onlineAgents_1 = __asyncValues(onlineAgents), onlineAgents_1_1; onlineAgents_1_1 = yield onlineAgents_1.next(), _b = onlineAgents_1_1.done, !_b; _f = true) {
            _d = onlineAgents_1_1.value;
            _f = false;
            const agent = _d;
            const { _id, active, emails, language, status, statusConnection, username } = agent;
            yield (0, server_1.sendNotification)({
                // fake a subscription in order to make use of the function defined above
                subscription: {
                    rid,
                    u: {
                        _id,
                    },
                    receiver: [
                        {
                            active,
                            emails,
                            language,
                            status,
                            statusConnection,
                            username,
                        },
                    ],
                    name: '',
                },
                sender: v,
                hasMentionToAll: true, // consider all agents to be in the room
                hasReplyToThread: false,
                disableAllMessageNotifications: false,
                hasMentionToHere: false,
                message: { _id: '', u: v, msg: '' },
                // we should use server's language for this type of messages instead of user's
                notificationMessage: i18n_1.i18n.t('User_started_a_new_conversation', { username: notificationUserName, lng: language }),
                room: Object.assign(Object.assign({}, room), { name: i18n_1.i18n.t('New_chat_in_queue', { lng: language }) }),
                mentionIds: [],
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_f && !_b && (_c = onlineAgents_1.return)) yield _c.call(onlineAgents_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
