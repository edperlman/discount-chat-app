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
exports.startRegisterWorkspaceSetupWizard = startRegisterWorkspaceSetupWizard;
const server_fetch_1 = require("@rocket.chat/server-fetch");
const buildRegistrationData_1 = require("./buildRegistrationData");
const system_1 = require("../../../../server/lib/logger/system");
const server_1 = require("../../../settings/server");
function startRegisterWorkspaceSetupWizard() {
    return __awaiter(this, arguments, void 0, function* (resend = false, email) {
        const regInfo = yield (0, buildRegistrationData_1.buildWorkspaceRegistrationData)(email);
        let payload;
        try {
            const cloudUrl = server_1.settings.get('Cloud_Url');
            const response = yield (0, server_fetch_1.serverFetch)(`${cloudUrl}/api/v2/register/workspace/intent`, {
                body: regInfo,
                method: 'POST',
                params: {
                    resent: resend,
                },
            });
            if (!response.ok) {
                throw new Error((yield response.json()).error);
            }
            payload = yield response.json();
        }
        catch (err) {
            system_1.SystemLogger.error({
                msg: 'Failed to register workspace intent with Rocket.Chat Cloud',
                url: '/api/v2/register/workspace',
                err,
            });
            throw err;
        }
        if (!payload) {
            throw new Error('Failed to fetch registration intent endpoint');
        }
        return payload;
    });
}
