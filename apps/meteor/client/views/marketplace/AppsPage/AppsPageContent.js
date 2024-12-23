"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AppsFilters_1 = __importDefault(require("./AppsFilters"));
const AppsPageConnectionError_1 = __importDefault(require("./AppsPageConnectionError"));
const AppsPageContentBody_1 = __importDefault(require("./AppsPageContentBody"));
const AppsPageContentSkeleton_1 = __importDefault(require("./AppsPageContentSkeleton"));
const NoAppRequestsEmptyState_1 = __importDefault(require("./NoAppRequestsEmptyState"));
const NoInstalledAppMatchesEmptyState_1 = __importDefault(require("./NoInstalledAppMatchesEmptyState"));
const NoInstalledAppsEmptyState_1 = __importDefault(require("./NoInstalledAppsEmptyState"));
const NoMarketplaceOrInstalledAppMatchesEmptyState_1 = __importDefault(require("./NoMarketplaceOrInstalledAppMatchesEmptyState"));
const PrivateEmptyState_1 = __importDefault(require("./PrivateEmptyState"));
const UnsupportedEmptyState_1 = __importDefault(require("./UnsupportedEmptyState"));
const usePagination_1 = require("../../../components/GenericTable/hooks/usePagination");
const useAppsResult_1 = require("../../../contexts/hooks/useAppsResult");
const asyncState_1 = require("../../../lib/asyncState");
const MarketplaceHeader_1 = __importDefault(require("../components/MarketplaceHeader"));
const useCategories_1 = require("../hooks/useCategories");
const useFilteredApps_1 = require("../hooks/useFilteredApps");
const useRadioToggle_1 = require("../hooks/useRadioToggle");
const AppsPageContent = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { marketplaceApps, installedApps, privateApps, reload } = (0, useAppsResult_1.useAppsResult)();
    const [text, setText] = (0, react_1.useState)('');
    const debouncedText = (0, fuselage_hooks_1.useDebouncedValue)(text, 500);
    const _j = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage: onSetItemsPerPage, setCurrent: onSetCurrent } = _j, paginationProps = __rest(_j, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const router = (0, ui_contexts_1.useRouter)();
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const isMarketplace = context === 'explore';
    const isPremium = context === 'premium';
    const isRequested = context === 'requested';
    const [freePaidFilterStructure, setFreePaidFilterStructure] = (0, react_1.useState)({
        label: t('Filter_By_Price'),
        items: [
            { id: 'all', label: t('All_Prices'), checked: true },
            { id: 'free', label: t('Free_Apps'), checked: false },
            { id: 'paid', label: t('Paid_Apps'), checked: false },
            { id: 'premium', label: t('Premium'), checked: false },
        ],
    });
    const freePaidFilterOnSelected = (0, useRadioToggle_1.useRadioToggle)(setFreePaidFilterStructure);
    const [statusFilterStructure, setStatusFilterStructure] = (0, react_1.useState)({
        label: t('Filter_By_Status'),
        items: [
            { id: 'all', label: t('All_status'), checked: true },
            { id: 'enabled', label: t('Enabled'), checked: false },
            { id: 'disabled', label: t('Disabled'), checked: false },
        ],
    });
    const statusFilterOnSelected = (0, useRadioToggle_1.useRadioToggle)(setStatusFilterStructure);
    const baseFilterStructureItems = [
        { id: 'az', label: 'A-Z', checked: false },
        { id: 'za', label: 'Z-A', checked: false },
        { id: 'mru', label: t('Most_recent_updated'), checked: true },
        { id: 'lru', label: t('Least_recent_updated'), checked: false },
    ];
    const requestedFilterItems = [
        { id: 'urf', label: t('Unread_Requested_First'), checked: false },
        { id: 'url', label: t('Unread_Requested_Last'), checked: false },
    ];
    const createFilterStructureItems = () => {
        return isRequested ? [...requestedFilterItems, ...baseFilterStructureItems] : baseFilterStructureItems;
    };
    const [sortFilterStructure, setSortFilterStructure] = (0, react_1.useState)(() => {
        return {
            label: t('Sort_By'),
            items: createFilterStructureItems(),
        };
    });
    (0, react_1.useEffect)(() => {
        setSortFilterStructure({
            label: t('Sort_By'),
            items: createFilterStructureItems(),
        });
    }, [isRequested]);
    const sortFilterOnSelected = (0, useRadioToggle_1.useRadioToggle)(setSortFilterStructure);
    const getAppsData = (0, react_1.useCallback)(() => {
        switch (context) {
            case 'premium':
            case 'explore':
            case 'requested':
                return marketplaceApps;
            case 'private':
                return privateApps;
            default:
                return installedApps;
        }
    }, [context, marketplaceApps, installedApps, privateApps]);
    const findSort = () => {
        const possibleSort = sortFilterStructure.items.find(({ checked }) => checked);
        return possibleSort ? possibleSort.id : 'mru';
    };
    const findPurchaseType = () => {
        const possiblePurchaseType = freePaidFilterStructure.items.find(({ checked }) => checked);
        return possiblePurchaseType ? possiblePurchaseType.id : 'all';
    };
    const findStatus = () => {
        const possibleStatus = statusFilterStructure.items.find(({ checked }) => checked);
        return possibleStatus ? possibleStatus.id : 'all';
    };
    const [categories, selectedCategories, categoryTagList, onSelected] = (0, useCategories_1.useCategories)();
    const appsResult = (0, useFilteredApps_1.useFilteredApps)({
        appsData: getAppsData(),
        text: debouncedText,
        current,
        itemsPerPage,
        categories: (0, react_1.useMemo)(() => selectedCategories.map(({ label }) => label), [selectedCategories]),
        purchaseType: (0, react_1.useMemo)(findPurchaseType, [freePaidFilterStructure]),
        sortingMethod: (0, react_1.useMemo)(findSort, [sortFilterStructure]),
        status: (0, react_1.useMemo)(findStatus, [statusFilterStructure]),
        context,
    });
    const noInstalledApps = appsResult.phase === asyncState_1.AsyncStatePhase.RESOLVED && !isMarketplace && ((_a = appsResult.value) === null || _a === void 0 ? void 0 : _a.totalAppsLength) === 0;
    const unsupportedVersion = appsResult.phase === asyncState_1.AsyncStatePhase.REJECTED && appsResult.error.message === 'unsupported version';
    const noMarketplaceOrInstalledAppMatches = appsResult.phase === asyncState_1.AsyncStatePhase.RESOLVED && (isMarketplace || isPremium) && ((_b = appsResult.value) === null || _b === void 0 ? void 0 : _b.count) === 0;
    const noInstalledAppMatches = appsResult.phase === asyncState_1.AsyncStatePhase.RESOLVED &&
        context === 'installed' &&
        ((_c = appsResult.value) === null || _c === void 0 ? void 0 : _c.totalAppsLength) !== 0 &&
        ((_d = appsResult.value) === null || _d === void 0 ? void 0 : _d.count) === 0;
    const noAppRequests = context === 'requested' && ((_e = appsResult === null || appsResult === void 0 ? void 0 : appsResult.value) === null || _e === void 0 ? void 0 : _e.count) === 0;
    const noErrorsOcurred = !noMarketplaceOrInstalledAppMatches && !noInstalledAppMatches && !noInstalledApps && !noAppRequests;
    const isFiltered = Boolean(text.length) ||
        ((_f = freePaidFilterStructure.items.find((item) => item.checked)) === null || _f === void 0 ? void 0 : _f.id) !== 'all' ||
        ((_g = statusFilterStructure.items.find((item) => item.checked)) === null || _g === void 0 ? void 0 : _g.id) !== 'all' ||
        ((_h = sortFilterStructure.items.find((item) => item.checked)) === null || _h === void 0 ? void 0 : _h.id) !== 'mru' ||
        selectedCategories.length > 0;
    const handleReturn = () => {
        router.navigate({
            name: 'marketplace',
            params: {
                context: 'explore',
                page: 'list',
            },
        });
    };
    const toggleInitialSortOption = (0, react_1.useCallback)((isRequested) => {
        setSortFilterStructure((prevState) => {
            prevState.items.forEach((currentItem) => {
                if (isRequested && currentItem.id === 'urf') {
                    currentItem.checked = true;
                    return;
                }
                if (!isRequested && currentItem.id === 'mru') {
                    currentItem.checked = true;
                    return;
                }
                currentItem.checked = false;
            });
            return Object.assign({}, prevState);
        });
    }, []);
    (0, react_1.useEffect)(() => {
        toggleInitialSortOption(isRequested);
    }, [isMarketplace, isRequested, sortFilterOnSelected, t, toggleInitialSortOption]);
    const getEmptyState = () => {
        var _a, _b;
        if (unsupportedVersion) {
            return (0, jsx_runtime_1.jsx)(UnsupportedEmptyState_1.default, {});
        }
        if (noAppRequests) {
            return (0, jsx_runtime_1.jsx)(NoAppRequestsEmptyState_1.default, {});
        }
        if (noMarketplaceOrInstalledAppMatches) {
            return (0, jsx_runtime_1.jsx)(NoMarketplaceOrInstalledAppMatchesEmptyState_1.default, { shouldShowSearchText: !!((_a = appsResult.value) === null || _a === void 0 ? void 0 : _a.shouldShowSearchText), text: text });
        }
        if (noInstalledAppMatches) {
            return ((0, jsx_runtime_1.jsx)(NoInstalledAppMatchesEmptyState_1.default, { shouldShowSearchText: !!((_b = appsResult.value) === null || _b === void 0 ? void 0 : _b.shouldShowSearchText), text: text, onButtonClick: handleReturn }));
        }
        if (noInstalledApps) {
            return context === 'private' ? (0, jsx_runtime_1.jsx)(PrivateEmptyState_1.default, {}) : (0, jsx_runtime_1.jsx)(NoInstalledAppsEmptyState_1.default, { onButtonClick: handleReturn });
        }
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(MarketplaceHeader_1.default, { unsupportedVersion: unsupportedVersion, title: t(`Apps_context_${context}`) }), (0, jsx_runtime_1.jsx)(AppsFilters_1.default, { text: text, setText: setText, freePaidFilterStructure: freePaidFilterStructure, freePaidFilterOnSelected: freePaidFilterOnSelected, categories: categories, selectedCategories: selectedCategories, onSelected: onSelected, sortFilterStructure: sortFilterStructure, sortFilterOnSelected: sortFilterOnSelected, categoryTagList: categoryTagList, statusFilterStructure: statusFilterStructure, statusFilterOnSelected: statusFilterOnSelected, context: context || 'explore' }), appsResult.phase === asyncState_1.AsyncStatePhase.LOADING && (0, jsx_runtime_1.jsx)(AppsPageContentSkeleton_1.default, {}), appsResult.phase === asyncState_1.AsyncStatePhase.RESOLVED && noErrorsOcurred && !unsupportedVersion && ((0, jsx_runtime_1.jsx)(AppsPageContentBody_1.default, { isMarketplace: isMarketplace, isFiltered: isFiltered, appsResult: appsResult.value, itemsPerPage: itemsPerPage, current: current, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent, paginationProps: paginationProps, noErrorsOcurred: noErrorsOcurred })), getEmptyState(), appsResult.phase === asyncState_1.AsyncStatePhase.REJECTED && !unsupportedVersion && (0, jsx_runtime_1.jsx)(AppsPageConnectionError_1.default, { onButtonClick: reload })] }));
};
exports.default = AppsPageContent;
