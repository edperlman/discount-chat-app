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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const server_1 = require("../../../../api/server");
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
const LivechatTyped_1 = require("../../lib/LivechatTyped");
const RoutingManager_1 = require("../../lib/RoutingManager");
const departmentsLib_1 = require("../../lib/departmentsLib");
const livechat_1 = require("../lib/livechat");
server_1.API.v1.addRoute('livechat/agent.info/:rid/:token', {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const visitor = yield (0, livechat_1.findGuest)(this.urlParams.token);
            if (!visitor) {
                throw new Error('invalid-token');
            }
            const room = yield (0, livechat_1.findRoom)(this.urlParams.token, this.urlParams.rid);
            if (!room) {
                throw new Error('invalid-room');
            }
            const agent = (room === null || room === void 0 ? void 0 : room.servedBy) && (yield (0, livechat_1.findAgent)(room.servedBy._id));
            if (!agent) {
                throw new Error('invalid-agent');
            }
            return server_1.API.v1.success({ agent });
        });
    },
});
server_1.API.v1.addRoute('livechat/agent.next/:token', { validateParams: rest_typings_1.isGETAgentNextToken }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = this.urlParams;
            const room = yield (0, livechat_1.findOpenRoom)(token);
            if (room) {
                return server_1.API.v1.success();
            }
            let { department } = this.queryParams;
            if (!department) {
                const requireDepartment = yield (0, departmentsLib_1.getRequiredDepartment)();
                if (requireDepartment) {
                    department = requireDepartment._id;
                }
            }
            const agentData = yield RoutingManager_1.RoutingManager.getNextAgent(department);
            if (!agentData) {
                throw new Error('agent-not-found');
            }
            const agent = yield (0, livechat_1.findAgent)(agentData.agentId);
            if (!agent) {
                throw new Error('invalid-agent');
            }
            return server_1.API.v1.success({ agent });
        });
    },
});
server_1.API.v1.addRoute('livechat/agent.status', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isPOSTLivechatAgentStatusProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, agentId: inputAgentId } = this.bodyParams;
            const agentId = inputAgentId || this.userId;
            const agent = yield models_1.Users.findOneAgentById(agentId, {
                projection: {
                    status: 1,
                    statusLivechat: 1,
                    active: 1,
                },
            });
            if (!agent) {
                return server_1.API.v1.notFound('Agent not found');
            }
            if (!agent.active) {
                return server_1.API.v1.failure('error-user-deactivated');
            }
            const newStatus = status ||
                (agent.statusLivechat === core_typings_1.ILivechatAgentStatus.AVAILABLE ? core_typings_1.ILivechatAgentStatus.NOT_AVAILABLE : core_typings_1.ILivechatAgentStatus.AVAILABLE);
            if (newStatus === agent.statusLivechat) {
                return server_1.API.v1.success({ status: agent.statusLivechat });
            }
            const canChangeStatus = yield LivechatTyped_1.Livechat.allowAgentChangeServiceStatus(newStatus, agentId);
            if (agentId !== this.userId) {
                if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-livechat-agents'))) {
                    return server_1.API.v1.unauthorized();
                }
                // Silent fail for admins when BH is closed
                // Next version we'll update this to return an error
                // And update the FE accordingly
                if (canChangeStatus) {
                    yield LivechatTyped_1.Livechat.setUserStatusLivechat(agentId, newStatus);
                    return server_1.API.v1.success({ status: newStatus });
                }
                return server_1.API.v1.success({ status: agent.statusLivechat });
            }
            if (!canChangeStatus) {
                return server_1.API.v1.failure('error-business-hours-are-closed');
            }
            yield LivechatTyped_1.Livechat.setUserStatusLivechat(agentId, newStatus);
            return server_1.API.v1.success({ status: newStatus });
        });
    },
});
