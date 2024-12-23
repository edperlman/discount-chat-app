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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const DeviceManagementAdminRow_1 = __importDefault(require("./DeviceManagementAdminRow"));
const FilterByText_1 = __importDefault(require("../../../../components/FilterByText"));
const GenericTable_1 = require("../../../../components/GenericTable");
const usePagination_1 = require("../../../../components/GenericTable/hooks/usePagination");
const useSort_1 = require("../../../../components/GenericTable/hooks/useSort");
const DeviceManagementTable_1 = __importDefault(require("../../../../components/deviceManagement/DeviceManagementTable"));
const useEndpointData_1 = require("../../../../hooks/useEndpointData");
const sortMapping = {
    client: 'device.name',
    username: '_user.username',
    os: 'device.os.name',
    loginAt: 'loginAt',
};
const isSessionPopulatedSession = (session) => '_user' in session;
const DeviceManagementAdminTable = ({ reloadRef }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [text, setText] = (0, react_1.useState)('');
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setCurrent, setItemsPerPage } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setCurrent", "setItemsPerPage"]);
    const { sortBy, sortDirection, setSort } = (0, useSort_1.useSort)('username');
    const query = (0, fuselage_hooks_1.useDebouncedValue)((0, react_1.useMemo)(() => ({
        filter: text,
        sort: JSON.stringify({ [sortMapping[sortBy]]: sortDirection === 'asc' ? 1 : -1 }),
        count: itemsPerPage,
        offset: text ? undefined : current,
    }), [text, itemsPerPage, current, sortBy, sortDirection]), 500);
    const { value: data, phase, error, reload } = (0, useEndpointData_1.useEndpointData)('/v1/sessions/list.all', { params: query });
    (0, react_1.useEffect)(() => {
        reloadRef.current = reload;
    }, [reloadRef, reload]);
    const mediaQuery = (0, fuselage_hooks_1.useMediaQuery)('(min-width: 1024px)');
    const headers = (0, react_1.useMemo)(() => [
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'client', onClick: setSort, sort: 'client', children: t('Client') }, 'client'),
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('Version') }, 'rcVersion'),
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'os', onClick: setSort, sort: 'os', children: t('OS') }, 'os'),
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'username', onClick: setSort, sort: 'username', children: t('User') }, 'username'),
        mediaQuery && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'loginAt', onClick: setSort, sort: 'loginAt', children: t('Last_login') }, 'loginAt')),
        mediaQuery && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('Device_ID') }, '_id'),
        mediaQuery && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('IP_Address') }, 'ip'),
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { width: '5%' }, 'menu'),
    ], [t, mediaQuery, setSort, sortDirection, sortBy]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(FilterByText_1.default, { placeholder: t('Search_Devices_Users'), value: text, onChange: (event) => setText(event.target.value) }), (0, jsx_runtime_1.jsx)(DeviceManagementTable_1.default, { data: data, phase: phase, error: error, reload: reload, headers: headers, renderRow: (session) => {
                    var _a, _b, _c, _d, _e, _f;
                    return ((0, jsx_runtime_1.jsx)(DeviceManagementAdminRow_1.default, { _id: session._id, username: isSessionPopulatedSession(session) ? (_a = session._user) === null || _a === void 0 ? void 0 : _a.username : '', ip: session.ip, deviceName: (_b = session === null || session === void 0 ? void 0 : session.device) === null || _b === void 0 ? void 0 : _b.name, deviceType: (_c = session === null || session === void 0 ? void 0 : session.device) === null || _c === void 0 ? void 0 : _c.type, deviceOSName: (_e = (_d = session === null || session === void 0 ? void 0 : session.device) === null || _d === void 0 ? void 0 : _d.os) === null || _e === void 0 ? void 0 : _e.name, rcVersion: (_f = session === null || session === void 0 ? void 0 : session.device) === null || _f === void 0 ? void 0 : _f.version, loginAt: session.loginAt, onReload: reload }, session._id));
                }, current: current, itemsPerPage: itemsPerPage, setCurrent: setCurrent, setItemsPerPage: setItemsPerPage, paginationProps: paginationProps })] }));
};
exports.default = DeviceManagementAdminTable;
