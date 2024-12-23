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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const UsersTableFilters = ({ roleData, setUsersFilters }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [selectedRoles, setSelectedRoles] = (0, react_1.useState)([]);
    const [text, setText] = (0, react_1.useState)('');
    const handleSearchTextChange = (0, react_1.useCallback)(({ target: { value } }) => {
        setText(value);
        setUsersFilters({ text: value, roles: selectedRoles });
    }, [selectedRoles, setUsersFilters]);
    const handleRolesChange = (0, react_1.useCallback)((roles) => {
        setUsersFilters({ text, roles });
        setSelectedRoles(roles);
    }, [setUsersFilters, text]);
    const userRolesFilterStructure = (0, react_1.useMemo)(() => [
        {
            id: 'filter_by_role',
            text: 'Filter_by_role',
        },
        {
            id: 'all',
            text: 'All_roles',
            checked: false,
        },
        ...(roleData
            ? roleData.roles.map((role) => ({
                id: role._id,
                text: role.description || role.name || role._id,
                checked: false,
            }))
            : []),
    ], [roleData]);
    const breakpoints = (0, fuselage_hooks_1.useBreakpoints)();
    const isLargeScreenOrBigger = breakpoints.includes('lg');
    const fixFiltersSize = isLargeScreenOrBigger ? { maxWidth: 'x224', minWidth: 'x224' } : null;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mb: 16, is: 'form', onSubmit: (event) => {
            event.preventDefault();
        }, display: 'flex', flexWrap: 'wrap', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inlineEnd: isLargeScreenOrBigger ? 16 : 0, children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { placeholder: t('Search_Users'), addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x20' }), onChange: handleSearchTextChange, value: text, flexGrow: 2, minWidth: 'x220', "aria-label": t('Search_Users') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: 4, width: isLargeScreenOrBigger ? 'unset' : '100%', children: (0, jsx_runtime_1.jsx)(ui_client_1.MultiSelectCustom, Object.assign({ dropdownOptions: userRolesFilterStructure, defaultTitle: 'All_roles', selectedOptionsTitle: 'Roles', setSelectedOptions: handleRolesChange, selectedOptions: selectedRoles, searchBarText: 'Search_roles' }, fixFiltersSize)) })] }));
};
exports.default = UsersTableFilters;
