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
exports.connectWorkspace = connectWorkspace;
const server_fetch_1 = require("@rocket.chat/server-fetch");
const getRedirectUri_1 = require("./getRedirectUri");
const saveRegistrationData_1 = require("./saveRegistrationData");
const CloudWorkspaceConnectionError_1 = require("../../../../lib/errors/CloudWorkspaceConnectionError");
const system_1 = require("../../../../server/lib/logger/system");
const server_1 = require("../../../settings/server");
const fetchRegistrationDataPayload = (_a) => __awaiter(void 0, [_a], void 0, function* ({ token, body, }) {
    const cloudUrl = server_1.settings.get('Cloud_Url');
    const response = yield (0, server_fetch_1.serverFetch)(`${cloudUrl}/api/oauth/clients`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body,
    });
    if (!response.ok) {
        try {
            const { error } = yield response.json();
            throw new CloudWorkspaceConnectionError_1.CloudWorkspaceConnectionError(`Failed to connect to Rocket.Chat Cloud: ${error}`);
        }
        catch (error) {
            throw new CloudWorkspaceConnectionError_1.CloudWorkspaceConnectionError(`Failed to connect to Rocket.Chat Cloud: ${response.statusText}`);
        }
    }
    const payload = yield response.json();
    if (!payload) {
        return undefined;
    }
    return payload;
});
function connectWorkspace(token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!token) {
            throw new CloudWorkspaceConnectionError_1.CloudWorkspaceConnectionError('Invalid registration token');
        }
        try {
            const redirectUri = (0, getRedirectUri_1.getRedirectUri)();
            const body = {
                email: server_1.settings.get('Organization_Email'),
                client_name: server_1.settings.get('Site_Name'),
                redirect_uris: [redirectUri],
            };
            const payload = yield fetchRegistrationDataPayload({ token, body });
            if (!payload) {
                return false;
            }
            yield (0, saveRegistrationData_1.saveRegistrationData)(payload);
            return true;
        }
        catch (err) {
            system_1.SystemLogger.error({
                msg: 'Failed to Connect with Rocket.Chat Cloud',
                url: '/api/oauth/clients',
                err,
            });
            return false;
        }
    });
}
