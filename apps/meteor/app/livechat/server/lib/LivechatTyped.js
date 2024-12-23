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
exports.Livechat = void 0;
const apps_1 = require("@rocket.chat/apps");
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const callbacks_1 = require("../../../../lib/callbacks");
const stringUtils_1 = require("../../../../lib/utils/stringUtils");
const utils_1 = require("../../../../server/database/utils");
const i18n_1 = require("../../../../server/lib/i18n");
const addUserRoles_1 = require("../../../../server/lib/roles/addUserRoles");
const removeUserFromRoles_1 = require("../../../../server/lib/roles/removeUserFromRoles");
const server_1 = require("../../../authorization/server");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const hasRole_1 = require("../../../authorization/server/functions/hasRole");
const server_2 = require("../../../file-upload/server");
const deleteMessage_1 = require("../../../lib/server/functions/deleteMessage");
const sendMessage_1 = require("../../../lib/server/functions/sendMessage");
const updateMessage_1 = require("../../../lib/server/functions/updateMessage");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_3 = require("../../../metrics/server");
const server_4 = require("../../../settings/server");
const business_hour_1 = require("../business-hour");
const Helper_1 = require("./Helper");
const QueueManager_1 = require("./QueueManager");
const RoutingManager_1 = require("./RoutingManager");
const Visitors_1 = require("./Visitors");
const registerGuestData_1 = require("./contacts/registerGuestData");
const departmentsLib_1 = require("./departmentsLib");
const parseTranscriptRequest_1 = require("./parseTranscriptRequest");
const isRoomClosedByUserParams = (params) => params.user !== undefined;
const isRoomClosedByVisitorParams = (params) => params.visitor !== undefined;
class LivechatClass {
    constructor() {
        this.logger = new logger_1.Logger('Livechat');
        this.webhookLogger = this.logger.section('Webhook');
    }
    online(department_1) {
        return __awaiter(this, arguments, void 0, function* (department, skipNoAgentSetting = false, skipFallbackCheck = false) {
            exports.Livechat.logger.debug(`Checking online agents ${department ? `for department ${department}` : ''}`);
            if (!skipNoAgentSetting && server_4.settings.get('Livechat_accept_chats_with_no_agents')) {
                exports.Livechat.logger.debug('Can accept without online agents: true');
                return true;
            }
            if (server_4.settings.get('Livechat_assign_new_conversation_to_bot')) {
                exports.Livechat.logger.debug(`Fetching online bot agents for department ${department}`);
                const botAgents = yield exports.Livechat.getBotAgents(department);
                if (botAgents) {
                    const onlineBots = yield exports.Livechat.countBotAgents(department);
                    this.logger.debug(`Found ${onlineBots} online`);
                    if (onlineBots > 0) {
                        return true;
                    }
                }
            }
            const agentsOnline = yield this.checkOnlineAgents(department, undefined, skipFallbackCheck);
            exports.Livechat.logger.debug(`Are online agents ${department ? `for department ${department}` : ''}?: ${agentsOnline}`);
            return agentsOnline;
        });
    }
    closeRoom(params_1) {
        return __awaiter(this, arguments, void 0, function* (params, attempts = 2) {
            let newRoom;
            let chatCloser;
            let removedInquiryObj;
            const session = utils_1.client.startSession();
            try {
                session.startTransaction();
                const { room, closedBy, removedInquiry } = yield this.doCloseRoom(params, session);
                yield session.commitTransaction();
                newRoom = room;
                chatCloser = closedBy;
                removedInquiryObj = removedInquiry;
            }
            catch (e) {
                this.logger.error({ err: e, msg: 'Failed to close room', afterAttempts: attempts });
                yield session.abortTransaction();
                // Dont propagate transaction errors
                if ((0, utils_1.shouldRetryTransaction)(e)) {
                    if (attempts > 0) {
                        this.logger.debug(`Retrying close room because of transient error. Attempts left: ${attempts}`);
                        return this.closeRoom(params, attempts - 1);
                    }
                    throw new Error('error-room-cannot-be-closed-try-again');
                }
                throw e;
            }
            finally {
                yield session.endSession();
            }
            // Note: when reaching this point, the room has been closed
            // Transaction is commited and so these messages can be sent here.
            return this.afterRoomClosed(newRoom, chatCloser, removedInquiryObj, params);
        });
    }
    afterRoomClosed(newRoom, chatCloser, inquiry, params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!chatCloser) {
                // this should never happen
                return;
            }
            // Note: we are okay with these messages being sent outside of the transaction. The process of sending a message
            // is huge and involves multiple db calls. Making it transactionable this way would be really hard.
            // And passing just _some_ actions to the transaction creates some deadlocks since messages are updated in the afterSaveMessages callbacks.
            const transcriptRequested = !!params.room.transcriptRequest || (!server_4.settings.get('Livechat_enable_transcript') && server_4.settings.get('Livechat_transcript_send_always'));
            this.logger.debug(`Sending closing message to room ${newRoom._id}`);
            yield core_services_1.Message.saveSystemMessageAndNotifyUser('livechat-close', newRoom._id, (_a = params.comment) !== null && _a !== void 0 ? _a : '', chatCloser, Object.assign({ groupable: false, transcriptRequested }, (isRoomClosedByVisitorParams(params) && { token: params.visitor.token })));
            if (server_4.settings.get('Livechat_enable_transcript') && !server_4.settings.get('Livechat_transcript_send_always')) {
                yield core_services_1.Message.saveSystemMessage('command', newRoom._id, 'promptTranscript', chatCloser);
            }
            this.logger.debug(`Running callbacks for room ${newRoom._id}`);
            process.nextTick(() => {
                var _a, _b, _c, _d;
                /**
                 * @deprecated the `AppEvents.ILivechatRoomClosedHandler` event will be removed
                 * in the next major version of the Apps-Engine
                 */
                void ((_b = (_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.getBridges()) === null || _b === void 0 ? void 0 : _b.getListenerBridge().livechatEvent(apps_1.AppEvents.ILivechatRoomClosedHandler, newRoom));
                void ((_d = (_c = apps_1.Apps.self) === null || _c === void 0 ? void 0 : _c.getBridges()) === null || _d === void 0 ? void 0 : _d.getListenerBridge().livechatEvent(apps_1.AppEvents.IPostLivechatRoomClosed, newRoom));
            });
            const visitor = isRoomClosedByVisitorParams(params) ? params.visitor : undefined;
            const opts = yield (0, parseTranscriptRequest_1.parseTranscriptRequest)(params.room, params.options, visitor);
            if (process.env.TEST_MODE) {
                yield callbacks_1.callbacks.run('livechat.closeRoom', {
                    room: newRoom,
                    options: opts,
                });
            }
            else {
                callbacks_1.callbacks.runAsync('livechat.closeRoom', {
                    room: newRoom,
                    options: opts,
                });
            }
            void (0, notifyListener_1.notifyOnRoomChangedById)(newRoom._id);
            if (inquiry) {
                void (0, notifyListener_1.notifyOnLivechatInquiryChanged)(inquiry, 'removed');
            }
            this.logger.debug(`Room ${newRoom._id} was closed`);
        });
    }
    doCloseRoom(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { comment } = params;
            const { room } = params;
            this.logger.debug(`Attempting to close room ${room._id}`);
            if (!room || !(0, core_typings_1.isOmnichannelRoom)(room) || !room.open) {
                this.logger.debug(`Room ${room._id} is not open`);
                throw new Error('error-room-closed');
            }
            const commentRequired = server_4.settings.get('Livechat_request_comment_when_closing_conversation');
            if (commentRequired && !(comment === null || comment === void 0 ? void 0 : comment.trim())) {
                throw new Error('error-comment-is-required');
            }
            const { updatedOptions: options } = yield this.resolveChatTags(room, params.options);
            this.logger.debug(`Resolved chat tags for room ${room._id}`);
            const now = new Date();
            const { _id: rid, servedBy } = room;
            const serviceTimeDuration = servedBy && (now.getTime() - new Date(servedBy.ts).getTime()) / 1000;
            const closeData = Object.assign(Object.assign({ closedAt: now, chatDuration: (now.getTime() - new Date(room.ts).getTime()) / 1000 }, (serviceTimeDuration && { serviceTimeDuration })), options);
            this.logger.debug(`Room ${room._id} was closed at ${closeData.closedAt} (duration ${closeData.chatDuration})`);
            if (isRoomClosedByUserParams(params)) {
                const { user } = params;
                this.logger.debug(`Closing by user ${user === null || user === void 0 ? void 0 : user._id}`);
                closeData.closer = 'user';
                closeData.closedBy = {
                    _id: (user === null || user === void 0 ? void 0 : user._id) || '',
                    username: user === null || user === void 0 ? void 0 : user.username,
                };
            }
            else if (isRoomClosedByVisitorParams(params)) {
                const { visitor } = params;
                this.logger.debug(`Closing by visitor ${params.visitor._id}`);
                closeData.closer = 'visitor';
                closeData.closedBy = {
                    _id: visitor._id,
                    username: visitor.username,
                };
            }
            else {
                throw new Error('Error: Please provide details of the user or visitor who closed the room');
            }
            this.logger.debug(`Updating DB for room ${room._id} with close data`);
            const inquiry = yield models_1.LivechatInquiry.findOneByRoomId(rid, { session });
            const removedInquiry = yield models_1.LivechatInquiry.removeByRoomId(rid, { session });
            if (removedInquiry && removedInquiry.deletedCount !== 1) {
                throw new Error('Error removing inquiry');
            }
            const updatedRoom = yield models_1.LivechatRooms.closeRoomById(rid, closeData, { session });
            if (!updatedRoom || updatedRoom.modifiedCount !== 1) {
                throw new Error('Error closing room');
            }
            const subs = yield models_1.Subscriptions.countByRoomId(rid, { session });
            const removedSubs = yield models_1.Subscriptions.removeByRoomId(rid, {
                onTrash(doc) {
                    return __awaiter(this, void 0, void 0, function* () {
                        void (0, notifyListener_1.notifyOnSubscriptionChanged)(doc, 'removed');
                    });
                },
                session,
            });
            if (removedSubs.deletedCount !== subs) {
                throw new Error('Error removing subscriptions');
            }
            this.logger.debug(`DB updated for room ${room._id}`);
            // Retrieve the closed room
            const newRoom = yield models_1.LivechatRooms.findOneById(rid, { session });
            if (!newRoom) {
                throw new Error('Error: Room not found');
            }
            return { room: newRoom, closedBy: closeData.closedBy, removedInquiry: inquiry };
        });
    }
    makeVisitorAssociation(visitorId, roomInfo) {
        return {
            visitorId,
            source: {
                type: roomInfo.type,
                id: roomInfo.id,
            },
        };
    }
    createRoom(_a) {
        return __awaiter(this, arguments, void 0, function* ({ visitor, message, rid, roomInfo, agent, extraData, }) {
            if (!server_4.settings.get('Livechat_enabled')) {
                throw new meteor_1.Meteor.Error('error-omnichannel-is-disabled');
            }
            if (yield models_1.LivechatContacts.isChannelBlocked(this.makeVisitorAssociation(visitor._id, roomInfo.source))) {
                throw new Error('error-contact-channel-blocked');
            }
            const defaultAgent = yield callbacks_1.callbacks.run('livechat.checkDefaultAgentOnNewRoom', agent, visitor);
            // if no department selected verify if there is at least one active and pick the first
            if (!defaultAgent && !visitor.department) {
                const department = yield (0, departmentsLib_1.getRequiredDepartment)();
                exports.Livechat.logger.debug(`No department or default agent selected for ${visitor._id}`);
                if (department) {
                    exports.Livechat.logger.debug(`Assigning ${visitor._id} to department ${department._id}`);
                    visitor.department = department._id;
                }
            }
            // delegate room creation to QueueManager
            exports.Livechat.logger.debug(`Calling QueueManager to request a room for visitor ${visitor._id}`);
            const room = yield QueueManager_1.QueueManager.requestRoom({
                guest: visitor,
                message,
                rid,
                roomInfo,
                agent: defaultAgent,
                extraData,
            });
            exports.Livechat.logger.debug(`Room obtained for visitor ${visitor._id} -> ${room._id}`);
            yield models_1.Messages.setRoomIdByToken(visitor.token, room._id);
            return room;
        });
    }
    getRoom(guest, message, roomInfo, agent, extraData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!server_4.settings.get('Livechat_enabled')) {
                throw new meteor_1.Meteor.Error('error-omnichannel-is-disabled');
            }
            exports.Livechat.logger.debug(`Attempting to find or create a room for visitor ${guest._id}`);
            const room = yield models_1.LivechatRooms.findOneById(message.rid);
            if ((room === null || room === void 0 ? void 0 : room.v._id) && (yield models_1.LivechatContacts.isChannelBlocked(this.makeVisitorAssociation(room.v._id, room.source)))) {
                throw new Error('error-contact-channel-blocked');
            }
            if (room && !room.open) {
                exports.Livechat.logger.debug(`Last room for visitor ${guest._id} closed. Creating new one`);
            }
            if (!(room === null || room === void 0 ? void 0 : room.open)) {
                return {
                    room: yield this.createRoom({ visitor: guest, message: message.msg, roomInfo, agent, extraData }),
                    newRoom: true,
                };
            }
            if (room.v.token !== guest.token) {
                exports.Livechat.logger.debug(`Visitor ${guest._id} trying to access another visitor's room`);
                throw new meteor_1.Meteor.Error('cannot-access-room');
            }
            return { room, newRoom: false };
        });
    }
    checkOnlineAgents(department_1, agent_1) {
        return __awaiter(this, arguments, void 0, function* (department, agent, skipFallbackCheck = false) {
            if (agent === null || agent === void 0 ? void 0 : agent.agentId) {
                return models_1.Users.checkOnlineAgents(agent.agentId);
            }
            if (department) {
                const onlineForDep = yield models_1.LivechatDepartmentAgents.checkOnlineForDepartment(department);
                if (onlineForDep || skipFallbackCheck) {
                    return onlineForDep;
                }
                const dep = yield models_1.LivechatDepartment.findOneById(department, {
                    projection: { fallbackForwardDepartment: 1 },
                });
                if (!(dep === null || dep === void 0 ? void 0 : dep.fallbackForwardDepartment)) {
                    return onlineForDep;
                }
                return this.checkOnlineAgents(dep === null || dep === void 0 ? void 0 : dep.fallbackForwardDepartment);
            }
            return models_1.Users.checkOnlineAgents();
        });
    }
    removeRoom(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            exports.Livechat.logger.debug(`Deleting room ${rid}`);
            (0, check_1.check)(rid, String);
            const room = yield models_1.LivechatRooms.findOneById(rid);
            if (!room) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room');
            }
            const inquiry = yield models_1.LivechatInquiry.findOneByRoomId(rid);
            const result = yield Promise.allSettled([
                models_1.Messages.removeByRoomId(rid),
                models_1.ReadReceipts.removeByRoomId(rid),
                models_1.Subscriptions.removeByRoomId(rid, {
                    onTrash(doc) {
                        return __awaiter(this, void 0, void 0, function* () {
                            void (0, notifyListener_1.notifyOnSubscriptionChanged)(doc, 'removed');
                        });
                    },
                }),
                models_1.LivechatInquiry.removeByRoomId(rid),
                models_1.LivechatRooms.removeById(rid),
            ]);
            if (((_a = result[3]) === null || _a === void 0 ? void 0 : _a.status) === 'fulfilled' && ((_b = result[3].value) === null || _b === void 0 ? void 0 : _b.deletedCount) && inquiry) {
                void (0, notifyListener_1.notifyOnLivechatInquiryChanged)(inquiry, 'removed');
            }
            for (const r of result) {
                if (r.status === 'rejected') {
                    this.logger.error(`Error removing room ${rid}: ${r.reason}`);
                    throw new meteor_1.Meteor.Error('error-removing-room', 'Error removing room');
                }
            }
        });
    }
    registerGuest(newData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Visitors_1.Visitors.registerGuest(newData);
            if (result) {
                yield (0, registerGuestData_1.registerGuestData)(newData, result);
            }
            return result;
        });
    }
    getBotAgents(department) {
        return __awaiter(this, void 0, void 0, function* () {
            if (department) {
                return models_1.LivechatDepartmentAgents.getBotsForDepartment(department);
            }
            return models_1.Users.findBotAgents();
        });
    }
    countBotAgents(department) {
        return __awaiter(this, void 0, void 0, function* () {
            if (department) {
                return models_1.LivechatDepartmentAgents.countBotsForDepartment(department);
            }
            return models_1.Users.countBotAgents();
        });
    }
    resolveChatTags(room_1) {
        return __awaiter(this, arguments, void 0, function* (room, options = {}) {
            this.logger.debug(`Resolving chat tags for room ${room._id}`);
            const concatUnique = (...arrays) => [
                ...new Set([].concat(...arrays.filter((a) => !!a))),
            ];
            const { departmentId, tags: optionsTags } = room;
            const { clientAction, tags: oldRoomTags } = options;
            const roomTags = concatUnique(oldRoomTags, optionsTags);
            if (!departmentId) {
                return {
                    updatedOptions: Object.assign(Object.assign({}, options), (roomTags.length && { tags: roomTags })),
                };
            }
            const department = yield models_1.LivechatDepartment.findOneById(departmentId, {
                projection: { requestTagBeforeClosingChat: 1, chatClosingTags: 1 },
            });
            if (!department) {
                return {
                    updatedOptions: Object.assign(Object.assign({}, options), (roomTags.length && { tags: roomTags })),
                };
            }
            const { requestTagBeforeClosingChat, chatClosingTags } = department;
            const extraRoomTags = concatUnique(roomTags, chatClosingTags);
            if (!requestTagBeforeClosingChat) {
                return {
                    updatedOptions: Object.assign(Object.assign({}, options), (extraRoomTags.length && { tags: extraRoomTags })),
                };
            }
            const checkRoomTags = !clientAction || (roomTags && roomTags.length > 0);
            const checkDepartmentTags = chatClosingTags && chatClosingTags.length > 0;
            if (!checkRoomTags || !checkDepartmentTags) {
                throw new Error('error-tags-must-be-assigned-before-closing-chat');
            }
            return {
                updatedOptions: Object.assign(Object.assign({}, options), (extraRoomTags.length && { tags: extraRoomTags })),
            };
        });
    }
    sendRequest(postData_1) {
        return __awaiter(this, arguments, void 0, function* (postData, attempts = 10) {
            if (!attempts) {
                exports.Livechat.logger.error({ msg: 'Omnichannel webhook call failed. Max attempts reached' });
                return;
            }
            const timeout = server_4.settings.get('Livechat_http_timeout');
            const secretToken = server_4.settings.get('Livechat_secret_token');
            const webhookUrl = server_4.settings.get('Livechat_webhookUrl');
            try {
                exports.Livechat.webhookLogger.debug({ msg: 'Sending webhook request', postData });
                const result = yield (0, server_fetch_1.serverFetch)(webhookUrl, {
                    method: 'POST',
                    headers: Object.assign({}, (secretToken && { 'X-RocketChat-Livechat-Token': secretToken })),
                    body: postData,
                    timeout,
                });
                if (result.status === 200) {
                    server_3.metrics.totalLivechatWebhooksSuccess.inc();
                    return result;
                }
                server_3.metrics.totalLivechatWebhooksFailures.inc();
                throw new Error(yield result.text());
            }
            catch (err) {
                const retryAfter = timeout * 4;
                exports.Livechat.webhookLogger.error({ msg: `Error response on ${11 - attempts} try ->`, err });
                // try 10 times after 20 seconds each
                attempts - 1 &&
                    exports.Livechat.webhookLogger.warn({ msg: `Webhook call failed. Retrying`, newAttemptAfterSeconds: retryAfter / 1000, webhookUrl });
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield exports.Livechat.sendRequest(postData, attempts - 1);
                }), retryAfter);
            }
        });
    }
    saveAgentInfo(_id, agentData, agentDepartments) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(_id, String);
            (0, check_1.check)(agentData, Object);
            (0, check_1.check)(agentDepartments, [String]);
            const user = yield models_1.Users.findOneById(_id);
            if (!user || !(yield (0, hasRole_1.hasRoleAsync)(_id, 'livechat-agent'))) {
                throw new meteor_1.Meteor.Error('error-user-is-not-agent', 'User is not a livechat agent');
            }
            yield models_1.Users.setLivechatData(_id, agentData);
            const currentDepartmentsForAgent = yield models_1.LivechatDepartmentAgents.findByAgentId(_id).toArray();
            const toRemoveIds = currentDepartmentsForAgent
                .filter((dept) => !agentDepartments.includes(dept.departmentId))
                .map((dept) => dept.departmentId);
            const toAddIds = agentDepartments.filter((d) => !currentDepartmentsForAgent.some((c) => c.departmentId === d));
            yield Promise.all(yield models_1.LivechatDepartment.findInIds([...toRemoveIds, ...toAddIds], {
                projection: {
                    _id: 1,
                    enabled: 1,
                },
            })
                .map((dep) => {
                return (0, Helper_1.updateDepartmentAgents)(dep._id, Object.assign({}, (toRemoveIds.includes(dep._id) ? { remove: [{ agentId: _id }] } : { upsert: [{ agentId: _id, count: 0, order: 0 }] })), dep.enabled);
            })
                .toArray());
            return true;
        });
    }
    updateCallStatus(callId, rid, status, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Rooms.setCallStatus(rid, status);
            if (status === 'ended' || status === 'declined') {
                if (yield core_services_1.VideoConf.declineLivechatCall(callId)) {
                    return;
                }
                return (0, updateMessage_1.updateMessage)({ _id: callId, msg: status, actionLinks: [], webRtcCallEndTs: new Date(), rid }, user);
            }
        });
    }
    notifyRoomVisitorChange(roomId, visitor) {
        void core_services_1.api.broadcast('omnichannel.room', roomId, {
            type: 'visitorData',
            visitor,
        });
    }
    changeRoomVisitor(userId, room, visitor) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Users.findOneById(userId, { projection: { _id: 1 } });
            if (!user) {
                throw new Error('error-user-not-found');
            }
            if (!(yield (0, server_1.canAccessRoomAsync)(room, user))) {
                throw new Error('error-not-allowed');
            }
            yield models_1.LivechatRooms.changeVisitorByRoomId(room._id, visitor);
            this.notifyRoomVisitorChange(room._id, visitor);
            return models_1.LivechatRooms.findOneById(room._id);
        });
    }
    notifyAgentStatusChanged(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!status) {
                return;
            }
            void callbacks_1.callbacks.runAsync('livechat.agentStatusChanged', { userId, status });
            if (!server_4.settings.get('Livechat_show_agent_info')) {
                return;
            }
            yield models_1.LivechatRooms.findOpenByAgent(userId).forEach((room) => {
                void core_services_1.api.broadcast('omnichannel.room', room._id, {
                    type: 'agentStatus',
                    status,
                });
            });
        });
    }
    updateMessage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ guest, message }) {
            (0, check_1.check)(message, check_1.Match.ObjectIncluding({ _id: String }));
            const originalMessage = yield models_1.Messages.findOneById(message._id, { projection: { u: 1 } });
            if (!(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage._id)) {
                return;
            }
            const editAllowed = server_4.settings.get('Message_AllowEditing');
            const editOwn = originalMessage.u && originalMessage.u._id === guest._id;
            if (!editAllowed || !editOwn) {
                throw new Error('error-action-not-allowed');
            }
            // TODO: Apps sends an `any` object and apparently we just check for _id being present
            // while updateMessage expects AtLeast<id, msg, rid>
            yield (0, updateMessage_1.updateMessage)(message, guest);
            return true;
        });
    }
    closeOpenChats(userId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug(`Closing open chats for user ${userId}`);
            const user = yield models_1.Users.findOneById(userId);
            const extraQuery = yield callbacks_1.callbacks.run('livechat.applyDepartmentRestrictions', {}, { userId });
            const openChats = models_1.LivechatRooms.findOpenByAgent(userId, extraQuery);
            const promises = [];
            yield openChats.forEach((room) => {
                promises.push(this.closeRoom({ user, room, comment }));
            });
            yield Promise.all(promises);
        });
    }
    transfer(room, guest, transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.logger.debug(`Transfering room ${room._id} [Transfered by: ${(_a = transferData === null || transferData === void 0 ? void 0 : transferData.transferredBy) === null || _a === void 0 ? void 0 : _a._id}]`);
            if (room.onHold) {
                throw new Error('error-room-onHold');
            }
            if (transferData.departmentId) {
                const department = yield models_1.LivechatDepartment.findOneById(transferData.departmentId, {
                    projection: { name: 1 },
                });
                if (!department) {
                    throw new Error('error-invalid-department');
                }
                transferData.department = department;
                this.logger.debug(`Transfering room ${room._id} to department ${(_b = transferData.department) === null || _b === void 0 ? void 0 : _b._id}`);
            }
            return RoutingManager_1.RoutingManager.transferRoom(room, guest, transferData);
        });
    }
    forwardOpenChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            this.logger.debug(`Transferring open chats for user ${userId}`);
            const user = yield models_1.Users.findOneById(userId);
            if (!user) {
                throw new Error('error-invalid-user');
            }
            const { _id, username, name } = user;
            try {
                for (var _d = true, _e = __asyncValues(models_1.LivechatRooms.findOpenByAgent(userId)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const room = _c;
                    const guest = yield models_1.LivechatVisitors.findOneEnabledById(room.v._id);
                    if (!guest) {
                        continue;
                    }
                    const transferredBy = (0, Helper_1.normalizeTransferredByData)({ _id, username, name }, room);
                    yield this.transfer(room, guest, {
                        transferredBy,
                        departmentId: guest.department,
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    showConnecting() {
        var _a;
        return ((_a = RoutingManager_1.RoutingManager.getConfig()) === null || _a === void 0 ? void 0 : _a.showConnecting) || false;
    }
    getInitSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const validSettings = [
                'Livechat_title',
                'Livechat_title_color',
                'Livechat_enable_message_character_limit',
                'Livechat_message_character_limit',
                'Message_MaxAllowedSize',
                'Livechat_enabled',
                'Livechat_registration_form',
                'Livechat_allow_switching_departments',
                'Livechat_offline_title',
                'Livechat_offline_title_color',
                'Livechat_offline_message',
                'Livechat_offline_success_message',
                'Livechat_offline_form_unavailable',
                'Livechat_display_offline_form',
                'Omnichannel_call_provider',
                'Language',
                'Livechat_enable_transcript',
                'Livechat_transcript_message',
                'Livechat_fileupload_enabled',
                'FileUpload_Enabled',
                'Livechat_conversation_finished_message',
                'Livechat_conversation_finished_text',
                'Livechat_name_field_registration_form',
                'Livechat_email_field_registration_form',
                'Livechat_registration_form_message',
                'Livechat_force_accept_data_processing_consent',
                'Livechat_data_processing_consent_text',
                'Livechat_show_agent_info',
                'Livechat_clear_local_storage_when_chat_ended',
                'Livechat_history_monitor_type',
                'Livechat_hide_system_messages',
                'Livechat_widget_position',
                'Livechat_background',
                'Assets_livechat_widget_logo',
                'Livechat_hide_watermark',
                'Omnichannel_allow_visitors_to_close_conversation',
            ];
            const rcSettings = validSettings.reduce((acc, setting) => {
                acc[setting] = server_4.settings.get(setting);
                return acc;
            }, {});
            rcSettings.Livechat_Show_Connecting = this.showConnecting();
            return rcSettings;
        });
    }
    sendMessage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ guest, message, roomInfo, agent, }) {
            const { room, newRoom } = yield this.getRoom(guest, message, roomInfo, agent);
            if (guest.name) {
                message.alias = guest.name;
            }
            return Object.assign(yield (0, sendMessage_1.sendMessage)(guest, Object.assign(Object.assign({}, message), { token: guest.token }), room), {
                newRoom,
                showConnecting: this.showConnecting(),
            });
        });
    }
    removeGuest(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const guest = yield models_1.LivechatVisitors.findOneEnabledById(_id, { projection: { _id: 1, token: 1 } });
            if (!guest) {
                throw new Error('error-invalid-guest');
            }
            yield this.cleanGuestHistory(guest);
            return models_1.LivechatVisitors.disableById(_id);
        });
    }
    cleanGuestHistory(guest) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_2, _b, _c;
            const { token } = guest;
            // This shouldn't be possible, but just in case
            if (!token) {
                throw new Error('error-invalid-guest');
            }
            const cursor = models_1.LivechatRooms.findByVisitorToken(token);
            try {
                for (var _d = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _a = cursor_1_1.done, !_a; _d = true) {
                    _c = cursor_1_1.value;
                    _d = false;
                    const room = _c;
                    yield Promise.all([
                        models_1.Subscriptions.removeByRoomId(room._id, {
                            onTrash(doc) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    void (0, notifyListener_1.notifyOnSubscriptionChanged)(doc, 'removed');
                                });
                            },
                        }),
                        server_2.FileUpload.removeFilesByRoomId(room._id),
                        models_1.Messages.removeByRoomId(room._id),
                        models_1.ReadReceipts.removeByRoomId(room._id),
                    ]);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = cursor_1.return)) yield _b.call(cursor_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            yield models_1.LivechatRooms.removeByVisitorToken(token);
            const livechatInquiries = yield models_1.LivechatInquiry.findIdsByVisitorToken(token).toArray();
            yield models_1.LivechatInquiry.removeByIds(livechatInquiries.map(({ _id }) => _id));
            void (0, notifyListener_1.notifyOnLivechatInquiryChanged)(livechatInquiries, 'removed');
        });
    }
    deleteMessage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ guest, message }) {
            const deleteAllowed = server_4.settings.get('Message_AllowDeleting');
            const editOwn = message.u && message.u._id === guest._id;
            if (!deleteAllowed || !editOwn) {
                throw new Error('error-action-not-allowed');
            }
            yield (0, deleteMessage_1.deleteMessage)(message, guest);
            return true;
        });
    }
    setUserStatusLivechatIf(userId, status, condition, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield models_1.Users.setLivechatStatusIf(userId, status, condition, fields);
            if (result.modifiedCount > 0) {
                void (0, notifyListener_1.notifyOnUserChange)({
                    id: userId,
                    clientAction: 'updated',
                    diff: Object.assign(Object.assign({}, fields), { statusLivechat: status }),
                });
            }
            callbacks_1.callbacks.runAsync('livechat.setUserStatusLivechat', { userId, status });
            return result;
        });
    }
    returnRoomAsInquiry(room_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (room, departmentId, overrideTransferData = {}) {
            this.logger.debug({ msg: `Transfering room to ${departmentId ? 'department' : ''} queue`, room });
            if (!room.open) {
                throw new meteor_1.Meteor.Error('room-closed');
            }
            if (room.onHold) {
                throw new meteor_1.Meteor.Error('error-room-onHold');
            }
            if (!room.servedBy) {
                return false;
            }
            const user = yield models_1.Users.findOneById(room.servedBy._id);
            if (!(user === null || user === void 0 ? void 0 : user._id)) {
                throw new meteor_1.Meteor.Error('error-invalid-user');
            }
            // find inquiry corresponding to room
            const inquiry = yield models_1.LivechatInquiry.findOne({ rid: room._id });
            if (!inquiry) {
                return false;
            }
            const transferredBy = (0, Helper_1.normalizeTransferredByData)(user, room);
            this.logger.debug(`Transfering room ${room._id} by user ${transferredBy._id}`);
            const transferData = Object.assign({ roomId: room._id, scope: 'queue', departmentId, transferredBy }, overrideTransferData);
            try {
                yield this.saveTransferHistory(room, transferData);
                yield RoutingManager_1.RoutingManager.unassignAgent(inquiry, departmentId);
            }
            catch (e) {
                this.logger.error(e);
                throw new meteor_1.Meteor.Error('error-returning-inquiry');
            }
            callbacks_1.callbacks.runAsync('livechat:afterReturnRoomAsInquiry', { room });
            return true;
        });
    }
    saveTransferHistory(room, transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { departmentId: previousDepartment } = room;
            const { department: nextDepartment, transferredBy, transferredTo, scope, comment } = transferData;
            (0, check_1.check)(transferredBy, check_1.Match.ObjectIncluding({
                _id: String,
                username: String,
                name: check_1.Match.Maybe(String),
                userType: String,
            }));
            const { _id, username } = transferredBy;
            const scopeData = scope || (nextDepartment ? 'department' : 'agent');
            this.logger.info(`Storing new chat transfer of ${room._id} [Transfered by: ${_id} to ${scopeData}]`);
            const transferMessage = Object.assign(Object.assign({}, (transferData.transferredBy.userType === 'visitor' && { token: room.v.token })), { transferData: Object.assign(Object.assign(Object.assign({ transferredBy, ts: new Date(), scope: scopeData, comment }, (previousDepartment && { previousDepartment })), (nextDepartment && { nextDepartment })), (transferredTo && { transferredTo })) });
            yield core_services_1.Message.saveSystemMessageAndNotifyUser('livechat_transfer_history', room._id, '', { _id, username }, transferMessage);
        });
    }
    saveGuest(guestData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_3, _b, _c;
            const { _id, name, email, phone, livechatData = {} } = guestData;
            const visitor = yield models_1.LivechatVisitors.findOneById(_id, { projection: { _id: 1 } });
            if (!visitor) {
                throw new Error('error-invalid-visitor');
            }
            this.logger.debug({ msg: 'Saving guest', guestData });
            const updateData = { livechatData: {} };
            if (name) {
                updateData.name = name;
            }
            if (email) {
                updateData.email = email;
            }
            if (phone) {
                updateData.phone = phone;
            }
            const customFields = {};
            if ((!userId || (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-livechat-room-customfields'))) && Object.keys(livechatData).length) {
                this.logger.debug({ msg: `Saving custom fields for visitor ${_id}`, livechatData });
                try {
                    for (var _d = true, _e = __asyncValues(models_1.LivechatCustomField.findByScope('visitor')), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const field = _c;
                        if (!livechatData.hasOwnProperty(field._id)) {
                            continue;
                        }
                        const value = (0, stringUtils_1.trim)(livechatData[field._id]);
                        if (value !== '' && field.regexp !== undefined && field.regexp !== '') {
                            const regexp = new RegExp(field.regexp);
                            if (!regexp.test(value)) {
                                throw new Error(i18n_1.i18n.t('error-invalid-custom-field-value'));
                            }
                        }
                        customFields[field._id] = value;
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                updateData.livechatData = customFields;
                exports.Livechat.logger.debug(`About to update ${Object.keys(customFields).length} custom fields for visitor ${_id}`);
            }
            const ret = yield models_1.LivechatVisitors.saveGuestById(_id, updateData);
            setImmediate(() => {
                var _a;
                void ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPostLivechatGuestSaved, _id));
            });
            return ret;
        });
    }
    setCustomFields(_a) {
        return __awaiter(this, arguments, void 0, function* ({ token, key, value, overwrite }) {
            exports.Livechat.logger.debug(`Setting custom fields data for visitor with token ${token}`);
            const customField = yield models_1.LivechatCustomField.findOneById(key);
            if (!customField) {
                throw new Error('invalid-custom-field');
            }
            if (customField.regexp !== undefined && customField.regexp !== '') {
                const regexp = new RegExp(customField.regexp);
                if (!regexp.test(value)) {
                    throw new Error(i18n_1.i18n.t('error-invalid-custom-field-value', { field: key }));
                }
            }
            let result;
            if (customField.scope === 'room') {
                result = yield models_1.LivechatRooms.updateDataByToken(token, key, value, overwrite);
            }
            else {
                result = yield models_1.LivechatVisitors.updateLivechatDataByToken(token, key, value, overwrite);
            }
            if (typeof result === 'boolean') {
                // Note: this only happens when !overwrite is passed, in this case we don't do any db update
                return 0;
            }
            return result.modifiedCount;
        });
    }
    requestTranscript(_a) {
        return __awaiter(this, arguments, void 0, function* ({ rid, email, subject, user, }) {
            const room = yield models_1.LivechatRooms.findOneById(rid, { projection: { _id: 1, open: 1, transcriptRequest: 1 } });
            if (!(room === null || room === void 0 ? void 0 : room.open)) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room');
            }
            if (room.transcriptRequest) {
                throw new meteor_1.Meteor.Error('error-transcript-already-requested', 'Transcript already requested');
            }
            if (!(yield core_services_1.Omnichannel.isWithinMACLimit(room))) {
                throw new Error('error-mac-limit-reached');
            }
            const { _id, username, name, utcOffset } = user;
            const transcriptRequest = {
                requestedAt: new Date(),
                requestedBy: {
                    _id,
                    username,
                    name,
                    utcOffset,
                },
                email,
                subject,
            };
            yield models_1.LivechatRooms.setEmailTranscriptRequestedByRoomId(rid, transcriptRequest);
            return true;
        });
    }
    afterRemoveAgent(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield callbacks_1.callbacks.run('livechat.afterAgentRemoved', { agent: user });
            return true;
        });
    }
    removeAgent(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Users.findOneByUsername(username, { projection: { _id: 1, username: 1 } });
            if (!user) {
                throw new Error('error-invalid-user');
            }
            const { _id } = user;
            if (yield (0, removeUserFromRoles_1.removeUserFromRolesAsync)(_id, ['livechat-agent'])) {
                return this.afterRemoveAgent(user);
            }
            return false;
        });
    }
    removeManager(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Users.findOneByUsername(username, { projection: { _id: 1 } });
            if (!user) {
                throw new Error('error-invalid-user');
            }
            return (0, removeUserFromRoles_1.removeUserFromRolesAsync)(user._id, ['livechat-manager']);
        });
    }
    getLivechatRoomGuestInfo(room) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const visitor = yield models_1.LivechatVisitors.findOneEnabledById(room.v._id);
            if (!visitor) {
                throw new Error('error-invalid-visitor');
            }
            const agent = ((_a = room.servedBy) === null || _a === void 0 ? void 0 : _a._id) ? yield models_1.Users.findOneById((_b = room.servedBy) === null || _b === void 0 ? void 0 : _b._id) : null;
            const ua = new ua_parser_js_1.default();
            ua.setUA(visitor.userAgent || '');
            const postData = {
                _id: room._id,
                label: room.fname || room.label, // using same field for compatibility
                topic: room.topic,
                createdAt: room.ts,
                lastMessageAt: room.lm,
                tags: room.tags,
                customFields: room.livechatData,
                visitor: {
                    _id: visitor._id,
                    token: visitor.token,
                    name: visitor.name,
                    username: visitor.username,
                    department: visitor.department,
                    ip: visitor.ip,
                    os: ua.getOS().name && `${ua.getOS().name} ${ua.getOS().version}`,
                    browser: ua.getBrowser().name && `${ua.getBrowser().name} ${ua.getBrowser().version}`,
                    customFields: visitor.livechatData,
                },
            };
            if (agent) {
                const customFields = (0, Helper_1.parseAgentCustomFields)(agent.customFields);
                postData.agent = Object.assign({ _id: agent._id, username: agent.username, name: agent.name }, (customFields && { customFields }));
                if (agent.emails && agent.emails.length > 0) {
                    postData.agent.email = agent.emails[0].address;
                }
            }
            if (room.crmData) {
                postData.crmData = room.crmData;
            }
            if (visitor.visitorEmails && visitor.visitorEmails.length > 0) {
                postData.visitor.email = visitor.visitorEmails;
            }
            if (visitor.phone && visitor.phone.length > 0) {
                postData.visitor.phone = visitor.phone;
            }
            return postData;
        });
    }
    allowAgentChangeServiceStatus(statusLivechat, agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (statusLivechat !== core_typings_1.ILivechatAgentStatus.AVAILABLE) {
                return true;
            }
            return business_hour_1.businessHourManager.allowAgentChangeServiceStatus(agentId);
        });
    }
    notifyGuestStatusChanged(token, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.LivechatRooms.updateVisitorStatus(token, status);
            const inquiryVisitorStatus = yield models_1.LivechatInquiry.updateVisitorStatus(token, status);
            if (inquiryVisitorStatus.modifiedCount) {
                void (0, notifyListener_1.notifyOnLivechatInquiryChangedByToken)(token, 'updated', { v: { status } });
            }
        });
    }
    setUserStatusLivechat(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Users.setLivechatStatus(userId, status);
            callbacks_1.callbacks.runAsync('livechat.setUserStatusLivechat', { userId, status });
            if (user.modifiedCount > 0) {
                void (0, notifyListener_1.notifyOnUserChange)({
                    id: userId,
                    clientAction: 'updated',
                    diff: {
                        statusLivechat: status,
                        livechatStatusSystemModified: false,
                    },
                });
            }
            return user;
        });
    }
    afterAgentAdded(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                models_1.Users.setOperator(user._id, true),
                this.setUserStatusLivechat(user._id, user.status !== 'offline' ? core_typings_1.ILivechatAgentStatus.AVAILABLE : core_typings_1.ILivechatAgentStatus.NOT_AVAILABLE),
            ]);
            callbacks_1.callbacks.runAsync('livechat.onNewAgentCreated', user._id);
            return user;
        });
    }
    addAgent(username) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(username, String);
            const user = yield models_1.Users.findOneByUsername(username, { projection: { _id: 1, username: 1 } });
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user');
            }
            if (yield (0, addUserRoles_1.addUserRolesAsync)(user._id, ['livechat-agent'])) {
                return this.afterAgentAdded(user);
            }
            return false;
        });
    }
    afterAgentUserActivated(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.roles.includes('livechat-agent')) {
                throw new Error('invalid-user-role');
            }
            yield models_1.Users.setOperator(user._id, true);
            callbacks_1.callbacks.runAsync('livechat.onNewAgentCreated', user._id);
        });
    }
    addManager(username) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(username, String);
            const user = yield models_1.Users.findOneByUsername(username, { projection: { _id: 1, username: 1 } });
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user');
            }
            if (yield (0, addUserRoles_1.addUserRolesAsync)(user._id, ['livechat-manager'])) {
                return user;
            }
            return false;
        });
    }
    saveRoomInfo(roomData, guestData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_4, _b, _c;
            var _d, _e, _f;
            this.logger.debug(`Saving room information on room ${roomData._id}`);
            const { livechatData = {} } = roomData;
            const customFields = {};
            if ((!userId || (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-livechat-room-customfields'))) && Object.keys(livechatData).length) {
                const fields = models_1.LivechatCustomField.findByScope('room');
                try {
                    for (var _g = true, fields_1 = __asyncValues(fields), fields_1_1; fields_1_1 = yield fields_1.next(), _a = fields_1_1.done, !_a; _g = true) {
                        _c = fields_1_1.value;
                        _g = false;
                        const field = _c;
                        if (!livechatData.hasOwnProperty(field._id)) {
                            continue;
                        }
                        const value = (0, stringUtils_1.trim)(livechatData[field._id]);
                        if (value !== '' && field.regexp !== undefined && field.regexp !== '') {
                            const regexp = new RegExp(field.regexp);
                            if (!regexp.test(value)) {
                                throw new meteor_1.Meteor.Error(i18n_1.i18n.t('error-invalid-custom-field-value', { field: field.label }));
                            }
                        }
                        customFields[field._id] = value;
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (!_g && !_a && (_b = fields_1.return)) yield _b.call(fields_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                roomData.livechatData = customFields;
                exports.Livechat.logger.debug(`About to update ${Object.keys(customFields).length} custom fields on room ${roomData._id}`);
            }
            yield models_1.LivechatRooms.saveRoomById(roomData);
            setImmediate(() => {
                var _a;
                void ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPostLivechatRoomSaved, roomData._id));
            });
            if ((_d = guestData === null || guestData === void 0 ? void 0 : guestData.name) === null || _d === void 0 ? void 0 : _d.trim().length) {
                const { _id: rid } = roomData;
                const { name } = guestData;
                const responses = yield Promise.all([
                    models_1.Rooms.setFnameById(rid, name),
                    models_1.LivechatInquiry.setNameByRoomId(rid, name),
                    models_1.Subscriptions.updateDisplayNameByRoomId(rid, name),
                ]);
                if ((_e = responses[1]) === null || _e === void 0 ? void 0 : _e.modifiedCount) {
                    void (0, notifyListener_1.notifyOnLivechatInquiryChangedByRoom)(rid, 'updated', { name });
                }
                if ((_f = responses[2]) === null || _f === void 0 ? void 0 : _f.modifiedCount) {
                    yield (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(rid);
                }
            }
            void (0, notifyListener_1.notifyOnRoomChangedById)(roomData._id);
            return true;
        });
    }
}
exports.Livechat = new LivechatClass();
