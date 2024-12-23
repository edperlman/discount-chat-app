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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("@rocket.chat/cron");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const appRequestNotifyUsers_1 = require("./marketplace/appRequestNotifyUsers");
const orchestrator_1 = require("./orchestrator");
const server_1 = require("../../../app/cloud/server");
const server_2 = require("../../../app/settings/server");
const appsNotifyAppRequests = function _appsNotifyAppRequests() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        try {
            const installedApps = yield orchestrator_1.Apps.installedApps({ enabled: true });
            if (!installedApps || installedApps.length === 0) {
                return;
            }
            const workspaceUrl = server_2.settings.get('Site_Url');
            const token = yield (0, server_1.getWorkspaceAccessToken)();
            if (!token) {
                orchestrator_1.Apps.debugLog(`could not load workspace token to send app requests notifications`);
                return;
            }
            const baseUrl = orchestrator_1.Apps.getMarketplaceUrl();
            if (!baseUrl) {
                orchestrator_1.Apps.debugLog(`could not load marketplace base url to send app requests notifications`);
                return;
            }
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const pendingSentUrl = `${baseUrl}/v1/app-request/sent/pending`;
            const result = yield (0, server_fetch_1.serverFetch)(pendingSentUrl, options);
            const { data } = yield result.json();
            const filtered = installedApps.filter((app) => data.indexOf(app.getID()) !== -1);
            try {
                for (var _d = true, filtered_1 = __asyncValues(filtered), filtered_1_1; filtered_1_1 = yield filtered_1.next(), _a = filtered_1_1.done, !_a; _d = true) {
                    _c = filtered_1_1.value;
                    _d = false;
                    const app = _c;
                    const appId = app.getID();
                    const appName = app.getName();
                    const usersNotified = yield (0, appRequestNotifyUsers_1.appRequestNotififyForUsers)(baseUrl, workspaceUrl, appId, appName)
                        .then((response) => __awaiter(this, void 0, void 0, function* () {
                        // Mark all app requests as sent
                        yield (0, server_fetch_1.serverFetch)(`${baseUrl}/v1/app-request/markAsSent/${appId}`, Object.assign(Object.assign({}, options), { method: 'POST' }));
                        return response;
                    }))
                        .catch((err) => {
                        orchestrator_1.Apps.debugLog(`could not send app request notifications for app ${appId}. Error: ${err}`);
                        return err;
                    });
                    const errors = usersNotified.filter((batch) => batch instanceof Error);
                    if (errors.length > 0) {
                        orchestrator_1.Apps.debugLog(`Some batches of users could not be notified for app ${appId}. Errors: ${errors}`);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = filtered_1.return)) yield _b.call(filtered_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (err) {
            orchestrator_1.Apps.debugLog(err);
        }
    });
};
await cron_1.cronJobs.add('Apps-Request-End-Users:notify', '0 */12 * * *', () => __awaiter(void 0, void 0, void 0, function* () { return appsNotifyAppRequests(); }));
