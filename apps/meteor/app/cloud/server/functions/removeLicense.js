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
exports.removeLicense = removeLicense;
const server_fetch_1 = require("@rocket.chat/server-fetch");
const getWorkspaceAccessToken_1 = require("./getWorkspaceAccessToken");
const retrieveRegistrationStatus_1 = require("./retrieveRegistrationStatus");
const syncWorkspace_1 = require("./syncWorkspace");
const callbacks_1 = require("../../../../lib/callbacks");
const CloudWorkspaceConnectionError_1 = require("../../../../lib/errors/CloudWorkspaceConnectionError");
const CloudWorkspaceRegistrationError_1 = require("../../../../lib/errors/CloudWorkspaceRegistrationError");
const server_1 = require("../../../settings/server");
function removeLicense() {
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
            const workspaceRegistrationClientUri = server_1.settings.get('Cloud_Workspace_Registration_Client_Uri');
            const response = yield (0, server_fetch_1.serverFetch)(`${workspaceRegistrationClientUri}/client/downgrade`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
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
            yield (0, syncWorkspace_1.syncWorkspace)();
        }
        catch (err) {
            switch (true) {
                case err instanceof CloudWorkspaceConnectionError_1.CloudWorkspaceConnectionError:
                case err instanceof CloudWorkspaceRegistrationError_1.CloudWorkspaceRegistrationError:
                case err instanceof getWorkspaceAccessToken_1.CloudWorkspaceAccessTokenEmptyError:
                    yield callbacks_1.callbacks.run('workspaceLicenseRemoved');
                    break;
                default:
                    throw err;
            }
        }
    });
}
