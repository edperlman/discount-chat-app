"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoConfProviders = void 0;
const server_1 = require("../../app/settings/server");
const providers = new Map();
exports.videoConfProviders = {
    registerProvider(providerName, capabilities, appId) {
        providers.set(providerName.toLowerCase(), { capabilities, label: providerName, appId });
    },
    unRegisterProvider(providerName) {
        const key = providerName.toLowerCase();
        if (providers.has(key)) {
            providers.delete(key);
        }
    },
    getActiveProvider() {
        if (providers.size === 0) {
            return;
        }
        const defaultProvider = server_1.settings.get('VideoConf_Default_Provider');
        if (defaultProvider) {
            if (providers.has(defaultProvider)) {
                return defaultProvider;
            }
            return;
        }
        if (providers.size === 1) {
            const [[name]] = [...providers];
            return name;
        }
    },
    hasAnyProvider() {
        return providers.size > 0;
    },
    getProviderList() {
        return [...providers.keys()].map((key) => { var _a; return ({ key, label: ((_a = providers.get(key)) === null || _a === void 0 ? void 0 : _a.label) || key }); });
    },
    isProviderAvailable(name) {
        return providers.has(name);
    },
    getProviderCapabilities(name) {
        var _a;
        const key = name.toLowerCase();
        if (!providers.has(key)) {
            return;
        }
        return (_a = providers.get(key)) === null || _a === void 0 ? void 0 : _a.capabilities;
    },
    getProviderAppId(name) {
        var _a;
        const key = name.toLowerCase();
        if (!providers.has(key)) {
            return;
        }
        return (_a = providers.get(key)) === null || _a === void 0 ? void 0 : _a.appId;
    },
};
