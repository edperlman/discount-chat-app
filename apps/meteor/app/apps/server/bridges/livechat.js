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
exports.AppLivechatBridge = void 0;
const LivechatBridge_1 = require("@rocket.chat/apps-engine/server/bridges/LivechatBridge");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../lib/callbacks");
const deasync_1 = require("../../../../server/deasync/deasync");
const LivechatTyped_1 = require("../../../livechat/server/lib/LivechatTyped");
const getRoomMessages_1 = require("../../../livechat/server/lib/getRoomMessages");
const server_1 = require("../../../settings/server");
class AppLivechatBridge extends LivechatBridge_1.LivechatBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    isOnline(departmentId) {
        // This function will be converted to sync inside the apps-engine code
        // TODO: Track Deprecation
        return (0, deasync_1.deasyncPromise)(LivechatTyped_1.Livechat.online(departmentId));
    }
    isOnlineAsync(departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return LivechatTyped_1.Livechat.online(departmentId);
        });
    }
    createMessage(message, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.orch.debugLog(`The App ${appId} is creating a new message.`);
            if (!message.token) {
                throw new Error('Invalid token for livechat message');
            }
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const guest = this.orch.getConverters().get('visitors').convertAppVisitor(message.visitor);
            const appMessage = (yield this.orch.getConverters().get('messages').convertAppMessage(message));
            const livechatMessage = appMessage;
            const msg = yield LivechatTyped_1.Livechat.sendMessage({
                guest: guest,
                message: livechatMessage,
                agent: undefined,
                roomInfo: {
                    source: {
                        type: core_typings_1.OmnichannelSourceType.APP,
                        id: appId,
                        alias: (_b = (_a = this.orch.getManager()) === null || _a === void 0 ? void 0 : _a.getOneById(appId)) === null || _b === void 0 ? void 0 : _b.getNameSlug(),
                    },
                },
            });
            return msg._id;
        });
    }
    getMessageById(messageId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is getting the message: "${messageId}"`);
            const message = yield this.orch.getConverters().get('messages').convertById(messageId);
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            return message;
        });
    }
    updateMessage(message, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is updating a message.`);
            const data = {
                guest: message.visitor,
                message: yield ((_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('messages').convertAppMessage(message)),
            };
            // @ts-expect-error IVisitor vs ILivechatVisitor :(
            yield LivechatTyped_1.Livechat.updateMessage(data);
        });
    }
    createRoom(visitor_1, agent_1, appId_1) {
        return __awaiter(this, arguments, void 0, function* (visitor, agent, appId, { source, customFields } = {}) {
            var _a, _b, _c, _d;
            this.orch.debugLog(`The App ${appId} is creating a livechat room.`);
            let agentRoom;
            if (agent === null || agent === void 0 ? void 0 : agent.id) {
                const user = yield models_1.Users.getAgentInfo(agent.id, server_1.settings.get('Livechat_show_agent_email'));
                if (!user) {
                    throw new Error(`The agent with id "${agent.id}" was not found.`);
                }
                agentRoom = { agentId: user._id, username: user.username };
            }
            const room = yield LivechatTyped_1.Livechat.createRoom({
                visitor: (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('visitors').convertAppVisitor(visitor),
                roomInfo: {
                    source: Object.assign({ type: core_typings_1.OmnichannelSourceType.APP, id: appId, alias: (_c = (_b = this.orch.getManager()) === null || _b === void 0 ? void 0 : _b.getOneById(appId)) === null || _c === void 0 ? void 0 : _c.getName() }, (source &&
                        source.type === 'app' && {
                        sidebarIcon: source.sidebarIcon,
                        defaultIcon: source.defaultIcon,
                        label: source.label,
                        destination: source.destination,
                    })),
                },
                agent: agentRoom,
                extraData: customFields && { customFields },
            });
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            return (_d = this.orch.getConverters()) === null || _d === void 0 ? void 0 : _d.get('rooms').convertRoom(room);
        });
    }
    closeRoom(room, comment, closer, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            this.orch.debugLog(`The App ${appId} is closing a livechat room.`);
            const user = closer && ((_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('users').convertToRocketChat(closer));
            const visitor = (_b = this.orch.getConverters()) === null || _b === void 0 ? void 0 : _b.get('visitors').convertAppVisitor(room.visitor);
            const closeData = Object.assign(Object.assign({ room: yield ((_c = this.orch.getConverters()) === null || _c === void 0 ? void 0 : _c.get('rooms').convertAppRoom(room)), comment }, (user && { user })), (visitor && { visitor }));
            yield LivechatTyped_1.Livechat.closeRoom(closeData);
            return true;
        });
    }
    findOpenRoomsByAgentId(agentId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is looking for livechat rooms associated with agent ${agentId}`);
            if (!agentId) {
                throw new Error('Invalid agentId');
            }
            const rooms = yield models_1.LivechatRooms.findOpenByAgent(agentId).toArray();
            return Promise.all(rooms.map((room) => { var _a; return (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('rooms').convertRoom(room); }));
        });
    }
    countOpenRoomsByAgentId(agentId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is counting livechat rooms associated with agent ${agentId}`);
            if (!agentId) {
                throw new Error('Invalid agentId');
            }
            return models_1.LivechatRooms.countOpenByAgent(agentId);
        });
    }
    findRooms(visitor, departmentId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is looking for livechat visitors.`);
            if (!visitor) {
                return [];
            }
            let result;
            const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
            if (departmentId) {
                result = yield models_1.LivechatRooms.findOpenByVisitorTokenAndDepartmentId(visitor.token, departmentId, {}, extraQuery).toArray();
            }
            else {
                result = yield models_1.LivechatRooms.findOpenByVisitorToken(visitor.token, {}, extraQuery).toArray();
            }
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            return Promise.all(result.map((room) => { var _a; return (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('rooms').convertRoom(room); }));
        });
    }
    createVisitor(visitor, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.orch.debugLog(`The App ${appId} is creating a livechat visitor.`);
            const registerData = Object.assign(Object.assign({ department: visitor.department, username: visitor.username, name: visitor.name, token: visitor.token, email: '', connectionData: undefined, id: visitor.id }, (((_a = visitor.phone) === null || _a === void 0 ? void 0 : _a.length) && { phone: { number: visitor.phone[0].phoneNumber } })), (((_b = visitor.visitorEmails) === null || _b === void 0 ? void 0 : _b.length) && { email: visitor.visitorEmails[0].address }));
            const livechatVisitor = yield LivechatTyped_1.Livechat.registerGuest(registerData);
            if (!livechatVisitor) {
                throw new Error('Invalid visitor, cannot create');
            }
            return livechatVisitor._id;
        });
    }
    createAndReturnVisitor(visitor, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            this.orch.debugLog(`The App ${appId} is creating a livechat visitor.`);
            const registerData = Object.assign(Object.assign({ department: visitor.department, username: visitor.username, name: visitor.name, token: visitor.token, email: '', connectionData: undefined, id: visitor.id }, (((_a = visitor.phone) === null || _a === void 0 ? void 0 : _a.length) && { phone: { number: visitor.phone[0].phoneNumber } })), (((_b = visitor.visitorEmails) === null || _b === void 0 ? void 0 : _b.length) && { email: visitor.visitorEmails[0].address }));
            const livechatVisitor = yield LivechatTyped_1.Livechat.registerGuest(registerData);
            return (_c = this.orch.getConverters()) === null || _c === void 0 ? void 0 : _c.get('visitors').convertVisitor(livechatVisitor);
        });
    }
    transferVisitor(visitor, transferData, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.orch.debugLog(`The App ${appId} is transfering a livechat.`);
            if (!visitor) {
                throw new Error('Invalid visitor, cannot transfer');
            }
            const { targetAgent, targetDepartment: departmentId, currentRoom } = transferData;
            const appUser = yield models_1.Users.findOneByAppId(appId, {});
            if (!appUser) {
                throw new Error('Invalid app user, cannot transfer');
            }
            const { _id, username, name, type } = appUser;
            const transferredBy = {
                _id,
                username,
                name,
                type,
                userType: 'user',
            };
            let userId;
            let transferredTo;
            if (targetAgent === null || targetAgent === void 0 ? void 0 : targetAgent.id) {
                transferredTo = yield models_1.Users.findOneAgentById(targetAgent.id, {
                    projection: { _id: 1, username: 1, name: 1 },
                });
                if (!transferredTo) {
                    throw new Error('Invalid target agent, cannot transfer');
                }
                userId = transferredTo._id;
            }
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            return LivechatTyped_1.Livechat.transfer((yield ((_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('rooms').convertAppRoom(currentRoom))), (_b = this.orch.getConverters()) === null || _b === void 0 ? void 0 : _b.get('visitors').convertAppVisitor(visitor), { userId, departmentId, transferredBy, transferredTo });
        });
    }
    findVisitors(query, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is looking for livechat visitors.`);
            if (this.orch.isDebugging()) {
                console.warn('The method AppLivechatBridge.findVisitors is deprecated. Please consider using its alternatives');
            }
            return Promise.all((yield models_1.LivechatVisitors.findEnabled(query).toArray()).map((visitor) => __awaiter(this, void 0, void 0, function* () { var _a; return visitor && ((_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('visitors').convertVisitor(visitor)); })));
        });
    }
    findVisitorById(id, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is looking for livechat visitors.`);
            return (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('visitors').convertById(id);
        });
    }
    findVisitorByEmail(email, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is looking for livechat visitors.`);
            return (_a = this.orch
                .getConverters()) === null || _a === void 0 ? void 0 : _a.get('visitors').convertVisitor(yield models_1.LivechatVisitors.findOneGuestByEmailAddress(email));
        });
    }
    findVisitorByToken(token, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is looking for livechat visitors.`);
            return (_a = this.orch
                .getConverters()) === null || _a === void 0 ? void 0 : _a.get('visitors').convertVisitor(yield models_1.LivechatVisitors.getVisitorByToken(token, {}));
        });
    }
    findVisitorByPhoneNumber(phoneNumber, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is looking for livechat visitors.`);
            return (_a = this.orch
                .getConverters()) === null || _a === void 0 ? void 0 : _a.get('visitors').convertVisitor(yield models_1.LivechatVisitors.findOneVisitorByPhone(phoneNumber));
        });
    }
    findDepartmentByIdOrName(value, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is looking for livechat departments.`);
            return (_a = this.orch
                .getConverters()) === null || _a === void 0 ? void 0 : _a.get('departments').convertDepartment(yield models_1.LivechatDepartment.findOneByIdOrName(value, {}));
        });
    }
    findDepartmentsEnabledWithAgents(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is looking for livechat departments.`);
            const converter = (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('departments');
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const boundConverter = converter.convertDepartment.bind(converter);
            return Promise.all((yield models_1.LivechatDepartment.findEnabledWithAgents().toArray()).map(boundConverter));
        });
    }
    _fetchLivechatRoomMessages(appId, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is getting the transcript for livechat room ${roomId}.`);
            const messageConverter = (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('messages');
            if (!messageConverter) {
                throw new Error('Could not get the message converter to process livechat room messages');
            }
            const livechatMessages = yield (0, getRoomMessages_1.getRoomMessages)({ rid: roomId });
            return Promise.all(yield livechatMessages.map((message) => messageConverter.convertMessage(message, livechatMessages)).toArray());
        });
    }
    setCustomFields(data, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is setting livechat visitor's custom fields.`);
            return LivechatTyped_1.Livechat.setCustomFields(data);
        });
    }
}
exports.AppLivechatBridge = AppLivechatBridge;
