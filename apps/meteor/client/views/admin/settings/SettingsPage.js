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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const SettingsGroupCard_1 = __importDefault(require("./SettingsGroupCard"));
const useSettingsGroups_1 = require("./hooks/useSettingsGroups");
const GenericNoResults_1 = __importDefault(require("../../../components/GenericNoResults"));
const Page_1 = require("../../../components/Page");
const PageBlockWithBorder_1 = __importDefault(require("../../../components/Page/PageBlockWithBorder"));
const SettingsPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [filter, setFilter] = (0, react_1.useState)('');
    const handleChange = (0, react_1.useCallback)((e) => setFilter(e.currentTarget.value), []);
    const groups = (0, useSettingsGroups_1.useSettingsGroups)((0, fuselage_hooks_1.useDebouncedValue)(filter, 400));
    const isLoadingGroups = (0, ui_contexts_1.useIsSettingsContextLoading)();
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { background: 'tint', children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Settings'), borderBlockEndColor: '' }), (0, jsx_runtime_1.jsx)(PageBlockWithBorder_1.default, { children: (0, jsx_runtime_1.jsx)(fuselage_1.SearchInput, { value: filter, placeholder: t('Search'), onChange: handleChange, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x20' }) }) }), (0, jsx_runtime_1.jsxs)(Page_1.PageScrollableContentWithShadow, { p: 0, mi: 24, mbe: 16, children: [isLoadingGroups && (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}), (0, jsx_runtime_1.jsx)(fuselage_1.CardGrid, { breakpoints: {
                            xs: 4,
                            sm: 4,
                            md: 4,
                            lg: 6,
                            xl: 4,
                            p: 8,
                        }, children: !isLoadingGroups &&
                            !!groups.length &&
                            groups.map((group) => ((0, jsx_runtime_1.jsx)(SettingsGroupCard_1.default, { id: group._id, title: group.i18nLabel, description: group.i18nDescription }, group._id))) }), !isLoadingGroups && !groups.length && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {})] })] }));
};
exports.default = SettingsPage;
