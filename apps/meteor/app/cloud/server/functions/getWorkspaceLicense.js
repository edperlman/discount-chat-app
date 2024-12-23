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
exports.getWorkspaceLicense = getWorkspaceLicense;
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const suretype_1 = require("suretype");
const callbacks_1 = require("../../../../lib/callbacks");
const CloudWorkspaceConnectionError_1 = require("../../../../lib/errors/CloudWorkspaceConnectionError");
const CloudWorkspaceLicenseError_1 = require("../../../../lib/errors/CloudWorkspaceLicenseError");
const system_1 = require("../../../../server/lib/logger/system");
const server_1 = require("../../../settings/server");
const license_1 = require("../license");
const getWorkspaceAccessToken_1 = require("./getWorkspaceAccessToken");
const workspaceLicensePayloadSchema = suretype_1.v.object({
    version: suretype_1.v.number().required(),
    address: suretype_1.v.string().required(),
    license: suretype_1.v.string().required(),
    updatedAt: suretype_1.v.string().format('date-time').required(),
    modules: suretype_1.v.string().required(),
    expireAt: suretype_1.v.string().format('date-time').required(),
});
const assertWorkspaceLicensePayload = (0, suretype_1.compile)(workspaceLicensePayloadSchema);
const fetchCloudWorkspaceLicensePayload = (_a) => __awaiter(void 0, [_a], void 0, function* ({ token }) {
    const workspaceRegistrationClientUri = server_1.settings.get('Cloud_Workspace_Registration_Client_Uri');
    const response = yield (0, server_fetch_1.serverFetch)(`${workspaceRegistrationClientUri}/license`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            version: license_1.LICENSE_VERSION,
        },
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
    assertWorkspaceLicensePayload(payload);
    return payload;
});
function getWorkspaceLicense() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentLicense = yield models_1.Settings.findOne('Cloud_Workspace_License');
        // it should never happen, since even if the license is not found, it will return an empty settings
        if (!(currentLicense === null || currentLicense === void 0 ? void 0 : currentLicense._updatedAt)) {
            throw new CloudWorkspaceLicenseError_1.CloudWorkspaceLicenseError('Failed to retrieve current license');
        }
        try {
            const token = yield (0, getWorkspaceAccessToken_1.getWorkspaceAccessToken)();
            if (!token) {
                return;
            }
            const payload = yield fetchCloudWorkspaceLicensePayload({ token });
            if (currentLicense.value && Date.parse(payload.updatedAt) <= currentLicense._updatedAt.getTime()) {
                return;
            }
            yield callbacks_1.callbacks.run('workspaceLicenseChanged', payload.license);
            return { updated: true, license: payload.license };
        }
        catch (err) {
            system_1.SystemLogger.error({
                msg: 'Failed to update license from Rocket.Chat Cloud',
                url: '/license',
                err,
            });
        }
    });
}
