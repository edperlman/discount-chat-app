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
exports.createPermissions = exports.omnichannelEEPermissions = void 0;
const models_1 = require("@rocket.chat/models");
const createOrUpdateProtectedRole_1 = require("../../../../server/lib/roles/createOrUpdateProtectedRole");
const livechatMonitorRole = 'livechat-monitor';
const livechatManagerRole = 'livechat-manager';
const adminRole = 'admin';
const livechatAgentRole = 'livechat-agent';
exports.omnichannelEEPermissions = [
    { _id: 'manage-livechat-units', roles: [adminRole, livechatManagerRole] },
    { _id: 'manage-livechat-monitors', roles: [adminRole, livechatManagerRole] },
    { _id: 'manage-livechat-tags', roles: [adminRole, livechatManagerRole] },
    { _id: 'manage-livechat-priorities', roles: [adminRole, livechatManagerRole] },
    { _id: 'manage-livechat-sla', roles: [adminRole, livechatManagerRole] },
    { _id: 'manage-livechat-canned-responses', roles: [adminRole, livechatManagerRole, livechatMonitorRole] },
    { _id: 'spy-voip-calls', roles: [adminRole, livechatManagerRole, livechatMonitorRole] },
    { _id: 'outbound-voip-calls', roles: [adminRole, livechatManagerRole] },
    { _id: 'request-pdf-transcript', roles: [adminRole, livechatManagerRole, livechatMonitorRole, livechatAgentRole] },
    { _id: 'view-livechat-reports', roles: [adminRole, livechatManagerRole, livechatMonitorRole] },
    { _id: 'block-livechat-contact', roles: [adminRole, livechatManagerRole, livechatMonitorRole, livechatAgentRole] },
    { _id: 'unblock-livechat-contact', roles: [adminRole, livechatManagerRole, livechatMonitorRole, livechatAgentRole] },
];
const createPermissions = () => __awaiter(void 0, void 0, void 0, function* () {
    const monitorRole = yield models_1.Roles.findOneById(livechatMonitorRole, { projection: { _id: 1 } });
    if (!monitorRole) {
        yield (0, createOrUpdateProtectedRole_1.createOrUpdateProtectedRoleAsync)(livechatMonitorRole, {
            name: livechatMonitorRole,
        });
    }
    yield Promise.all(exports.omnichannelEEPermissions.map((permission) => __awaiter(void 0, void 0, void 0, function* () { return models_1.Permissions.create(permission._id, permission.roles); })));
});
exports.createPermissions = createPermissions;
