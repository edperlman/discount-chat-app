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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.updateDepartmentAgents = exports.normalizeTransferredByData = exports.forwardRoomToDepartment = exports.updateChatDepartment = exports.forwardRoomToAgent = exports.dispatchInquiryQueued = exports.dispatchAgentDelegated = exports.normalizeAgent = exports.parseAgentCustomFields = exports.removeAgentFromSubscription = exports.createLivechatSubscription = exports.createLivechatInquiry = exports.createLivechatRoom = exports.allowAgentSkipQueue = void 0;
const apps_1 = require("@rocket.chat/apps");
const livechat_1 = require("@rocket.chat/apps-engine/definition/livechat");
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const ILivechatPriority_1 = require("@rocket.chat/core-typings/src/ILivechatPriority");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const mongodb_1 = require("mongodb");
const LivechatTyped_1 = require("./LivechatTyped");
const QueueManager_1 = require("./QueueManager");
const RoutingManager_1 = require("./RoutingManager");
const isVerifiedChannelInSource_1 = require("./contacts/isVerifiedChannelInSource");
const migrateVisitorIfMissingContact_1 = require("./contacts/migrateVisitorIfMissingContact");
const getOnlineAgents_1 = require("./getOnlineAgents");
const callbacks_1 = require("../../../../lib/callbacks");
const emailValidator_1 = require("../../../../lib/emailValidator");
const i18n_1 = require("../../../../server/lib/i18n");
const hasRole_1 = require("../../../authorization/server/functions/hasRole");
const server_1 = require("../../../lib/server");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_2 = require("../../../settings/server");
const logger = new logger_1.Logger('LivechatHelper');
const allowAgentSkipQueue = (agent) => {
    (0, check_1.check)(agent, check_1.Match.ObjectIncluding({
        agentId: String,
    }));
    return (0, hasRole_1.hasRoleAsync)(agent.agentId, 'bot');
};
exports.allowAgentSkipQueue = allowAgentSkipQueue;
const createLivechatRoom = (rid_1, guest_1, ...args_1) => __awaiter(void 0, [rid_1, guest_1, ...args_1], void 0, function* (rid, guest, roomInfo = { source: { type: core_typings_1.OmnichannelSourceType.OTHER } }, extraData) {
    (0, check_1.check)(rid, String);
    (0, check_1.check)(guest, check_1.Match.ObjectIncluding({
        _id: String,
        username: String,
        status: check_1.Match.Maybe(String),
        department: check_1.Match.Maybe(String),
    }));
    const extraRoomInfo = yield callbacks_1.callbacks.run('livechat.beforeRoom', roomInfo, extraData);
    const { _id, username, token, department: departmentId, status = 'online' } = guest;
    const newRoomAt = new Date();
    const { activity } = guest;
    logger.debug({
        msg: `Creating livechat room for visitor ${_id}`,
        visitor: { _id, username, departmentId, status, activity },
    });
    const source = extraRoomInfo.source || roomInfo.source;
    if (server_2.settings.get('Livechat_Require_Contact_Verification') === 'always') {
        yield models_1.LivechatContacts.updateContactChannel({ visitorId: _id, source }, { verified: false });
    }
    const contactId = yield (0, migrateVisitorIfMissingContact_1.migrateVisitorIfMissingContact)(_id, source);
    const contact = contactId &&
        (yield models_1.LivechatContacts.findOneById(contactId, {
            projection: { name: 1, channels: 1 },
        }));
    if (!contact) {
        throw new Error('error-invalid-contact');
    }
    const verified = Boolean(contact.channels.some((channel) => (0, isVerifiedChannelInSource_1.isVerifiedChannelInSource)(channel, _id, source)));
    // TODO: Solve `u` missing issue
    const room = Object.assign({ _id: rid, msgs: 0, usersCount: 1, lm: newRoomAt, fname: contact.name, t: 'l', ts: newRoomAt, departmentId, v: Object.assign({ _id,
            username,
            token,
            status }, ((activity === null || activity === void 0 ? void 0 : activity.length) && { activity })), contactId, cl: false, open: true, waitingResponse: true, verified, 
        // this should be overridden by extraRoomInfo when provided
        // in case it's not provided, we'll use this "default" type
        source: {
            type: core_typings_1.OmnichannelSourceType.OTHER,
            alias: 'unknown',
        }, queuedAt: newRoomAt, livechatData: undefined, priorityWeight: ILivechatPriority_1.LivechatPriorityWeight.NOT_SPECIFIED, estimatedWaitingTimeQueue: core_typings_1.DEFAULT_SLA_CONFIG.ESTIMATED_WAITING_TIME_QUEUE }, extraRoomInfo);
    const result = yield models_1.Rooms.findOneAndUpdate(room, {
        $set: {},
    }, {
        upsert: true,
        returnDocument: 'after',
    });
    if (!result.value) {
        throw new Error('Room not created');
    }
    yield callbacks_1.callbacks.run('livechat.newRoom', room);
    yield core_services_1.Message.saveSystemMessageAndNotifyUser('livechat-started', rid, '', { _id, username }, { groupable: false, token: guest.token });
    return result.value;
});
exports.createLivechatRoom = createLivechatRoom;
const createLivechatInquiry = (_a) => __awaiter(void 0, [_a], void 0, function* ({ rid, name, guest, message, initialStatus, extraData, }) {
    (0, check_1.check)(rid, String);
    (0, check_1.check)(name, String);
    (0, check_1.check)(guest, check_1.Match.ObjectIncluding({
        _id: String,
        username: String,
        status: check_1.Match.Maybe(String),
        department: check_1.Match.Maybe(String),
        activity: check_1.Match.Maybe([String]),
    }));
    const extraInquiryInfo = yield callbacks_1.callbacks.run('livechat.beforeInquiry', extraData);
    const { _id, username, token, department, status = core_typings_1.UserStatus.ONLINE, activity } = guest;
    const ts = new Date();
    logger.debug({
        msg: `Creating livechat inquiry for visitor ${_id}`,
        visitor: { _id, username, department, status, activity },
    });
    const result = yield models_1.LivechatInquiry.findOneAndUpdate(Object.assign({ rid,
        name,
        ts,
        department, message: message !== null && message !== void 0 ? message : '', status: initialStatus || core_typings_1.LivechatInquiryStatus.READY, v: Object.assign({ _id,
            username,
            token,
            status }, ((activity === null || activity === void 0 ? void 0 : activity.length) && { activity })), t: 'l', priorityWeight: ILivechatPriority_1.LivechatPriorityWeight.NOT_SPECIFIED, estimatedWaitingTimeQueue: core_typings_1.DEFAULT_SLA_CONFIG.ESTIMATED_WAITING_TIME_QUEUE }, extraInquiryInfo), {
        $set: {
            _id: new mongodb_1.ObjectId().toHexString(),
        },
    }, {
        upsert: true,
        returnDocument: 'after',
    });
    logger.debug(`Inquiry ${result} created for visitor ${_id}`);
    if (!result.value) {
        throw new Error('Inquiry not created');
    }
    return result.value;
});
exports.createLivechatInquiry = createLivechatInquiry;
const createLivechatSubscription = (rid, name, guest, agent, department) => __awaiter(void 0, void 0, void 0, function* () {
    (0, check_1.check)(rid, String);
    (0, check_1.check)(name, String);
    (0, check_1.check)(guest, check_1.Match.ObjectIncluding({
        _id: String,
        username: String,
        status: check_1.Match.Maybe(String),
    }));
    (0, check_1.check)(agent, check_1.Match.ObjectIncluding({
        agentId: String,
        username: String,
    }));
    const existingSubscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, agent.agentId);
    if (existingSubscription === null || existingSubscription === void 0 ? void 0 : existingSubscription._id) {
        return existingSubscription;
    }
    const { _id, username, token, status = core_typings_1.UserStatus.ONLINE } = guest;
    const subscriptionData = Object.assign({ rid,
        name, fname: name, alert: true, open: true, unread: 1, userMentions: 1, groupMentions: 0, u: {
            _id: agent.agentId,
            username: agent.username,
        }, t: 'l', desktopNotifications: 'all', mobilePushNotifications: 'all', emailNotifications: 'all', v: {
            _id,
            username,
            token,
            status,
        }, ts: new Date() }, (department && { department }));
    const response = yield models_1.Subscriptions.insertOne(subscriptionData);
    if (response === null || response === void 0 ? void 0 : response.insertedId) {
        void (0, notifyListener_1.notifyOnSubscriptionChangedById)(response.insertedId, 'inserted');
    }
    return response;
});
exports.createLivechatSubscription = createLivechatSubscription;
const removeAgentFromSubscription = (rid_1, _a) => __awaiter(void 0, [rid_1, _a], void 0, function* (rid, { _id, username }) {
    const room = yield models_1.LivechatRooms.findOneById(rid);
    const user = yield models_1.Users.findOneById(_id);
    if (!room || !user) {
        return;
    }
    const deletedSubscription = yield models_1.Subscriptions.removeByRoomIdAndUserId(rid, _id);
    if (deletedSubscription) {
        void (0, notifyListener_1.notifyOnSubscriptionChanged)(deletedSubscription, 'removed');
    }
    yield core_services_1.Message.saveSystemMessage('ul', rid, username || '', { _id: user._id, username: user.username, name: user.name });
    setImmediate(() => {
        var _a;
        void ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPostLivechatAgentUnassigned, { room, user }));
    });
});
exports.removeAgentFromSubscription = removeAgentFromSubscription;
const parseAgentCustomFields = (customFields) => {
    if (!customFields) {
        return;
    }
    const externalCustomFields = () => {
        const accountCustomFields = server_2.settings.get('Accounts_CustomFields');
        if (!accountCustomFields || accountCustomFields.trim() === '') {
            return [];
        }
        try {
            const parseCustomFields = JSON.parse(accountCustomFields);
            return Object.keys(parseCustomFields).filter((customFieldKey) => parseCustomFields[customFieldKey].sendToIntegrations === true);
        }
        catch (error) {
            logger.error(error);
            return [];
        }
    };
    const externalCF = externalCustomFields();
    return Object.keys(customFields).reduce((newObj, key) => (externalCF.includes(key) ? Object.assign(Object.assign({}, newObj), { [key]: customFields[key] }) : newObj), {});
};
exports.parseAgentCustomFields = parseAgentCustomFields;
const normalizeAgent = (agentId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!agentId) {
        return;
    }
    if (!server_2.settings.get('Livechat_show_agent_info')) {
        return { hiddenInfo: true };
    }
    const agent = yield models_1.Users.getAgentInfo(agentId, server_2.settings.get('Livechat_show_agent_email'));
    if (!agent) {
        return;
    }
    const { customFields: agentCustomFields } = agent, extraData = __rest(agent, ["customFields"]);
    const customFields = (0, exports.parseAgentCustomFields)(agentCustomFields);
    return Object.assign(extraData, Object.assign({}, (customFields && { customFields })));
});
exports.normalizeAgent = normalizeAgent;
const dispatchAgentDelegated = (rid, agentId) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield (0, exports.normalizeAgent)(agentId);
    void core_services_1.api.broadcast('omnichannel.room', rid, {
        type: 'agentData',
        data: agent,
    });
});
exports.dispatchAgentDelegated = dispatchAgentDelegated;
/**
 * @deprecated
 */
