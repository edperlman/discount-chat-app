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
exports.syncWorkspace = syncWorkspace;
const CloudWorkspaceRegistrationError_1 = require("../../../../../lib/errors/CloudWorkspaceRegistrationError");
const system_1 = require("../../../../../server/lib/logger/system");
const getWorkspaceAccessToken_1 = require("../getWorkspaceAccessToken");
const announcementSync_1 = require("./announcementSync");
const legacySyncWorkspace_1 = require("./legacySyncWorkspace");
const syncCloudData_1 = require("./syncCloudData");
const supportedVersionsToken_1 = require("../supportedVersionsToken/supportedVersionsToken");
/**
 * Syncs the workspace with the cloud
 * @returns {Promise<void>}
 * @throws {Error} - If there is an unexpected error during sync like a network error
 */
function syncWorkspace() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, announcementSync_1.announcementSync)();
            yield (0, syncCloudData_1.syncCloudData)();
        }
        catch (err) {
            switch (true) {
                case err instanceof CloudWorkspaceRegistrationError_1.CloudWorkspaceRegistrationError:
                case err instanceof getWorkspaceAccessToken_1.CloudWorkspaceAccessTokenError: {
                    // There is no access token, so we can't sync
                    system_1.SystemLogger.info('Workspace does not have a valid access token, sync aborted');
                    break;
                }
                default: {
                    if (!(err instanceof getWorkspaceAccessToken_1.CloudWorkspaceAccessTokenEmptyError) && !(0, getWorkspaceAccessToken_1.isAbortError)(err)) {
                        system_1.SystemLogger.error({ msg: 'Error during workspace sync', err });
                    }
                    system_1.SystemLogger.info({
                        msg: 'Falling back to legacy sync',
                        function: 'syncCloudData',
                    });
                    try {
                        yield (0, legacySyncWorkspace_1.legacySyncWorkspace)();
                    }
                    catch (err) {
                        switch (true) {
                            case err instanceof CloudWorkspaceRegistrationError_1.CloudWorkspaceRegistrationError:
                            case err instanceof getWorkspaceAccessToken_1.CloudWorkspaceAccessTokenError: {
                                // There is no access token, so we can't sync
                                break;
                            }
                            default: {
                                if (!(err instanceof getWorkspaceAccessToken_1.CloudWorkspaceAccessTokenEmptyError) && !(0, getWorkspaceAccessToken_1.isAbortError)(err)) {
                                    system_1.SystemLogger.error({ msg: 'Error during fallback workspace sync', err });
                                }
                                throw err;
                            }
                        }
                    }
                }
            }
        }
        finally {
            yield supportedVersionsToken_1.getCachedSupportedVersionsToken.reset();
        }
    });
}
