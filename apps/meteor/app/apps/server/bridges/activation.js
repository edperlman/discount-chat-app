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
exports.AppActivationBridge = void 0;
const AppActivationBridge_1 = require("@rocket.chat/apps-engine/server/bridges/AppActivationBridge");
const models_1 = require("@rocket.chat/models");
class AppActivationBridge extends AppActivationBridge_1.AppActivationBridge {
    // eslint-disable-next-line no-empty-function
    constructor(orch) {
        super();
        this.orch = orch;
    }
    appAdded(_app) {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.orch.getNotifier().appAdded(app.getID());
            // Calls made via AppActivationBridge should NOT go through
            // View https://github.com/RocketChat/Rocket.Chat/pull/29180 for details
            return undefined;
        });
    }
    appUpdated(_app) {
        return __awaiter(this, void 0, void 0, function* () {
            // Calls made via AppActivationBridge should NOT go through
            // View https://github.com/RocketChat/Rocket.Chat/pull/29180 for details
            // await this.orch.getNotifier().appUpdated(app.getID());
            return undefined;
        });
    }
    appRemoved(app) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.orch.getNotifier().appRemoved(app.getID());
        });
    }
    appStatusChanged(app, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const userStatus = ['auto_enabled', 'manually_enabled'].includes(status) ? 'online' : 'offline';
            yield models_1.Users.updateStatusByAppId(app.getID(), userStatus);
            yield this.orch.getNotifier().appStatusUpdated(app.getID(), status);
        });
    }
    actionsChanged() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.orch.getNotifier().actionsChanged();
        });
    }
}
exports.AppActivationBridge = AppActivationBridge;
