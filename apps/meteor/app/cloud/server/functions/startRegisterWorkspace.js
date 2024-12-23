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
exports.startRegisterWorkspace = startRegisterWorkspace;
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const buildRegistrationData_1 = require("./buildRegistrationData");
const retrieveRegistrationStatus_1 = require("./retrieveRegistrationStatus");
const syncWorkspace_1 = require("./syncWorkspace");
const system_1 = require("../../../../server/lib/logger/system");
const auditedSettingUpdates_1 = require("../../../../server/settings/lib/auditedSettingUpdates");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_1 = require("../../../settings/server");
function startRegisterWorkspace() {
    return __awaiter(this, arguments, void 0, function* (resend = false) {
        const { workspaceRegistered } = yield (0, retrieveRegistrationStatus_1.retrieveRegistrationStatus)();
        if (workspaceRegistered || process.env.TEST_MODE) {
            yield (0, syncWorkspace_1.syncWorkspace)();
            return true;
        }
        (yield models_1.Settings.updateValueById('Register_Server', true)).modifiedCount && void (0, notifyListener_1.notifyOnSettingChangedById)('Register_Server');
        const regInfo = yield (0, buildRegistrationData_1.buildWorkspaceRegistrationData)(undefined);
        let payload;
        try {
            const cloudUrl = server_1.settings.get('Cloud_Url');
            const response = yield (0, server_fetch_1.serverFetch)(`${cloudUrl}/api/v2/register/workspace`, {
                method: 'POST',
                body: regInfo,
                params: {
                    resend,
                },
            });
            if (!response.ok) {
                throw new Error((yield response.json()).error);
            }
            payload = yield response.json();
        }
        catch (err) {
            system_1.SystemLogger.error({
                msg: 'Failed to register with Rocket.Chat Cloud',
                url: '/api/v2/register/workspace',
                err,
            });
            return false;
        }
        if (!payload) {
            return false;
        }
        yield (0, auditedSettingUpdates_1.updateAuditedBySystem)({
            reason: 'startRegisterWorkspace',
        })(models_1.Settings.updateValueById, 'Cloud_Workspace_Id', payload.id);
        return true;
    });
}