const dispatchInquiryQueued = (inquiry, agent) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d;
    if (!(inquiry === null || inquiry === void 0 ? void 0 : inquiry._id)) {
        return;
    }
    logger.debug(`Notifying agents of new inquiry ${inquiry._id} queued`);
    const { department, rid, v } = inquiry;
    const room = yield models_1.LivechatRooms.findOneById(rid);
    if (!room) {
        return;
    }
    setImmediate(() => callbacks_1.callbacks.run('livechat.chatQueued', room));
    if ((_d = RoutingManager_1.RoutingManager.getConfig()) === null || _d === void 0 ? void 0 : _d.autoAssignAgent) {
        return;
    }
    if (agent && (yield (0, exports.allowAgentSkipQueue)(agent))) {
        return;
    }
    yield (0, QueueManager_1.saveQueueInquiry)(inquiry);
    // Alert only the online agents of the queued request
    const onlineAgents = yield (0, getOnlineAgents_1.getOnlineAgents)(department, agent);
    if (!onlineAgents) {
        logger.debug('Cannot notify agents of queued inquiry. No online agents found');
        return;
    }
    const notificationUserName = v && (v.name || v.username);
    try {
        for (var _e = true, onlineAgents_1 = __asyncValues(onlineAgents), onlineAgents_1_1; onlineAgents_1_1 = yield onlineAgents_1.next(), _a = onlineAgents_1_1.done, !_a; _e = true) {
            _c = onlineAgents_1_1.value;
            _e = false;
            const agent = _c;
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
                room: Object.assign(room, { name: i18n_1.i18n.t('New_chat_in_queue', { lng: language }) }),
                mentionIds: [],
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_e && !_a && (_b = onlineAgents_1.return)) yield _b.call(onlineAgents_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
exports.dispatchInquiryQueued = dispatchInquiryQueued;
const forwardRoomToAgent = (room, transferData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(room === null || room === void 0 ? void 0 : room.open)) {
        return false;
    }
    logger.debug(`Forwarding room ${room._id} to agent ${transferData.userId}`);
    const { userId: agentId, clientAction } = transferData;
    if (!agentId) {
        throw new Error('error-invalid-agent');
    }
    const user = yield models_1.Users.findOneOnlineAgentById(agentId);
    if (!user) {
        logger.debug(`Agent ${agentId} is offline. Cannot forward`);
        throw new Error('error-user-is-offline');
    }
    const { _id: rid, servedBy: oldServedBy } = room;
    const inquiry = yield models_1.LivechatInquiry.findOneByRoomId(rid, {});
    if (!inquiry) {
        logger.debug(`No inquiries found for room ${room._id}. Cannot forward`);
        throw new Error('error-invalid-inquiry');
    }
    if (oldServedBy && agentId === oldServedBy._id) {
        throw new Error('error-selected-agent-room-agent-are-same');
    }
    const { username } = user;
    const agent = { agentId, username };
    // Remove department from inquiry to make sure the routing algorithm treat this as forwarding to agent and not as forwarding to department
    delete inquiry.department;
    // There are some Enterprise features that may interrupt the forwarding process
    // Due to that we need to check whether the agent has been changed or not
    logger.debug(`Forwarding inquiry ${inquiry._id} to agent ${agent.agentId}`);
    const roomTaken = yield RoutingManager_1.RoutingManager.takeInquiry(inquiry, agent, Object.assign({}, (clientAction && { clientAction })), room);
    if (!roomTaken) {
        logger.debug(`Cannot forward inquiry ${inquiry._id}`);
        return false;
    }
    yield LivechatTyped_1.Livechat.saveTransferHistory(room, transferData);
    const { servedBy } = roomTaken;
    if (servedBy) {
        if (oldServedBy && servedBy._id !== oldServedBy._id) {
            yield RoutingManager_1.RoutingManager.removeAllRoomSubscriptions(room, servedBy);
        }
        setImmediate(() => {
            var _a;
            void ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPostLivechatRoomTransferred, {
                type: livechat_1.LivechatTransferEventType.AGENT,
                room: rid,
                from: oldServedBy === null || oldServedBy === void 0 ? void 0 : oldServedBy._id,
                to: servedBy._id,
            }));
        });
    }
    logger.debug(`Inquiry ${inquiry._id} taken by agent ${agent.agentId}`);
    yield callbacks_1.callbacks.run('livechat.afterForwardChatToAgent', { rid, servedBy, oldServedBy });
    return true;
});
exports.forwardRoomToAgent = forwardRoomToAgent;
const updateChatDepartment = (_a) => __awaiter(void 0, [_a], void 0, function* ({ rid, newDepartmentId, oldDepartmentId, }) {
    const responses = yield Promise.all([
        models_1.LivechatRooms.changeDepartmentIdByRoomId(rid, newDepartmentId),
        models_1.LivechatInquiry.changeDepartmentIdByRoomId(rid, newDepartmentId),
        models_1.Subscriptions.changeDepartmentByRoomId(rid, newDepartmentId),
    ]);
    if (responses[2].modifiedCount) {
        void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(rid);
    }
    setImmediate(() => {
        var _a;
        void ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPostLivechatRoomTransferred, {
            type: livechat_1.LivechatTransferEventType.DEPARTMENT,
            room: rid,
            from: oldDepartmentId,
            to: newDepartmentId,
        }));
    });
    return callbacks_1.callbacks.run('livechat.afterForwardChatToDepartment', {
        rid,
        newDepartmentId,
        oldDepartmentId,
    });
});
exports.updateChatDepartment = updateChatDepartment;
const forwardRoomToDepartment = (room, guest, transferData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!(room === null || room === void 0 ? void 0 : room.open)) {
        return false;
    }
    logger.debug(`Attempting to forward room ${room._id} to department ${transferData.departmentId}`);
    yield callbacks_1.callbacks.run('livechat.beforeForwardRoomToDepartment', { room, transferData });
    const { _id: rid, servedBy: oldServedBy, departmentId: oldDepartmentId } = room;
    let agent = null;
    const inquiry = yield models_1.LivechatInquiry.findOneByRoomId(rid, {});
    if (!inquiry) {
        logger.debug(`Cannot forward room ${room._id}. No inquiries found`);
        throw new Error('error-transferring-inquiry');
    }
    const { departmentId } = transferData;
    if (!departmentId) {
        logger.debug(`Cannot forward room ${room._id}. No departmentId provided`);
        throw new Error('error-transferring-inquiry-no-department');
    }
    if (oldDepartmentId === departmentId) {
        throw new Error('error-forwarding-chat-same-department');
    }
    const { userId: agentId, clientAction } = transferData;
    if (agentId) {
        logger.debug(`Forwarding room ${room._id} to department ${departmentId} (to user ${agentId})`);
        const user = yield models_1.Users.findOneOnlineAgentById(agentId);
        if (!user) {
            throw new Error('error-user-is-offline');
        }
        const isInDepartment = yield models_1.LivechatDepartmentAgents.findOneByAgentIdAndDepartmentId(agentId, departmentId, {
            projection: { _id: 1 },
        });
        if (!isInDepartment) {
            throw new Error('error-user-not-belong-to-department');
        }
        const { username } = user;
        agent = { agentId, username };
    }
    const department = yield models_1.LivechatDepartment.findOneById(departmentId, {
        projection: {
            allowReceiveForwardOffline: 1,
            fallbackForwardDepartment: 1,
            name: 1,
        },
    });
    if (!((_a = RoutingManager_1.RoutingManager.getConfig()) === null || _a === void 0 ? void 0 : _a.autoAssignAgent) ||
        !(yield core_services_1.Omnichannel.isWithinMACLimit(room)) ||
        ((department === null || department === void 0 ? void 0 : department.allowReceiveForwardOffline) && !(yield LivechatTyped_1.Livechat.checkOnlineAgents(departmentId)))) {
        logger.debug(`Room ${room._id} will be on department queue`);
        yield LivechatTyped_1.Livechat.saveTransferHistory(room, transferData);
        return RoutingManager_1.RoutingManager.unassignAgent(inquiry, departmentId, true);
    }
    // Fake the department to forward the inquiry - Case the forward process does not success
    // the inquiry will stay in the same original department
    inquiry.department = departmentId;
    const roomTaken = yield RoutingManager_1.RoutingManager.delegateInquiry(inquiry, agent, Object.assign({ forwardingToDepartment: { oldDepartmentId } }, (clientAction && { clientAction })), room);
    if (!roomTaken) {
        logger.debug(`Cannot forward room ${room._id}. Unable to delegate inquiry`);
        return false;
    }
    const { servedBy, chatQueued } = roomTaken;
    if (!chatQueued && oldServedBy && servedBy && oldServedBy._id === servedBy._id) {
        if (!((_b = department === null || department === void 0 ? void 0 : department.fallbackForwardDepartment) === null || _b === void 0 ? void 0 : _b.length)) {
            logger.debug(`Cannot forward room ${room._id}. Chat assigned to agent ${servedBy._id} (Previous was ${oldServedBy._id})`);
            throw new Error('error-no-agents-online-in-department');
        }
        if (!transferData.originalDepartmentName) {
            transferData.originalDepartmentName = department.name;
        }
        // if a chat has a fallback department, attempt to redirect chat to there [EE]
        const transferSuccess = !!(yield callbacks_1.callbacks.run('livechat:onTransferFailure', room, { guest, transferData, department }));
        // On CE theres no callback so it will return the room
        if (typeof transferSuccess !== 'boolean' || !transferSuccess) {
            logger.debug(`Cannot forward room ${room._id}. Unable to delegate inquiry`);
            return false;
        }
        return true;
    }
    // Send just 1 message to the room to inform the user that the chat was transferred
    if (transferData.usingFallbackDep) {
        const { _id, username } = transferData.transferredBy;
        yield core_services_1.Message.saveSystemMessage('livechat_transfer_history_fallback', room._id, '', { _id, username }, Object.assign(Object.assign({}, (transferData.transferredBy.userType === 'visitor' && { token: room.v.token })), { transferData: Object.assign(Object.assign({}, transferData), { prevDepartment: transferData.originalDepartmentName }) }));
    }
    yield LivechatTyped_1.Livechat.saveTransferHistory(room, transferData);
    if (oldServedBy) {
        // if chat is queued then we don't ignore the new servedBy agent bcs at this
        // point the chat is not assigned to him/her and it is still in the queue
        yield RoutingManager_1.RoutingManager.removeAllRoomSubscriptions(room, !chatQueued ? servedBy : undefined);
    }
    yield (0, exports.updateChatDepartment)({ rid, newDepartmentId: departmentId, oldDepartmentId });
    if (chatQueued) {
        logger.debug(`Forwarding succesful. Marking inquiry ${inquiry._id} as ready`);
        yield models_1.LivechatInquiry.readyInquiry(inquiry._id);
        yield models_1.LivechatRooms.removeAgentByRoomId(rid);
        yield (0, exports.dispatchAgentDelegated)(rid);
        const newInquiry = yield models_1.LivechatInquiry.findOneById(inquiry._id);
        if (!newInquiry) {
            logger.debug(`Inquiry ${inquiry._id} not found`);
            throw new Error('error-invalid-inquiry');
        }
        yield (0, QueueManager_1.queueInquiry)(newInquiry);
        logger.debug(`Inquiry ${inquiry._id} queued succesfully`);
    }
    return true;
});
exports.forwardRoomToDepartment = forwardRoomToDepartment;
const normalizeTransferredByData = (transferredBy, room) => {
    if (!transferredBy || !room) {
        throw new Error('You must provide "transferredBy" and "room" params to "getTransferredByData"');
    }
    const { servedBy: { _id: agentId } = {} } = room;
    const { _id, username, name, userType: transferType } = transferredBy;
    const userType = transferType || (_id === agentId ? 'agent' : 'user');
    return Object.assign(Object.assign({ _id,
        username }, (name && { name })), { userType });
};
exports.normalizeTransferredByData = normalizeTransferredByData;
const parseFromIntOrStr = (value) => {
    if (typeof value === 'number') {
        return value;
    }
    return parseInt(value);
};
const updateDepartmentAgents = (departmentId, agents, departmentEnabled) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_2, _b, _c;
    (0, check_1.check)(departmentId, String);
    (0, check_1.check)(agents, {
        upsert: check_1.Match.Maybe([
            check_1.Match.ObjectIncluding({
                agentId: String,
                username: check_1.Match.Maybe(String),
                count: check_1.Match.Maybe(check_1.Match.Integer),
                order: check_1.Match.Maybe(check_1.Match.Integer),
            }),
        ]),
        remove: check_1.Match.Maybe([
            check_1.Match.ObjectIncluding({
                agentId: String,
                username: check_1.Match.Maybe(String),
                count: check_1.Match.Maybe(check_1.Match.Integer),
                order: check_1.Match.Maybe(check_1.Match.Integer),
            }),
        ]),
    });
    const { upsert = [], remove = [] } = agents;
    const agentsUpdated = [];
    const agentsRemoved = remove.map(({ agentId }) => agentId);
    const agentsAdded = [];
    if (agentsRemoved.length > 0) {
        const removedIds = yield models_1.LivechatDepartmentAgents.findByAgentsAndDepartmentId(agentsRemoved, departmentId, {
            projection: { agentId: 1 },
        }).toArray();
        const { deletedCount } = yield models_1.LivechatDepartmentAgents.removeByIds(removedIds.map(({ _id }) => _id));
        if (deletedCount > 0) {
            removedIds.forEach(({ _id, agentId }) => {
                void (0, notifyListener_1.notifyOnLivechatDepartmentAgentChanged)({
                    _id,
                    agentId,
                    departmentId,
                }, 'removed');
            });
        }
        callbacks_1.callbacks.runAsync('livechat.removeAgentDepartment', { departmentId, agentsId: agentsRemoved });
    }
    try {
        for (var _d = true, upsert_1 = __asyncValues(upsert), upsert_1_1; upsert_1_1 = yield upsert_1.next(), _a = upsert_1_1.done, !_a; _d = true) {
            _c = upsert_1_1.value;
            _d = false;
            const agent = _c;
            const agentFromDb = yield models_1.Users.findOneById(agent.agentId, { projection: { _id: 1, username: 1 } });
            if (!agentFromDb) {
                continue;
            }
            const livechatDepartmentAgent = yield models_1.LivechatDepartmentAgents.saveAgent({
                agentId: agent.agentId,
                departmentId,
                username: agentFromDb.username || '',
                count: agent.count ? parseFromIntOrStr(agent.count) : 0,
                order: agent.order ? parseFromIntOrStr(agent.order) : 0,
                departmentEnabled,
            });
            if (livechatDepartmentAgent.upsertedId) {
                void (0, notifyListener_1.notifyOnLivechatDepartmentAgentChanged)({
                    _id: livechatDepartmentAgent.upsertedId,
                    agentId: agent.agentId,
                    departmentId,
                }, 'inserted');
            }
            else {
                agentsUpdated.push(agent.agentId);
            }
            agentsAdded.push(agent.agentId);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = upsert_1.return)) yield _b.call(upsert_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    if (agentsAdded.length > 0) {
        callbacks_1.callbacks.runAsync('livechat.saveAgentDepartment', {
            departmentId,
            agentsId: agentsAdded,
        });
    }
    if (agentsUpdated.length > 0) {
        void (0, notifyListener_1.notifyOnLivechatDepartmentAgentChangedByAgentsAndDepartmentId)(agentsUpdated, departmentId);
    }
    if (agentsRemoved.length > 0 || agentsAdded.length > 0) {
        const numAgents = yield models_1.LivechatDepartmentAgents.countByDepartmentId(departmentId);
        yield models_1.LivechatDepartment.updateNumAgentsById(departmentId, numAgents);
    }
    return true;
});
exports.updateDepartmentAgents = updateDepartmentAgents;
const validateEmail = (email) => {
    if (!(0, emailValidator_1.validateEmail)(email)) {
        throw new meteor_1.Meteor.Error('error-invalid-email', `Invalid email ${email}`, {
            function: 'Livechat.validateEmail',
            email,
        });
    }
    return true;
};
exports.validateEmail = validateEmail;
