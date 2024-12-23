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
const AppStatus_1 = require("@rocket.chat/apps-engine/definition/AppStatus");
const cron_1 = require("@rocket.chat/cron");
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const orchestrator_1 = require("./orchestrator");
const server_1 = require("../../../app/cloud/server");
const i18n_1 = require("../../../server/lib/i18n");
const sendMessagesToAdmins_1 = require("../../../server/lib/sendMessagesToAdmins");
const notifyAdminsAboutInvalidApps = function _notifyAdminsAboutInvalidApps(apps) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apps) {
            return;
        }
        const hasInvalidApps = !!apps.find((app) => app.getLatestLicenseValidationResult().hasErrors);
        if (!hasInvalidApps) {
            return;
        }
        const id = 'someAppInInvalidState';
        const title = 'Warning';
        const text = 'There is one or more apps in an invalid state. Click here to review.';
        const rocketCatMessage = 'There is one or more apps in an invalid state. Go to Administration > Apps to review.';
        const link = '/admin/apps';
        yield (0, sendMessagesToAdmins_1.sendMessagesToAdmins)({
            msgs: (_a) => __awaiter(this, [_a], void 0, function* ({ adminUser }) {
                return ({
                    msg: `*${i18n_1.i18n.t(title, { lng: adminUser.language || 'en' })}*\n${i18n_1.i18n.t(rocketCatMessage, {
                        lng: adminUser.language || 'en',
                    })}`,
                });
            }),
            banners: (_a) => __awaiter(this, [_a], void 0, function* ({ adminUser }) {
                yield models_1.Users.removeBannerById(adminUser._id, id);
                return [
                    {
                        id,
                        priority: 10,
                        title,
                        text,
                        modifiers: ['danger'],
                        link,
                    },
                ];
            }),
        });
        return apps;
    });
};
const notifyAdminsAboutRenewedApps = function _notifyAdminsAboutRenewedApps(apps) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apps) {
            return;
        }
        const renewedApps = apps.filter((app) => __awaiter(this, void 0, void 0, function* () { return (yield app.getStatus()) === AppStatus_1.AppStatus.DISABLED && app.getPreviousStatus() === AppStatus_1.AppStatus.INVALID_LICENSE_DISABLED; }));
        if (renewedApps.length === 0) {
            return;
        }
        const rocketCatMessage = 'There is one or more disabled apps with valid licenses. Go to Administration > Apps to review.';
        yield (0, sendMessagesToAdmins_1.sendMessagesToAdmins)({
            msgs: (_a) => __awaiter(this, [_a], void 0, function* ({ adminUser }) { return ({ msg: `${i18n_1.i18n.t(rocketCatMessage, { lng: adminUser.language || 'en' })}` }); }),
        });
    });
};
const appsUpdateMarketplaceInfo = function _appsUpdateMarketplaceInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield (0, server_1.getWorkspaceAccessToken)();
        const baseUrl = orchestrator_1.Apps.getMarketplaceUrl();
        const workspaceIdSetting = yield models_1.Settings.getValueById('Cloud_Workspace_Id');
        const currentSeats = yield models_1.Users.getActiveLocalUserCount();
        const fullUrl = `${baseUrl}/v1/workspaces/${workspaceIdSetting}/apps`;
        const options = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                seats: currentSeats,
            },
        };
        let data = [];
        try {
            const response = yield (0, server_fetch_1.serverFetch)(fullUrl, options);
            const result = yield response.json();
            if (Array.isArray(result)) {
                data = result;
            }
        }
        catch (err) {
            orchestrator_1.Apps.debugLog(err);
        }
        yield orchestrator_1.Apps.updateAppsMarketplaceInfo(data).then(notifyAdminsAboutInvalidApps).then(notifyAdminsAboutRenewedApps);
    });
};
await cron_1.cronJobs.add('Apps-Engine:check', '0 4 * * *', () => __awaiter(void 0, void 0, void 0, function* () { return appsUpdateMarketplaceInfo(); }));
