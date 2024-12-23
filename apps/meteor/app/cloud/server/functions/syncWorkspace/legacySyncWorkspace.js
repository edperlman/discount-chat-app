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
exports.legacySyncWorkspace = legacySyncWorkspace;
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const suretype_1 = require("suretype");
const CloudWorkspaceConnectionError_1 = require("../../../../../lib/errors/CloudWorkspaceConnectionError");
const CloudWorkspaceRegistrationError_1 = require("../../../../../lib/errors/CloudWorkspaceRegistrationError");
const notifyListener_1 = require("../../../../lib/server/lib/notifyListener");
const server_1 = require("../../../../settings/server");
const buildRegistrationData_1 = require("../buildRegistrationData");
const getWorkspaceAccessToken_1 = require("../getWorkspaceAccessToken");
const getWorkspaceLicense_1 = require("../getWorkspaceLicense");
const retrieveRegistrationStatus_1 = require("../retrieveRegistrationStatus");
const handleCommsSync_1 = require("./handleCommsSync");
const workspaceClientPayloadSchema = suretype_1.v.object({
    workspaceId: suretype_1.v.string().required(),
    publicKey: suretype_1.v.string(),
    trial: suretype_1.v.object({
        trialing: suretype_1.v.boolean().required(),
        trialID: suretype_1.v.string().required(),
        endDate: suretype_1.v.string().format('date-time').required(),
        marketing: suretype_1.v
            .object({
            utmContent: suretype_1.v.string().required(),
            utmMedium: suretype_1.v.string().required(),
            utmSource: suretype_1.v.string().required(),
            utmCampaign: suretype_1.v.string().required(),
        })
            .required(),
        DowngradesToPlan: suretype_1.v
            .object({
            id: suretype_1.v.string().required(),
        })
            .required(),
        trialRequested: suretype_1.v.boolean().required(),
    }),
    nps: suretype_1.v.object({
        id: suretype_1.v.string().required(),
        startAt: suretype_1.v.string().format('date-time').required(),
        expireAt: suretype_1.v.string().format('date-time').required(),
    }),
    banners: suretype_1.v.array(suretype_1.v.object({
        _id: suretype_1.v.string().required(),
        _updatedAt: suretype_1.v.string().format('date-time').required(),
        platform: suretype_1.v.array(suretype_1.v.string()).required(),
        expireAt: suretype_1.v.string().format('date-time').required(),
        startAt: suretype_1.v.string().format('date-time').required(),
        roles: suretype_1.v.array(suretype_1.v.string()),
        createdBy: suretype_1.v.object({
            _id: suretype_1.v.string().required(),
            username: suretype_1.v.string(),
        }),
        createdAt: suretype_1.v.string().format('date-time').required(),
        view: suretype_1.v.any(),
        active: suretype_1.v.boolean(),
        inactivedAt: suretype_1.v.string().format('date-time'),
        snapshot: suretype_1.v.string(),
    })),
    announcements: suretype_1.v.object({
        create: suretype_1.v.array(suretype_1.v.object({
            _id: suretype_1.v.string().required(),
            _updatedAt: suretype_1.v.string().format('date-time').required(),
            selector: suretype_1.v.object({
                roles: suretype_1.v.array(suretype_1.v.string()),
            }),
            platform: suretype_1.v.array(suretype_1.v.string().enum('web', 'mobile')).required(),
            expireAt: suretype_1.v.string().format('date-time').required(),
            startAt: suretype_1.v.string().format('date-time').required(),
            createdBy: suretype_1.v.string().enum('cloud', 'system').required(),
            createdAt: suretype_1.v.string().format('date-time').required(),
            dictionary: suretype_1.v.object({}).additional(suretype_1.v.object({}).additional(suretype_1.v.string())),
            view: suretype_1.v.any(),
            surface: suretype_1.v.string().enum('banner', 'modal').required(),
        })),
        delete: suretype_1.v.array(suretype_1.v.string()),
    }),
});
const assertWorkspaceClientPayload = (0, suretype_1.compile)(workspaceClientPayloadSchema);
/** @deprecated */
const fetchWorkspaceClientPayload = (_a) => __awaiter(void 0, [_a], void 0, function* ({ token, workspaceRegistrationData, }) {
    const workspaceRegistrationClientUri = server_1.settings.get('Cloud_Workspace_Registration_Client_Uri');
    const response = yield (0, server_fetch_1.serverFetch)(`${workspaceRegistrationClientUri}/client`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: workspaceRegistrationData,
        timeout: 5000,
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
    if (!assertWorkspaceClientPayload(payload)) {
        throw new CloudWorkspaceConnectionError_1.CloudWorkspaceConnectionError('Invalid response from Rocket.Chat Cloud');
    }
    return payload;
});
/** @deprecated */
const consumeWorkspaceSyncPayload = (result) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (result.publicKey) {
        (yield models_1.Settings.updateValueById('Cloud_Workspace_PublicKey', result.publicKey)).modifiedCount &&
            void (0, notifyListener_1.notifyOnSettingChangedById)('Cloud_Workspace_PublicKey');
    }
    if ((_a = result.trial) === null || _a === void 0 ? void 0 : _a.trialID) {
        (yield models_1.Settings.updateValueById('Cloud_Workspace_Had_Trial', true)).modifiedCount &&
            void (0, notifyListener_1.notifyOnSettingChangedById)('Cloud_Workspace_Had_Trial');
    }
    // add banners
    if (result.banners) {
        yield (0, handleCommsSync_1.handleBannerOnWorkspaceSync)(result.banners);
    }
    if (result.nps) {
        yield (0, handleCommsSync_1.handleNpsOnWorkspaceSync)(result.nps);
    }
});
/** @deprecated */
function legacySyncWorkspace() {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceRegistered } = yield (0, retrieveRegistrationStatus_1.retrieveRegistrationStatus)();
        if (!workspaceRegistered) {
            throw new CloudWorkspaceRegistrationError_1.CloudWorkspaceRegistrationError('Workspace is not registered');
        }
        const token = yield (0, getWorkspaceAccessToken_1.getWorkspaceAccessToken)(true);
        if (!token) {
            throw new getWorkspaceAccessToken_1.CloudWorkspaceAccessTokenEmptyError();
        }
        const workspaceRegistrationData = yield (0, buildRegistrationData_1.buildWorkspaceRegistrationData)(undefined);
        const payload = yield fetchWorkspaceClientPayload({ token, workspaceRegistrationData });
        if (payload) {
            yield consumeWorkspaceSyncPayload(payload);
        }
        yield (0, getWorkspaceLicense_1.getWorkspaceLicense)();
        return true;
    });
}
