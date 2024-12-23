"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFilteredApps = void 0;
const react_1 = require("react");
const asyncState_1 = require("../../../lib/asyncState");
const filterAppsByCategories_1 = require("../helpers/filterAppsByCategories");
const filterAppsByDisabled_1 = require("../helpers/filterAppsByDisabled");
const filterAppsByEnabled_1 = require("../helpers/filterAppsByEnabled");
const filterAppsByEnterprise_1 = require("../helpers/filterAppsByEnterprise");
const filterAppsByFree_1 = require("../helpers/filterAppsByFree");
const filterAppsByPaid_1 = require("../helpers/filterAppsByPaid");
const filterAppsByText_1 = require("../helpers/filterAppsByText");
const sortAppsByAlphabeticalOrInverseOrder_1 = require("../helpers/sortAppsByAlphabeticalOrInverseOrder");
const sortAppsByClosestOrFarthestModificationDate_1 = require("../helpers/sortAppsByClosestOrFarthestModificationDate");
const useFilteredApps = ({ appsData, text, current, itemsPerPage, categories = [], purchaseType, sortingMethod, status, context, }) => {
    const value = (0, react_1.useMemo)(() => {
        if (appsData.value === undefined) {
            return undefined;
        }
        const { apps } = appsData.value;
        const fallback = (apps) => apps;
        const sortingMethods = {
            urf: (apps) => apps.sort((firstApp, secondApp) => { var _a, _b; return (((_a = secondApp === null || secondApp === void 0 ? void 0 : secondApp.appRequestStats) === null || _a === void 0 ? void 0 : _a.totalUnseen) || 0) - (((_b = firstApp === null || firstApp === void 0 ? void 0 : firstApp.appRequestStats) === null || _b === void 0 ? void 0 : _b.totalUnseen) || 0); }),
            url: (apps) => apps.sort((firstApp, secondApp) => { var _a, _b; return (((_a = firstApp === null || firstApp === void 0 ? void 0 : firstApp.appRequestStats) === null || _a === void 0 ? void 0 : _a.totalUnseen) || 0) - (((_b = secondApp === null || secondApp === void 0 ? void 0 : secondApp.appRequestStats) === null || _b === void 0 ? void 0 : _b.totalUnseen) || 0); }),
            az: (apps) => apps.sort((firstApp, secondApp) => (0, sortAppsByAlphabeticalOrInverseOrder_1.sortAppsByAlphabeticalOrInverseOrder)(firstApp.name, secondApp.name)),
            za: (apps) => apps.sort((firstApp, secondApp) => (0, sortAppsByAlphabeticalOrInverseOrder_1.sortAppsByAlphabeticalOrInverseOrder)(secondApp.name, firstApp.name)),
            mru: (apps) => apps.sort((firstApp, secondApp) => (0, sortAppsByClosestOrFarthestModificationDate_1.sortAppsByClosestOrFarthestModificationDate)(firstApp.modifiedAt, secondApp.modifiedAt)),
            lru: (apps) => apps.sort((firstApp, secondApp) => (0, sortAppsByClosestOrFarthestModificationDate_1.sortAppsByClosestOrFarthestModificationDate)(secondApp.modifiedAt, firstApp.modifiedAt)),
        };
        const filterByPurchaseType = {
            all: fallback,
            paid: (apps) => apps.filter(filterAppsByPaid_1.filterAppsByPaid),
            premium: (apps) => apps.filter(filterAppsByEnterprise_1.filterAppsByEnterprise),
            free: (apps) => apps.filter(filterAppsByFree_1.filterAppsByFree),
        };
        const filterByStatus = {
            all: fallback,
            enabled: (apps) => apps.filter(filterAppsByEnabled_1.filterAppsByEnabled),
            disabled: (apps) => apps.filter(filterAppsByDisabled_1.filterAppsByDisabled),
        };
        const filterByContext = {
            explore: fallback,
            installed: fallback,
            private: fallback,
            premium: (apps) => apps.filter(({ categories }) => categories.includes('Premium')),
            requested: (apps) => apps.filter(({ appRequestStats, installed }) => Boolean(appRequestStats) && !installed),
        };
        const pipeAppsFilter = (...functions) => (initialValue) => functions.reduce((currentAppsList, currentFilterFunction) => currentFilterFunction(currentAppsList), initialValue);
        const filtered = pipeAppsFilter(context ? filterByContext[context] : fallback, filterByPurchaseType[purchaseType], filterByStatus[status], categories.length ? (apps) => apps.filter((app) => (0, filterAppsByCategories_1.filterAppsByCategories)(app, categories)) : fallback, text ? (apps) => apps.filter(({ name }) => (0, filterAppsByText_1.filterAppsByText)(name, text)) : fallback, sortingMethods[sortingMethod])(apps);
        const shouldShowSearchText = !!text;
        const total = filtered.length;
        const offset = current > total ? 0 : current;
        const end = current + itemsPerPage;
        const slice = filtered.slice(offset, end);
        return {
            items: slice,
            offset,
            total: filtered.length,
            totalAppsLength: apps.length,
            count: slice.length,
            shouldShowSearchText,
            allApps: filtered,
        };
    }, [appsData.value, sortingMethod, purchaseType, status, categories, text, context, current, itemsPerPage]);
    if (appsData.phase === asyncState_1.AsyncStatePhase.RESOLVED) {
        if (!value) {
            throw new Error('useFilteredApps - Unexpected state');
        }
        return Object.assign(Object.assign({}, appsData), { value });
    }
    if (appsData.phase === asyncState_1.AsyncStatePhase.UPDATING) {
        throw new Error('useFilteredApps - Unexpected state');
    }
    return Object.assign(Object.assign({}, appsData), { value: undefined });
};
exports.useFilteredApps = useFilteredApps;
