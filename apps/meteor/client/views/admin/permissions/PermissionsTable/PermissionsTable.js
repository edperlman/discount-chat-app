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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const PermissionRow_1 = __importDefault(require("./PermissionRow"));
const PermissionsTableFilter_1 = __importDefault(require("./PermissionsTableFilter"));
const RoleHeader_1 = __importDefault(require("./RoleHeader"));
const GenericNoResults_1 = __importDefault(require("../../../../components/GenericNoResults"));
const GenericTable_1 = require("../../../../components/GenericTable");
const usePagination_1 = require("../../../../components/GenericTable/hooks/usePagination");
const Page_1 = require("../../../../components/Page");
const CustomRoleUpsellModal_1 = __importDefault(require("../CustomRoleUpsellModal"));
const PermissionsContextBar_1 = __importDefault(require("../PermissionsContextBar"));
const usePermissionsAndRoles_1 = require("../hooks/usePermissionsAndRoles");
const PermissionsTable = ({ isEnterprise }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const [filter, setFilter] = (0, react_1.useState)('');
    const canViewPermission = (0, ui_contexts_1.usePermission)('access-permissions');
    const canViewSettingPermission = (0, ui_contexts_1.usePermission)('access-setting-permissions');
    const defaultType = canViewPermission ? 'permissions' : 'settings';
    const [type, setType] = (0, react_1.useState)(defaultType);
    const router = (0, ui_contexts_1.useRoute)('admin-permissions');
    const setModal = (0, ui_contexts_1.useSetModal)();
    const grantRole = (0, ui_contexts_1.useMethod)('authorization:addPermissionToRole');
    const removeRole = (0, ui_contexts_1.useMethod)('authorization:removeRoleFromPermission');
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage: onSetItemsPerPage, setCurrent: onSetCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const { permissions, total, roleList } = (0, usePermissionsAndRoles_1.usePermissionsAndRoles)(type, filter, itemsPerPage, current);
    const handlePermissionsTab = (0, fuselage_hooks_1.useMutableCallback)(() => {
        if (type === 'permissions') {
            return;
        }
        setType('permissions');
    });
    const handleSettingsTab = (0, fuselage_hooks_1.useMutableCallback)(() => {
        if (type === 'settings') {
            return;
        }
        setType('settings');
    });
    const handleAdd = (0, fuselage_hooks_1.useMutableCallback)(() => {
        if (!isEnterprise) {
            setModal((0, jsx_runtime_1.jsx)(CustomRoleUpsellModal_1.default, { onClose: () => setModal(null) }));
            return;
        }
        router.push({
            context: 'new',
        });
    });
    const fixedColumnStyle = (0, css_in_js_1.css) `
		tr > th {
			&:first-child {
				position: sticky;
				left: 0;
				background-color: ${fuselage_1.Palette.surface['surface-light']};
				z-index: 12;
			}
		}
		tr > td {
			&:first-child {
				position: sticky;
				left: 0;
				box-shadow: -1px 0 0 ${fuselage_1.Palette.stroke['stroke-light']} inset;
				background-color: ${fuselage_1.Palette.surface['surface-light']};
				z-index: 11;
			}
		}
	`;
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'row', children: [(0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Permissions'), children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: handleAdd, "aria-label": t('New'), name: t('New_role'), children: t('New_role') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { blockEnd: 16, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Tabs, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { "data-qa": 'PermissionTable-Permissions', selected: type === 'permissions', onClick: handlePermissionsTab, disabled: !canViewPermission, children: t('Permissions') }), (0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { "data-qa": 'PermissionTable-Settings', selected: type === 'settings', onClick: handleSettingsTab, disabled: !canViewSettingPermission, children: t('Settings') })] }) }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { mb: 'neg-x8', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { block: 8, children: [(0, jsx_runtime_1.jsx)(PermissionsTableFilter_1.default, { onChange: setFilter }), (permissions === null || permissions === void 0 ? void 0 : permissions.length) === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), (permissions === null || permissions === void 0 ? void 0 : permissions.length) > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { className: [fixedColumnStyle], fixed: false, children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableHeader, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { width: 'x120', children: t('Name') }), roleList === null || roleList === void 0 ? void 0 : roleList.map(({ _id, name, description }) => ((0, jsx_runtime_1.jsx)(RoleHeader_1.default, { _id: _id, name: name, description: description }, _id)))] }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: permissions === null || permissions === void 0 ? void 0 : permissions.map((permission) => ((0, jsx_runtime_1.jsx)(PermissionRow_1.default, { permission: permission, roleList: roleList, onGrant: grantRole, onRemove: removeRole }, permission._id))) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: total, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent }, paginationProps))] }))] }) })] }), (0, jsx_runtime_1.jsx)(PermissionsContextBar_1.default, {})] }));
};
exports.default = PermissionsTable;
