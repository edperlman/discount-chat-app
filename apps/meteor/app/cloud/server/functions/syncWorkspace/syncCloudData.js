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
exports.syncCloudData = syncCloudData;
const license_1 = require("@rocket.chat/license");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const suretype_1 = require("suretype");
const callbacks_1 = require("../../../../../lib/callbacks");
const CloudWorkspaceAccessError_1 = require("../../../../../lib/errors/CloudWorkspaceAccessError");
const CloudWorkspaceConnectionError_1 = require("../../../../../lib/errors/CloudWorkspaceConnectionError");
const CloudWorkspaceRegistrationError_1 = require("../../../../../lib/errors/CloudWorkspaceRegistrationError");
const system_1 = require("../../../../../server/lib/logger/system");
const server_1 = require("../../../../settings/server");
const buildRegistrationData_1 = require("../buildRegistrationData");
const getWorkspaceAccessToken_1 = require("../getWorkspaceAccessToken");
const retrieveRegistrationStatus_1 = require("../retrieveRegistrationStatus");
const workspaceSyncPayloadSchema = suretype_1.v.object({
    workspaceId: suretype_1.v.string().required(),
    publicKey: suretype_1.v.string(),
    license: suretype_1.v.string().required(),
});
const assertWorkspaceSyncPayload = (0, suretype_1.compile)(workspaceSyncPayloadSchema);
const fetchWorkspaceSyncPayload = (_a) => __awaiter(void 0, [_a], void 0, function* ({ token, data, }) {
    const workspaceRegistrationClientUri = server_1.settings.get('Cloud_Workspace_Registration_Client_Uri');
    const response = yield (0, server_fetch_1.serverFetch)(`${workspaceRegistrationClientUri}/sync`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: data,
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
    assertWorkspaceSyncPayload(payload);
    return payload;
});
function syncCloudData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { workspaceRegistered } = yield (0, retrieveRegistrationStatus_1.retrieveRegistrationStatus)();
            if (!workspaceRegistered) {
                throw new CloudWorkspaceRegistrationError_1.CloudWorkspaceRegistrationError('Workspace is not registered');
            }
            const token = yield (0, getWorkspaceAccessToken_1.getWorkspaceAccessToken)(true);
            if (!token) {
                throw new getWorkspaceAccessToken_1.CloudWorkspaceAccessTokenEmptyError();
            }
            const workspaceRegistrationData = yield (0, buildRegistrationData_1.buildWorkspaceRegistrationData)(undefined);
            const { license, removeLicense = false } = yield fetchWorkspaceSyncPayload({
                token,
                data: workspaceRegistrationData,
            });
            if (removeLicense) {
                yield callbacks_1.callbacks.run('workspaceLicenseRemoved');
            }
            else {
                yield callbacks_1.callbacks.run('workspaceLicenseChanged', license);
            }
            system_1.SystemLogger.info({
                msg: 'Synced with Rocket.Chat Cloud',
                function: 'syncCloudData',
            });
            return true;
        }
        catch (err) {
            /**
             * If some of CloudWorkspaceAccessError and CloudWorkspaceRegistrationError happens, makes no sense to run the legacySyncWorkspace
             * because it will fail too.
             * The DuplicatedLicenseError license error is also ignored because it is not a problem. the Cloud is allowed to send the same license twice.
             */
            switch (true) {
                case err instanceof license_1.DuplicatedLicenseError:
                    return;
                case err instanceof CloudWorkspaceAccessError_1.CloudWorkspaceAccessError:
                case err instanceof CloudWorkspaceRegistrationError_1.CloudWorkspaceRegistrationError:
                case err instanceof getWorkspaceAccessToken_1.CloudWorkspaceAccessTokenEmptyError:
                    system_1.SystemLogger.info({
                        msg: 'Failed to sync with Rocket.Chat Cloud',
                        function: 'syncCloudData',
                        err,
                    });
                    break;
                default:
                    system_1.SystemLogger.error({
                        msg: 'Failed to sync with Rocket.Chat Cloud',
                        function: 'syncCloudData',
                        err,
                    });
            }
            throw err;
        }
    });
}
