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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCachedSupportedVersionsToken = exports.handleResponse = exports.wrapPromise = void 0;
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const system_1 = require("../../../../../server/lib/logger/system");
const notifyListener_1 = require("../../../../lib/server/lib/notifyListener");
const server_1 = require("../../../../settings/server");
const rocketchat_supported_versions_info_1 = require("../../../../utils/rocketchat-supported-versions.info");
const buildVersionUpdateMessage_1 = require("../../../../version-check/server/functions/buildVersionUpdateMessage");
const getWorkspaceAccessToken_1 = require("../getWorkspaceAccessToken");
const supportedVersionsChooseLatest_1 = require("./supportedVersionsChooseLatest");
const auditedSettingUpdates_1 = require("../../../../../server/settings/lib/auditedSettingUpdates");
/** HELPERS */
const wrapPromise = (promise) => promise
    .then((result) => ({ success: true, result }))
    .catch((error) => ({
    success: false,
    error,
}));
exports.wrapPromise = wrapPromise;
const handleResponse = (promise) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.wrapPromise)((() => __awaiter(void 0, void 0, void 0, function* () {
        const request = yield promise;
        if (!request.ok) {
            if (request.size > 0) {
                throw new Error((yield request.json()).error);
            }
            throw new Error(request.statusText);
        }
        return request.json();
    }))());
});
exports.handleResponse = handleResponse;
const cacheValueInSettings = (key, fn) => {
    const reset = () => __awaiter(void 0, void 0, void 0, function* () {
        system_1.SystemLogger.debug(`Resetting cached value ${key} in settings`);
        const value = yield fn();
        if ((yield (0, auditedSettingUpdates_1.updateAuditedBySystem)({
            reason: 'cacheValueInSettings reset',
        })(models_1.Settings.updateValueById, key, value)).modifiedCount) {
            void (0, notifyListener_1.notifyOnSettingChangedById)(key);
        }
        return value;
    });
    return Object.assign(() => __awaiter(void 0, void 0, void 0, function* () {
        const storedValue = server_1.settings.get(key);
        if (storedValue) {
            return storedValue;
        }
        return reset();
    }), {
        reset,
    });
};
const releaseEndpoint = ((_a = process.env.OVERWRITE_INTERNAL_RELEASE_URL) === null || _a === void 0 ? void 0 : _a.trim())
    ? process.env.OVERWRITE_INTERNAL_RELEASE_URL.trim()
    : 'https://releases.rocket.chat/v2/server/supportedVersions';
const getSupportedVersionsFromCloud = () => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.CLOUD_SUPPORTED_VERSIONS_TOKEN) {
        return {
            success: true,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            result: JSON.parse(process.env.CLOUD_SUPPORTED_VERSIONS),
        };
    }
    const headers = yield (0, getWorkspaceAccessToken_1.generateWorkspaceBearerHttpHeader)();
    const response = yield (0, exports.handleResponse)((0, server_fetch_1.serverFetch)(releaseEndpoint, {
        headers,
        timeout: 5000,
    }));
    if (!response.success) {
        system_1.SystemLogger.error({
            msg: 'Failed to communicate with Rocket.Chat Cloud',
            url: releaseEndpoint,
            err: response.error,
        });
    }
    return response;
});
const getSupportedVersionsToken = () => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Gets the supported versions from the license
     * Gets the supported versions from the cloud
     * Gets the latest version
     * return the token
     */
    var _a, _b;
    const [versionsFromLicense, response] = yield Promise.all([license_1.License.getLicense(), getSupportedVersionsFromCloud()]);
    const supportedVersions = yield (0, supportedVersionsChooseLatest_1.supportedVersionsChooseLatest)(rocketchat_supported_versions_info_1.supportedVersions, versionsFromLicense === null || versionsFromLicense === void 0 ? void 0 : versionsFromLicense.supportedVersions, (response.success && response.result) || undefined);
    system_1.SystemLogger.debug({
        msg: 'Supported versions',
        supportedVersionsFromBuild: rocketchat_supported_versions_info_1.supportedVersions.timestamp,
        versionsFromLicense: (_a = versionsFromLicense === null || versionsFromLicense === void 0 ? void 0 : versionsFromLicense.supportedVersions) === null || _a === void 0 ? void 0 : _a.timestamp,
        response: response.success && ((_b = response.result) === null || _b === void 0 ? void 0 : _b.timestamp),
    });
    switch (supportedVersions) {
        case rocketchat_supported_versions_info_1.supportedVersions:
            system_1.SystemLogger.info({
                msg: 'Using supported versions from build',
            });
            break;
        case versionsFromLicense === null || versionsFromLicense === void 0 ? void 0 : versionsFromLicense.supportedVersions:
            system_1.SystemLogger.info({
                msg: 'Using supported versions from license',
            });
            break;
        case response.success && response.result:
            system_1.SystemLogger.info({
                msg: 'Using supported versions from cloud',
            });
            break;
    }
    yield (0, buildVersionUpdateMessage_1.buildVersionUpdateMessage)(supportedVersions === null || supportedVersions === void 0 ? void 0 : supportedVersions.versions);
    return supportedVersions === null || supportedVersions === void 0 ? void 0 : supportedVersions.signed;
});
exports.getCachedSupportedVersionsToken = cacheValueInSettings('Cloud_Workspace_Supported_Versions_Token', getSupportedVersionsToken);
