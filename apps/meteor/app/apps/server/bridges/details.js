"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDetailChangesBridge = void 0;
const AppDetailChangesBridge_1 = require("@rocket.chat/apps-engine/server/bridges/AppDetailChangesBridge");
class AppDetailChangesBridge extends AppDetailChangesBridge_1.AppDetailChangesBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    onAppSettingsChange(appId, setting) {
        const logFailure = () => console.warn('failed to notify about the setting change.', appId);
        try {
            this.orch.getNotifier().appSettingsChange(appId, setting).catch(logFailure);
        }
        catch (e) {
            logFailure();
        }
    }
}
exports.AppDetailChangesBridge = AppDetailChangesBridge;
