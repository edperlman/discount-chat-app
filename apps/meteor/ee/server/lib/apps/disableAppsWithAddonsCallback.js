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
exports.disableAppsWithAddonsCallback = void 0;
exports._disableAppsWithAddonsCallback = _disableAppsWithAddonsCallback;
const AppStatus_1 = require("@rocket.chat/apps-engine/definition/AppStatus");
const i18n_1 = require("../../../../server/lib/i18n");
const sendMessagesToAdmins_1 = require("../../../../server/lib/sendMessagesToAdmins");
const apps_1 = require("../../apps");
function _disableAppsWithAddonsCallback(deps_1, _a) {
    return __awaiter(this, arguments, void 0, function* (deps, { module, external, valid }) {
        if (!external || valid)
            return;
        const enabledApps = yield deps.Apps.installedApps({ enabled: true });
        if (!enabledApps)
            return;
        const affectedApps = [];
        yield Promise.all(enabledApps.map((app) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (app.getInfo().addon !== module)
                return;
            affectedApps.push(app.getName());
            return (_a = deps.Apps.getManager()) === null || _a === void 0 ? void 0 : _a.disable(app.getID(), AppStatus_1.AppStatus.DISABLED, false);
        })));
        if (!affectedApps.length)
            return;
        yield deps.sendMessagesToAdmins({
            msgs: (_a) => __awaiter(this, [_a], void 0, function* ({ adminUser }) {
                return ({
                    msg: i18n_1.i18n.t('App_has_been_disabled_addon_message', {
                        lng: adminUser.language || 'en',
                        count: affectedApps.length,
                        appNames: affectedApps,
                    }),
                });
            }),
        });
    });
}
const disableAppsWithAddonsCallback = (ctx) => _disableAppsWithAddonsCallback({ Apps: apps_1.Apps, sendMessagesToAdmins: sendMessagesToAdmins_1.sendMessagesToAdmins }, ctx);
exports.disableAppsWithAddonsCallback = disableAppsWithAddonsCallback;
