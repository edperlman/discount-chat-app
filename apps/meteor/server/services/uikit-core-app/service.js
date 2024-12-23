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
exports.UiKitCoreAppService = exports.registerCoreApp = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const registeredApps = new Map();
const getAppModule = (appId) => {
    const module = registeredApps.get(appId);
    if (typeof module === 'undefined') {
        throw new Error('invalid service name');
    }
    return module;
};
const registerCoreApp = (module) => {
    registeredApps.set(module.appId, module);
};
exports.registerCoreApp = registerCoreApp;
class UiKitCoreAppService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'uikit-core-app';
    }
    isRegistered(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            return registeredApps.has(appId);
        });
    }
    blockAction(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { appId } = payload;
            const service = getAppModule(appId);
            if (!service) {
                return;
            }
            return (_a = service.blockAction) === null || _a === void 0 ? void 0 : _a.call(service, payload);
        });
    }
    viewClosed(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { appId } = payload;
            const service = getAppModule(appId);
            if (!service) {
                return;
            }
            return (_a = service.viewClosed) === null || _a === void 0 ? void 0 : _a.call(service, payload);
        });
    }
    viewSubmit(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { appId } = payload;
            const service = getAppModule(appId);
            if (!service) {
                return;
            }
            return (_a = service.viewSubmit) === null || _a === void 0 ? void 0 : _a.call(service, payload);
        });
    }
}
exports.UiKitCoreAppService = UiKitCoreAppService;
