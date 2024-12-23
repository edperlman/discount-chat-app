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
exports.AppsEngineService = void 0;
const apps_1 = require("@rocket.chat/apps");
const AppStatus_1 = require("@rocket.chat/apps-engine/definition/AppStatus");
const core_services_1 = require("@rocket.chat/core-services");
const system_1 = require("../../lib/logger/system");
class AppsEngineService extends core_services_1.ServiceClassInternal {
    constructor() {
        super();
        this.name = 'apps-engine';
        this.onEvent('presence.status', (_a) => __awaiter(this, [_a], void 0, function* ({ user, previousStatus }) {
            var _b;
            yield ((_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.triggerEvent(apps_1.AppEvents.IPostUserStatusChanged, {
                user,
                currentStatus: user.status,
                previousStatus,
            }));
        }));
        this.onEvent('apps.added', (appId) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            (_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.getRocketChatLogger().debug(`"apps.added" event received for app "${appId}"`);
            // if the app already exists in this instance, don't load it again
            const app = (_c = (_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.getManager()) === null || _c === void 0 ? void 0 : _c.getOneById(appId);
            if (app) {
                (_d = apps_1.Apps.self) === null || _d === void 0 ? void 0 : _d.getRocketChatLogger().info(`"apps.added" event received for app "${appId}", but it already exists in this instance`);
                return;
            }
            yield ((_f = (_e = apps_1.Apps.self) === null || _e === void 0 ? void 0 : _e.getManager()) === null || _f === void 0 ? void 0 : _f.addLocal(appId));
        }));
        this.onEvent('apps.removed', (appId) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            (_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.getRocketChatLogger().debug(`"apps.removed" event received for app "${appId}"`);
            const app = (_c = (_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.getManager()) === null || _c === void 0 ? void 0 : _c.getOneById(appId);
            if (!app) {
                (_d = apps_1.Apps.self) === null || _d === void 0 ? void 0 : _d.getRocketChatLogger().info(`"apps.removed" event received for app "${appId}", but it couldn't be found in this instance`);
                return;
            }
            yield ((_f = (_e = apps_1.Apps.self) === null || _e === void 0 ? void 0 : _e.getManager()) === null || _f === void 0 ? void 0 : _f.removeLocal(appId));
        }));
        this.onEvent('apps.updated', (appId) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            (_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.getRocketChatLogger().debug(`"apps.updated" event received for app "${appId}"`);
            const storageItem = yield ((_c = (_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.getStorage()) === null || _c === void 0 ? void 0 : _c.retrieveOne(appId));
            if (!storageItem) {
                (_d = apps_1.Apps.self) === null || _d === void 0 ? void 0 : _d.getRocketChatLogger().info(`"apps.updated" event received for app "${appId}", but it couldn't be found in the storage`);
                return;
            }
            const appPackage = yield ((_f = (_e = apps_1.Apps.self) === null || _e === void 0 ? void 0 : _e.getAppSourceStorage()) === null || _f === void 0 ? void 0 : _f.fetch(storageItem));
            if (!appPackage) {
                return;
            }
            const isEnabled = AppStatus_1.AppStatusUtils.isEnabled(storageItem.status);
            if (isEnabled) {
                yield ((_h = (_g = apps_1.Apps.self) === null || _g === void 0 ? void 0 : _g.getManager()) === null || _h === void 0 ? void 0 : _h.updateAndStartupLocal(storageItem, appPackage));
            }
            else {
                yield ((_k = (_j = apps_1.Apps.self) === null || _j === void 0 ? void 0 : _j.getManager()) === null || _k === void 0 ? void 0 : _k.updateAndInitializeLocal(storageItem, appPackage));
            }
        }));
        this.onEvent('apps.statusUpdate', (appId, status) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            (_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.getRocketChatLogger().debug(`"apps.statusUpdate" event received for app "${appId}" with status "${status}"`);
            const app = (_c = (_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.getManager()) === null || _c === void 0 ? void 0 : _c.getOneById(appId);
            if (!app) {
                (_d = apps_1.Apps.self) === null || _d === void 0 ? void 0 : _d.getRocketChatLogger().info(`"apps.statusUpdate" event received for app "${appId}", but it couldn't be found in this instance`);
                return;
            }
            if ((yield app.getStatus()) === status) {
                (_e = apps_1.Apps.self) === null || _e === void 0 ? void 0 : _e.getRocketChatLogger().info(`"apps.statusUpdate" event received for app "${appId}", but the status is the same`);
                return;
            }
            if (AppStatus_1.AppStatusUtils.isEnabled(status)) {
                yield ((_g = (_f = apps_1.Apps.self) === null || _f === void 0 ? void 0 : _f.getManager()) === null || _g === void 0 ? void 0 : _g.enable(appId).catch(system_1.SystemLogger.error));
            }
            else if (AppStatus_1.AppStatusUtils.isDisabled(status)) {
                yield ((_j = (_h = apps_1.Apps.self) === null || _h === void 0 ? void 0 : _h.getManager()) === null || _j === void 0 ? void 0 : _j.disable(appId, status, true).catch(system_1.SystemLogger.error));
            }
        }));
        this.onEvent('apps.settingUpdated', (appId, setting) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            (_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.getRocketChatLogger().debug(`"apps.settingUpdated" event received for app "${appId}"`, { setting });
            const app = (_c = (_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.getManager()) === null || _c === void 0 ? void 0 : _c.getOneById(appId);
            const oldSetting = app === null || app === void 0 ? void 0 : app.getStorageItem().settings[setting.id].value;
            // avoid updating the setting if the value is the same,
            // which caused an infinite loop
            // and sometimes the settings can be an array
            // so we need to convert it to JSON stringified to compare it
            if (JSON.stringify(oldSetting) === JSON.stringify(setting.value)) {
                (_d = apps_1.Apps.self) === null || _d === void 0 ? void 0 : _d.getRocketChatLogger().info(`"apps.settingUpdated" event received for setting ${setting.id} of app "${appId}", but the setting value is the same`);
                return;
            }
            yield ((_f = (_e = apps_1.Apps.self) === null || _e === void 0 ? void 0 : _e.getManager()) === null || _f === void 0 ? void 0 : _f.getSettingsManager().updateAppSetting(appId, setting));
        }));
    }
    isInitialized() {
        var _a;
        return Boolean((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.isInitialized());
    }
    getApps(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            return (_c = (yield ((_b = (_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.getManager()) === null || _b === void 0 ? void 0 : _b.get(query)))) === null || _c === void 0 ? void 0 : _c.map((app) => app.getInfo());
        });
    }
    getAppStorageItemById(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const app = (_b = (_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.getManager()) === null || _b === void 0 ? void 0 : _b.getOneById(appId);
            if (!app) {
                return;
            }
            return app.getStorageItem();
        });
    }
}
exports.AppsEngineService = AppsEngineService;
