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
exports.useAppInfo = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const orchestrator_1 = require("../../../apps/orchestrator");
const AppsContext_1 = require("../../../contexts/AppsContext");
const getBundledInApp = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const { bundledIn = [] } = app;
    return Promise.all(bundledIn.map((bundle) => __awaiter(void 0, void 0, void 0, function* () {
        const apps = yield orchestrator_1.AppClientOrchestratorInstance.getAppsOnBundle(bundle.bundleId);
        bundle.apps = apps.slice(0, 4);
        return bundle;
    })));
});
const useAppInfo = (appId, context) => {
    var _a;
    const { installedApps, marketplaceApps, privateApps } = (0, react_1.useContext)(AppsContext_1.AppsContext);
    const [appData, setAppData] = (0, react_1.useState)();
    const getSettings = (0, ui_contexts_1.useEndpoint)('GET', '/apps/:id/settings', { id: appId });
    const getScreenshots = (0, ui_contexts_1.useEndpoint)('GET', '/apps/:id/screenshots', { id: appId });
    const getApis = (0, ui_contexts_1.useEndpoint)('GET', '/apps/:id/apis', { id: appId });
    const getBundledIn = (0, ui_contexts_1.useEndpoint)('GET', '/apps/:id', { id: appId });
    (0, react_1.useEffect)(() => {
        const fetchAppInfo = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            if ((!((_b = (_a = marketplaceApps.value) === null || _a === void 0 ? void 0 : _a.apps) === null || _b === void 0 ? void 0 : _b.length) && !((_c = installedApps.value) === null || _c === void 0 ? void 0 : _c.apps.length) && !((_d = privateApps.value) === null || _d === void 0 ? void 0 : _d.apps.length)) || !appId) {
                return;
            }
            let appResult;
            const marketplaceAppsContexts = ['explore', 'premium', 'requested'];
            if (marketplaceAppsContexts.includes(context))
                appResult = (_e = marketplaceApps.value) === null || _e === void 0 ? void 0 : _e.apps.find((app) => app.id === appId);
            if (context === 'private')
                appResult = (_f = privateApps.value) === null || _f === void 0 ? void 0 : _f.apps.find((app) => app.id === appId);
            if (context === 'installed')
                appResult = (_g = installedApps.value) === null || _g === void 0 ? void 0 : _g.apps.find((app) => app.id === appId);
            if (!appResult)
                return;
            const [settings, apis, screenshots, bundledIn] = yield Promise.all([
                getSettings().catch(() => ({
                    settings: {},
                })),
                getApis().catch(() => ({
                    apis: [],
                })),
                getScreenshots().catch(() => ({
                    screenshots: [],
                })),
                appResult.marketplace === false
                    ? []
                    : getBundledIn({
                        marketplace: 'true',
                        update: 'true',
                        appVersion: appId,
                    })
                        .then(({ app }) => {
                        appResult.tosLink = app.tosLink;
                        appResult.privacyLink = app.privacyLink;
                        return getBundledInApp(app);
                    })
                        .catch(() => ({
                        settings: {},
                    })),
            ]);
            setAppData(Object.assign(Object.assign({}, appResult), { bundledIn: bundledIn, settings: settings.settings, apis: apis ? apis.apis : [], screenshots: screenshots ? screenshots.screenshots : [] }));
        });
        fetchAppInfo();
    }, [appId, context, getApis, getBundledIn, getScreenshots, getSettings, installedApps, marketplaceApps, (_a = privateApps.value) === null || _a === void 0 ? void 0 : _a.apps]);
    return appData;
};
exports.useAppInfo = useAppInfo;
