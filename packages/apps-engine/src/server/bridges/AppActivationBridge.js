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
const BaseBridge_1 = require("./BaseBridge");
class AppActivationBridge extends BaseBridge_1.BaseBridge {
    doAppAdded(app) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.appAdded(app);
        });
    }
    doAppUpdated(app) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.appUpdated(app);
        });
    }
    doAppRemoved(app) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.appRemoved(app);
        });
    }
    doAppStatusChanged(app, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.appStatusChanged(app, status);
        });
    }
    doActionsChanged() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.actionsChanged();
        });
    }
}
exports.AppActivationBridge = AppActivationBridge;
