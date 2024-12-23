"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const FilterByText_1 = __importDefault(require("../../../components/FilterByText"));
const CategoryDropDown_1 = __importDefault(require("../components/CategoryFilter/CategoryDropDown"));
const TagList_1 = __importDefault(require("../components/CategoryFilter/TagList"));
const RadioDropDown_1 = __importDefault(require("../components/RadioDropDown/RadioDropDown"));
const AppsFilters = ({ text, setText, freePaidFilterStructure, freePaidFilterOnSelected, categories, selectedCategories, onSelected, sortFilterStructure, sortFilterOnSelected, categoryTagList, statusFilterStructure, statusFilterOnSelected, context, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const isPrivateAppsPage = context === 'private';
    const breakpoints = (0, fuselage_hooks_1.useBreakpoints)();
    const appsSearchPlaceholders = {
        explore: t('Search_Apps'),
        enterprise: t('Search_Premium_Apps'),
        installed: t('Search_Installed_Apps'),
        requested: t('Search_Requested_Apps'),
        private: t('Search_Private_apps'),
    };
    const fixFiltersSize = breakpoints.includes('lg') ? { maxWidth: 'x200', minWidth: 'x200' } : null;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { pi: 24, children: [(0, jsx_runtime_1.jsxs)(FilterByText_1.default, { value: text, onChange: (event) => setText(event.target.value), placeholder: appsSearchPlaceholders[context], children: [!isPrivateAppsPage && ((0, jsx_runtime_1.jsx)(RadioDropDown_1.default, Object.assign({ group: freePaidFilterStructure, onSelected: freePaidFilterOnSelected, flexGrow: 1 }, fixFiltersSize))), (0, jsx_runtime_1.jsx)(RadioDropDown_1.default, Object.assign({ group: statusFilterStructure, onSelected: statusFilterOnSelected, flexGrow: 1 }, fixFiltersSize)), !isPrivateAppsPage && ((0, jsx_runtime_1.jsx)(CategoryDropDown_1.default, { categories: categories, selectedCategories: selectedCategories, onSelected: onSelected, flexGrow: 1 })), (0, jsx_runtime_1.jsx)(RadioDropDown_1.default, Object.assign({ group: sortFilterStructure, onSelected: sortFilterOnSelected, flexGrow: 1 }, fixFiltersSize))] }), (0, jsx_runtime_1.jsx)(TagList_1.default, { categories: categoryTagList, onClick: onSelected })] }));
};
exports.default = AppsFilters;
