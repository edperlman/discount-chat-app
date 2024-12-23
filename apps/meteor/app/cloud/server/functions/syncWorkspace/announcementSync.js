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
exports.announcementSync = announcementSync;
const server_fetch_1 = require("@rocket.chat/server-fetch");
const suretype_1 = require("suretype");
const CloudWorkspaceConnectionError_1 = require("../../../../../lib/errors/CloudWorkspaceConnectionError");
const CloudWorkspaceRegistrationError_1 = require("../../../../../lib/errors/CloudWorkspaceRegistrationError");
const system_1 = require("../../../../../server/lib/logger/system");
const server_1 = require("../../../../settings/server");
const buildRegistrationData_1 = require("../buildRegistrationData");
const getWorkspaceAccessToken_1 = require("../getWorkspaceAccessToken");
const retrieveRegistrationStatus_1 = require("../retrieveRegistrationStatus");
const handleCommsSync_1 = require("./handleCommsSync");
const workspaceCommPayloadSchema = suretype_1.v.object({
    workspaceId: suretype_1.v.string().required(),
    publicKey: suretype_1.v.string(),
    nps: suretype_1.v.object({
        id: suretype_1.v.string().required(),
        startAt: suretype_1.v.string().format('date-time').required(),
        expireAt: suretype_1.v.string().format('date-time').required(),
    }),
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
const assertWorkspaceCommPayload = (0, suretype_1.compile)(workspaceCommPayloadSchema);
const fetchCloudAnnouncementsSync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ token, data, }) {
    const cloudUrl = server_1.settings.get('Cloud_Url');
    const response = yield (0, server_fetch_1.serverFetch)(`${cloudUrl}/api/v3/comms/workspace`, {
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
    assertWorkspaceCommPayload(payload);
    return payload;
});
function announcementSync() {
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
            const { nps, announcements } = yield fetchCloudAnnouncementsSync({
                token,
                data: workspaceRegistrationData,
            });
            if (nps) {
                yield (0, handleCommsSync_1.handleNpsOnWorkspaceSync)(nps);
            }
            if (announcements) {
                yield (0, handleCommsSync_1.handleAnnouncementsOnWorkspaceSync)(announcements);
            }
            return true;
        }
        catch (err) {
            switch (true) {
                case err instanceof CloudWorkspaceConnectionError_1.CloudWorkspaceConnectionError:
                case err instanceof CloudWorkspaceRegistrationError_1.CloudWorkspaceRegistrationError:
                case err instanceof getWorkspaceAccessToken_1.CloudWorkspaceAccessTokenEmptyError: {
                    system_1.SystemLogger.info({
                        msg: 'Failed to sync with Rocket.Chat Cloud',
                        function: 'announcementSync',
                        err,
                    });
                    break;
                }
                default: {
                    system_1.SystemLogger.error({
                        msg: 'Error during workspace sync',
                        function: 'announcementSync',
                        err,
                    });
                }
            }
            throw err;
        }
    });
}
