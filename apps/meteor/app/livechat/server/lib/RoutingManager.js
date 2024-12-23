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
exports.RoutingManager = void 0;
const apps_1 = require("@rocket.chat/apps");
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const Helper_1 = require("./Helper");
const callbacks_1 = require("../../../../lib/callbacks");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_1 = require("../../../settings/server");
const logger = new logger_1.Logger('RoutingManager');
exports.RoutingManager = {
    methods: {},
    isMethodSet() {
        return server_1.settings.get('Livechat_Routing_Method') !== '';
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    registerMethod(name, Method) {
        this.methods[name] = new Method();
    },
    getMethod() {
        const setting = server_1.settings.get('Livechat_Routing_Method');
        if (!this.methods[setting]) {
            throw new meteor_1.Meteor.Error('error-routing-method-not-available');
        }
        return this.methods[setting];
    },
    getConfig() {
        return this.getMethod().config;
    },
    getNextAgent(department, ignoreAgentId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.debug(`Getting next available agent with method ${server_1.settings.get('Livechat_Routing_Method')}`);
            return this.getMethod().getNextAgent(department, ignoreAgentId);
        });
    },
    delegateInquiry(inquiry_1, agent_1) {
        return __awaiter(this, arguments, void 0, function* (inquiry, agent, options = {}, room) {
            const { department, rid } = inquiry;
            logger.debug(`Attempting to delegate inquiry ${inquiry._id}`);
            if (!agent || (agent.username && !(yield models_1.Users.findOneOnlineAgentByUserList(agent.username)) && !(yield (0, Helper_1.allowAgentSkipQueue)(agent)))) {
                logger.debug(`Agent offline or invalid. Using routing method to get next agent for inquiry ${inquiry._id}`);
                agent = yield this.getNextAgent(department);
                logger.debug(`Routing method returned agent ${agent === null || agent === void 0 ? void 0 : agent.agentId} for inquiry ${inquiry._id}`);
            }
            if (!agent) {
                logger.debug(`No agents available. Unable to delegate inquiry ${inquiry._id}`);
                // When an inqury reaches here on CE, it will stay here as 'ready' since on CE there's no mechanism to re queue it.
                // When reaching this point, managers have to manually transfer the inquiry to another room. This is expected.
                return models_1.LivechatRooms.findOneById(rid);
            }
            if (!room) {
                throw new meteor_1.Meteor.Error('error-invalid-room');
            }
            logger.debug(`Inquiry ${inquiry._id} will be taken by agent ${agent.agentId}`);
            return this.takeInquiry(inquiry, agent, options, room);
        });
    },
    assignAgent(inquiry, room, agent) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            (0, check_1.check)(agent, check_1.Match.ObjectIncluding({
                agentId: String,
                username: String,
            }));
            logger.debug(`Assigning agent ${agent.agentId} to inquiry ${inquiry._id}`);
            const { rid, name, v, department } = inquiry;
            if (!(yield (0, Helper_1.createLivechatSubscription)(rid, name, v, agent, department))) {
                logger.debug(`Cannot assign agent to inquiry ${inquiry._id}: Cannot create subscription`);
                throw new meteor_1.Meteor.Error('error-creating-subscription', 'Error creating subscription');
            }
            yield models_1.LivechatRooms.changeAgentByRoomId(rid, agent);
            yield models_1.Rooms.incUsersCountById(rid, 1);
            const user = yield models_1.Users.findOneById(agent.agentId);
            if (user) {
                yield Promise.all([core_services_1.Message.saveSystemMessage('command', rid, 'connected', user), core_services_1.Message.saveSystemMessage('uj', rid, '', user)]);
            }
            yield (0, Helper_1.dispatchAgentDelegated)(rid, agent.agentId);
            logger.debug(`Agent ${agent.agentId} assigned to inquiry ${inquiry._id}. Instances notified`);
            void ((_b = (_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.getBridges()) === null || _b === void 0 ? void 0 : _b.getListenerBridge().livechatEvent(apps_1.AppEvents.IPostLivechatAgentAssigned, { room, user }));
            return inquiry;
        });
    },
    unassignAgent(inquiry_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (inquiry, departmentId, shouldQueue = false) {
            const { rid, department } = inquiry;
            const room = yield models_1.LivechatRooms.findOneById(rid);
            logger.debug(`Removing assignations of inquiry ${inquiry._id}`);
            if (!(room === null || room === void 0 ? void 0 : room.open)) {
                logger.debug(`Cannot unassign agent from inquiry ${inquiry._id}: Room already closed`);
                return false;
            }
            if (departmentId && departmentId !== department) {
                logger.debug(`Switching department for inquiry ${inquiry._id} [Current: ${department} | Next: ${departmentId}]`);
                yield (0, Helper_1.updateChatDepartment)({
                    rid,
                    newDepartmentId: departmentId,
                    oldDepartmentId: department,
                });
                // Fake the department to delegate the inquiry;
                inquiry.department = departmentId;
            }
            const { servedBy } = room;
            if (shouldQueue) {
                const queuedInquiry = yield models_1.LivechatInquiry.queueInquiry(inquiry._id);
                if (queuedInquiry) {
                    inquiry = queuedInquiry;
                    void (0, notifyListener_1.notifyOnLivechatInquiryChanged)(inquiry, 'updated', {
                        status: core_typings_1.LivechatInquiryStatus.QUEUED,
                        queuedAt: new Date(),
                        takenAt: undefined,
                    });
                }
            }
            if (servedBy) {
                yield models_1.LivechatRooms.removeAgentByRoomId(rid);
                yield this.removeAllRoomSubscriptions(room);
                yield (0, Helper_1.dispatchAgentDelegated)(rid);
            }
            yield (0, Helper_1.dispatchInquiryQueued)(inquiry);
            return true;
        });
    },
    takeInquiry(inquiry_1, agent_1) {
        return __awaiter(this, arguments, void 0, function* (inquiry, agent, options = { clientAction: false }, room) {
            (0, check_1.check)(agent, check_1.Match.ObjectIncluding({
                agentId: String,
                username: String,
            }));
            (0, check_1.check)(inquiry, check_1.Match.ObjectIncluding({
                _id: String,
                rid: String,
                status: String,
            }));
            logger.debug(`Attempting to take Inquiry ${inquiry._id} [Agent ${agent.agentId}] `);
            const { _id, rid } = inquiry;
            if (!(room === null || room === void 0 ? void 0 : room.open)) {
                logger.debug(`Cannot take Inquiry ${inquiry._id}: Room is closed`);
                return room;
            }
            if (room.servedBy && room.servedBy._id === agent.agentId) {
                logger.debug(`Cannot take Inquiry ${inquiry._id}: Already taken by agent ${room.servedBy._id}`);
                return room;
            }
            try {
                yield callbacks_1.callbacks.run('livechat.checkAgentBeforeTakeInquiry', {
                    agent,
                    inquiry,
                    options,
                });
            }
            catch (e) {
                if (options.clientAction && !options.forwardingToDepartment) {
                    throw e;
                }
                agent = null;
            }
            if (!agent) {
                logger.debug(`Cannot take Inquiry ${inquiry._id}: Precondition failed for agent`);
                const cbRoom = yield callbacks_1.callbacks.run('livechat.onAgentAssignmentFailed', room, {
                    inquiry,
                    options,
                });
                return cbRoom;
            }
            yield models_1.LivechatInquiry.takeInquiry(_id);
            logger.info(`Inquiry ${inquiry._id} taken by agent ${agent.agentId}`);
            // assignAgent changes the room data to add the agent serving the conversation. afterTakeInquiry expects room object to be updated
            const inq = yield this.assignAgent(inquiry, room, agent);
            const roomAfterUpdate = yield models_1.LivechatRooms.findOneById(rid);
            if (!roomAfterUpdate) {
                // This should never happen
                throw new Error('error-room-not-found');
            }
            callbacks_1.callbacks.runAsync('livechat.afterTakeInquiry', {
                inquiry: inq,
                room: roomAfterUpdate,
            }, agent);
            void (0, notifyListener_1.notifyOnLivechatInquiryChangedById)(inquiry._id, 'updated', {
                status: core_typings_1.LivechatInquiryStatus.TAKEN,
                takenAt: new Date(),
                defaultAgent: undefined,
                estimatedInactivityCloseTimeAt: undefined,
                queuedAt: undefined,
            });
            return roomAfterUpdate;
        });
    },
    transferRoom(room, guest, transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.debug(`Transfering room ${room._id} by ${transferData.transferredBy._id}`);
            if (transferData.departmentId) {
                logger.debug(`Transfering room ${room._id} to department ${transferData.departmentId}`);
                return (0, Helper_1.forwardRoomToDepartment)(room, guest, transferData);
            }
            if (transferData.userId) {
                logger.debug(`Transfering room ${room._id} to user ${transferData.userId}`);
                return (0, Helper_1.forwardRoomToAgent)(room, transferData);
            }
            logger.debug(`Unable to transfer room ${room._id}: No target provided`);
            return false;
        });
    },
    delegateAgent(agent, inquiry) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultAgent = yield callbacks_1.callbacks.run('livechat.beforeDelegateAgent', agent, {
                department: inquiry === null || inquiry === void 0 ? void 0 : inquiry.department,
            });
            if (defaultAgent) {
                logger.debug(`Delegating Inquiry ${inquiry._id} to agent ${defaultAgent.username}`);
                yield models_1.LivechatInquiry.setDefaultAgentById(inquiry._id, defaultAgent);
                void (0, notifyListener_1.notifyOnLivechatInquiryChanged)(inquiry, 'updated', { defaultAgent });
            }
            logger.debug(`Queueing inquiry ${inquiry._id}`);
            yield (0, Helper_1.dispatchInquiryQueued)(inquiry, defaultAgent);
            return defaultAgent;
        });
    },
    removeAllRoomSubscriptions(room, ignoreUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id: roomId } = room;
            const subscriptions = yield models_1.Subscriptions.findByRoomId(roomId).toArray();
            subscriptions === null || subscriptions === void 0 ? void 0 : subscriptions.forEach(({ u }) => {
                if (ignoreUser && ignoreUser._id === u._id) {
                    return;
                }
                void (0, Helper_1.removeAgentFromSubscription)(roomId, u);
            });
        });
    },
};
