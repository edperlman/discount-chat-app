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
exports.AppClientOrchestratorInstance = void 0;
const AppClientManager_1 = require("@rocket.chat/apps-engine/client/AppClientManager");
const RealAppsEngineUIHost_1 = require("./RealAppsEngineUIHost");
const client_1 = require("../../app/authorization/client");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
const toast_1 = require("../lib/toast");
const isErrorObject = (e) => typeof e === 'object' && e !== null && 'error' in e && typeof e.error === 'string';
class AppClientOrchestrator {
    constructor() {
        this._appClientUIHost = new RealAppsEngineUIHost_1.RealAppsEngineUIHost();
        this._manager = new AppClientManager_1.AppClientManager(this._appClientUIHost);
        this._isLoaded = false;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isLoaded) {
                this._isLoaded = true;
            }
        });
    }
    getAppClientManager() {
        return this._manager;
    }
    handleError(error) {
        if ((0, client_1.hasAtLeastOnePermission)(['manage-apps'])) {
            (0, toast_1.dispatchToastMessage)({
                type: 'error',
                message: error,
            });
        }
    }
    getInstalledApps() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield SDKClient_1.sdk.rest.get('/apps/installed');
            if ('apps' in result) {
                // TODO: chapter day: multiple results are returned, but we only need one
                return result.apps;
            }
            throw new Error('Invalid response from API');
        });
    }
    getAppsFromMarketplace(isAdminUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            try {
                result = yield SDKClient_1.sdk.rest.get('/apps/marketplace', { isAdminUser: isAdminUser ? isAdminUser.toString() : 'false' });
            }
            catch (e) {
                if (isErrorObject(e)) {
                    return { apps: [], error: e.error };
                }
                if (typeof e === 'string') {
                    return { apps: [], error: e };
                }
            }
            if (!Array.isArray(result)) {
                // TODO: chapter day: multiple results are returned, but we only need one
                return { apps: [], error: 'Invalid response from API' };
            }
            const apps = result.map((app) => {
                const { latest, appRequestStats, price, pricingPlans, purchaseType, isEnterpriseOnly, modifiedAt, bundledIn, requestedEndUser } = app;
                return Object.assign(Object.assign({}, latest), { appRequestStats,
                    price,
                    pricingPlans,
                    purchaseType,
                    isEnterpriseOnly,
                    modifiedAt,
                    bundledIn,
                    requestedEndUser });
            });
            return { apps, error: undefined };
        });
    }
    getAppsOnBundle(bundleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { apps } = yield SDKClient_1.sdk.rest.get(`/apps/bundles/${bundleId}/apps`);
            return apps;
        });
    }
    getApp(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { app } = yield SDKClient_1.sdk.rest.get(`/apps/${appId}`);
            return app;
        });
    }
    setAppSettings(appId, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            yield SDKClient_1.sdk.rest.post(`/apps/${appId}/settings`, { settings });
        });
    }
    installApp(appId, version, permissionsGranted) {
        return __awaiter(this, void 0, void 0, function* () {
            const { app } = (yield SDKClient_1.sdk.rest.post('/apps', {
                appId,
                marketplace: true,
                version,
                permissionsGranted,
            }));
            return app;
        });
    }
    updateApp(appId, version, permissionsGranted) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield SDKClient_1.sdk.rest.post(`/apps/${appId}`, {
                appId,
                marketplace: true,
                version,
                permissionsGranted,
            });
            if ('app' in result) {
                return result.app;
            }
            throw new Error('App not found');
        });
    }
    buildExternalUrl(appId_1) {
        return __awaiter(this, arguments, void 0, function* (appId, purchaseType = 'buy', details = false) {
            const result = yield SDKClient_1.sdk.rest.get('/apps/buildExternalUrl', {
                appId,
                purchaseType,
                details: `${details}`,
            });
            if ('url' in result) {
                return result;
            }
            throw new Error('Failed to build external url');
        });
    }
    buildExternalAppRequest(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield SDKClient_1.sdk.rest.get('/apps/buildExternalAppRequest', {
                appId,
            });
            if ('url' in result) {
                return result;
            }
            throw new Error('Failed to build App Request external url');
        });
    }
    buildIncompatibleExternalUrl(appId, appVersion, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield SDKClient_1.sdk.rest.get('/apps/incompatibleModal', {
                appId,
                appVersion,
                action,
            });
            if ('url' in result) {
                return result;
            }
            throw new Error('Failed to build external url');
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield SDKClient_1.sdk.rest.get('/apps/categories');
            if (Array.isArray(result)) {
                // TODO: chapter day: multiple results are returned, but we only need one
                return result;
            }
            throw new Error('Failed to get categories');
        });
    }
}
exports.AppClientOrchestratorInstance = new AppClientOrchestrator();
