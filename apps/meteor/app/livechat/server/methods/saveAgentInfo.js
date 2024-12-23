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
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const hasRole_1 = require("../../../authorization/server/functions/hasRole");
const LivechatTyped_1 = require("../lib/LivechatTyped");
meteor_1.Meteor.methods({
    'livechat:saveAgentInfo'(_id, agentData, agentDepartments) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid || !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'manage-livechat-agents'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'livechat:saveAgentInfo',
                });
            }
            const user = yield models_1.Users.findOneById(_id);
            if (!user || !(yield (0, hasRole_1.hasRoleAsync)(_id, 'livechat-agent'))) {
                throw new meteor_1.Meteor.Error('error-user-is-not-agent', 'User is not a livechat agent', {
                    method: 'livechat:saveAgentInfo',
                });
            }
            return LivechatTyped_1.Livechat.saveAgentInfo(_id, agentData, agentDepartments);
        });
    },
});
