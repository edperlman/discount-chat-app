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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppServerNotifier = exports.AppServerListener = exports.AppEvents = void 0;
const AppStatus_1 = require("@rocket.chat/apps-engine/definition/AppStatus");
const core_services_1 = require("@rocket.chat/core-services");
const Notifications_1 = __importDefault(require("../../../../app/notifications/server/lib/Notifications"));
const system_1 = require("../../../../server/lib/logger/system");
const events_1 = require("./events");
Object.defineProperty(exports, "AppEvents", { enumerable: true, get: function () { return events_1.AppEvents; } });
class AppServerListener {
    constructor(orch, engineStreamer, clientStreamer, received) {
        this.orch = orch;
        this.engineStreamer = engineStreamer;
        this.clientStreamer = clientStreamer;
        this.received = received;
        this.engineStreamer.on(events_1.AppEvents.APP_STATUS_CHANGE, this.onAppStatusUpdated.bind(this));
        this.engineStreamer.on(events_1.AppEvents.APP_REMOVED, this.onAppRemoved.bind(this));
        this.engineStreamer.on(events_1.AppEvents.APP_UPDATED, this.onAppUpdated.bind(this));
        this.engineStreamer.on(events_1.AppEvents.APP_ADDED, this.onAppAdded.bind(this));
        this.engineStreamer.on(events_1.AppEvents.ACTIONS_CHANGED, this.onActionsChanged.bind(this));
        this.engineStreamer.on(events_1.AppEvents.APP_SETTING_UPDATED, this.onAppSettingUpdated.bind(this));
        this.engineStreamer.on(events_1.AppEvents.COMMAND_ADDED, this.onCommandAdded.bind(this));
        this.engineStreamer.on(events_1.AppEvents.COMMAND_DISABLED, this.onCommandDisabled.bind(this));
        this.engineStreamer.on(events_1.AppEvents.COMMAND_UPDATED, this.onCommandUpdated.bind(this));
        this.engineStreamer.on(events_1.AppEvents.COMMAND_REMOVED, this.onCommandRemoved.bind(this));
    }
    onAppAdded(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.orch.getManager().addLocal(appId); // TO-DO: fix type
            this.clientStreamer.emitWithoutBroadcast(events_1.AppEvents.APP_ADDED, appId);
        });
    }
    onAppStatusUpdated(_a) {
        return __awaiter(this, arguments, void 0, function* ({ appId, status }) {
            var _b, _c, _d;
            const app = (_b = this.orch.getManager()) === null || _b === void 0 ? void 0 : _b.getOneById(appId);
            if (!app || (yield app.getStatus()) === status) {
                return;
            }
            this.received.set(`${events_1.AppEvents.APP_STATUS_CHANGE}_${appId}`, {
                appId,
                status,
                when: new Date(),
            });
            if (AppStatus_1.AppStatusUtils.isEnabled(status)) {
                yield ((_c = this.orch.getManager()) === null || _c === void 0 ? void 0 : _c.enable(appId).catch(system_1.SystemLogger.error));
                this.clientStreamer.emitWithoutBroadcast(events_1.AppEvents.APP_STATUS_CHANGE, { appId, status });
            }
            else if (AppStatus_1.AppStatusUtils.isDisabled(status)) {
                yield ((_d = this.orch.getManager()) === null || _d === void 0 ? void 0 : _d.disable(appId, status, true).catch(system_1.SystemLogger.error));
                this.clientStreamer.emitWithoutBroadcast(events_1.AppEvents.APP_STATUS_CHANGE, { appId, status });
            }
        });
    }
    onAppSettingUpdated(_a) {
        return __awaiter(this, arguments, void 0, function* ({ appId, setting }) {
            this.received.set(`${events_1.AppEvents.APP_SETTING_UPDATED}_${appId}_${setting.id}`, {
                appId,
                setting,
                when: new Date(),
            });
            yield this.orch
                .getManager()
                .getSettingsManager()
                .updateAppSetting(appId, setting); // TO-DO: fix type of `setting`
            this.clientStreamer.emitWithoutBroadcast(events_1.AppEvents.APP_SETTING_UPDATED, { appId, setting });
        });
    }
    onAppUpdated(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.received.set(`${events_1.AppEvents.APP_UPDATED}_${appId}`, { appId, when: new Date() });
            const storageItem = yield this.orch.getStorage().retrieveOne(appId);
            const appPackage = yield this.orch.getAppSourceStorage().fetch(storageItem);
            const isEnabled = AppStatus_1.AppStatusUtils.isEnabled(storageItem.status);
            if (isEnabled) {
                yield this.orch.getManager().updateAndStartupLocal(storageItem, appPackage);
            }
            else {
                yield this.orch.getManager().updateAndInitializeLocal(storageItem, appPackage);
            }
            this.clientStreamer.emitWithoutBroadcast(events_1.AppEvents.APP_UPDATED, appId);
        });
    }
    onAppRemoved(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = this.orch.getManager().getOneById(appId);
            if (!app) {
                return;
            }
            yield this.orch.getManager().removeLocal(appId);
            this.clientStreamer.emitWithoutBroadcast(events_1.AppEvents.APP_REMOVED, appId);
        });
    }
    onCommandAdded(command) {
        return __awaiter(this, void 0, void 0, function* () {
            this.clientStreamer.emitWithoutBroadcast(events_1.AppEvents.COMMAND_ADDED, command);
        });
    }
    onCommandDisabled(command) {
        return __awaiter(this, void 0, void 0, function* () {
            this.clientStreamer.emitWithoutBroadcast(events_1.AppEvents.COMMAND_DISABLED, command);
        });
    }
    onCommandUpdated(command) {
        return __awaiter(this, void 0, void 0, function* () {
            this.clientStreamer.emitWithoutBroadcast(events_1.AppEvents.COMMAND_UPDATED, command);
        });
    }
    onCommandRemoved(command) {
        return __awaiter(this, void 0, void 0, function* () {
            this.clientStreamer.emitWithoutBroadcast(events_1.AppEvents.COMMAND_REMOVED, command);
        });
    }
    onActionsChanged() {
        return __awaiter(this, void 0, void 0, function* () {
            this.clientStreamer.emitWithoutBroadcast(events_1.AppEvents.ACTIONS_CHANGED);
        });
    }
}
exports.AppServerListener = AppServerListener;
class AppServerNotifier {
    constructor(orch) {
        this.engineStreamer = Notifications_1.default.streamAppsEngine;
        // This is used to broadcast to the web clients
        this.clientStreamer = Notifications_1.default.streamApps;
        this.received = new Map();
        this.listener = new AppServerListener(orch, this.engineStreamer, this.clientStreamer, this.received);
    }
    appAdded(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            void core_services_1.api.broadcast('apps.added', appId);
        });
    }
    appRemoved(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            void core_services_1.api.broadcast('apps.removed', appId);
        });
    }
    appUpdated(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.received.has(`${events_1.AppEvents.APP_UPDATED}_${appId}`)) {
                this.received.delete(`${events_1.AppEvents.APP_UPDATED}_${appId}`);
                return;
            }
            void core_services_1.api.broadcast('apps.updated', appId);
        });
    }
    appStatusUpdated(appId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.received.has(`${events_1.AppEvents.APP_STATUS_CHANGE}_${appId}`)) {
                const details = this.received.get(`${events_1.AppEvents.APP_STATUS_CHANGE}_${appId}`);
                if (details.status === status) {
                    this.received.delete(`${events_1.AppEvents.APP_STATUS_CHANGE}_${appId}`);
                    return;
                }
            }
            void core_services_1.api.broadcast('apps.statusUpdate', appId, status);
        });
    }
    appSettingsChange(appId, setting) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.received.has(`${events_1.AppEvents.APP_SETTING_UPDATED}_${appId}_${setting.id}`)) {
                this.received.delete(`${events_1.AppEvents.APP_SETTING_UPDATED}_${appId}_${setting.id}`);
                return;
            }
            void core_services_1.api.broadcast('apps.settingUpdated', appId, setting);
        });
    }
    commandAdded(command) {
        return __awaiter(this, void 0, void 0, function* () {
            void core_services_1.api.broadcast('command.added', command);
        });
    }
    commandDisabled(command) {
        return __awaiter(this, void 0, void 0, function* () {
            void core_services_1.api.broadcast('command.disabled', command);
        });
    }
    commandUpdated(command) {
        return __awaiter(this, void 0, void 0, function* () {
            void core_services_1.api.broadcast('command.updated', command);
        });
    }
    commandRemoved(command) {
        return __awaiter(this, void 0, void 0, function* () {
            void core_services_1.api.broadcast('command.removed', command);
        });
    }
    actionsChanged() {
        return __awaiter(this, void 0, void 0, function* () {
            void core_services_1.api.broadcast('actions.changed');
        });
    }
}
exports.AppServerNotifier = AppServerNotifier;
