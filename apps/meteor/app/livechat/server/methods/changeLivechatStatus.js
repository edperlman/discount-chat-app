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
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const deprecationWarningLogger_1 = require("../../../lib/server/lib/deprecationWarningLogger");
const LivechatTyped_1 = require("../lib/LivechatTyped");
meteor_1.Meteor.methods({
    'livechat:changeLivechatStatus'() {
        return __awaiter(this, arguments, void 0, function* ({ status, agentId = meteor_1.Meteor.userId() } = {}) {
            deprecationWarningLogger_1.methodDeprecationLogger.method('livechat:changeLivechatStatus', '7.0.0');
            const uid = meteor_1.Meteor.userId();
            if (!uid || !agentId) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'livechat:changeLivechatStatus',
                });
            }
            const agent = yield models_1.Users.findOneAgentById(agentId, {
                projection: {
                    status: 1,
                    statusLivechat: 1,
                },
            });
            if (!agent) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Invalid Agent Id', {
                    method: 'livechat:changeLivechatStatus',
                });
            }
            if (status && !['available', 'not-available'].includes(status)) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Invalid Status', {
                    method: 'livechat:changeLivechatStatus',
                });
            }
            const newStatus = status ||
                (agent.statusLivechat === core_typings_1.ILivechatAgentStatus.AVAILABLE ? core_typings_1.ILivechatAgentStatus.NOT_AVAILABLE : core_typings_1.ILivechatAgentStatus.AVAILABLE);
            if (newStatus === agent.statusLivechat) {
                return;
            }
            if (agentId !== uid) {
                if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'manage-livechat-agents'))) {
                    throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                        method: 'livechat:changeLivechatStatus',
                    });
                }
                return LivechatTyped_1.Livechat.setUserStatusLivechat(agentId, newStatus);
            }
            if (!(yield LivechatTyped_1.Livechat.allowAgentChangeServiceStatus(newStatus, agentId))) {
                throw new meteor_1.Meteor.Error('error-business-hours-are-closed', 'Not allowed', {
                    method: 'livechat:changeLivechatStatus',
                });
            }
            return LivechatTyped_1.Livechat.setUserStatusLivechat(agentId, newStatus);
        });
    },
});
