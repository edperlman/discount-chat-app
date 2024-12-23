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
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericTable_1 = require("../../../../components/GenericTable");
const DeviceIcon_1 = __importDefault(require("../../../../components/deviceManagement/DeviceIcon"));
const useDeviceLogout_1 = require("../../../../hooks/useDeviceLogout");
const useFormatDateAndTime_1 = require("../../../../hooks/useFormatDateAndTime");
const DeviceManagementAdminRow = ({ _id, username, ip, deviceName, deviceType = 'browser', deviceOSName = '', loginAt, rcVersion, onReload, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const deviceManagementRouter = (0, ui_contexts_1.useRoute)('device-management');
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const mediaQuery = (0, fuselage_hooks_1.useMediaQuery)('(min-width: 1024px)');
    const handleDeviceLogout = (0, useDeviceLogout_1.useDeviceLogout)(_id, '/v1/sessions/logout');
    const handleClick = (0, fuselage_hooks_1.useMutableCallback)(() => {
        deviceManagementRouter.push({
            context: 'info',
            id: _id,
        });
    });
    const handleKeyDown = (0, react_1.useCallback)((e) => {
        if (!['Enter', 'Space'].includes(e.nativeEvent.code)) {
            return;
        }
        handleClick();
    }, [handleClick]);
    const menuOptions = {
        logout: {
            label: { label: t('Logout_Device'), icon: 'sign-out' },
            action: () => handleDeviceLogout(onReload),
        },
    };
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { onKeyDown: handleKeyDown, onClick: handleClick, tabIndex: 0, action: true, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(DeviceIcon_1.default, { deviceType: deviceType }), deviceName && (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: deviceName })] }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: rcVersion }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: deviceOSName }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: username }), mediaQuery && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: formatDateAndTime(loginAt) }), mediaQuery && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: _id }), mediaQuery && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: ip }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { onClick: (e) => e.stopPropagation(), children: (0, jsx_runtime_1.jsx)(fuselage_1.Menu, { title: t('Options'), options: menuOptions, renderItem: (_a) => {
                        var { label: { label, icon } } = _a, props = __rest(_a, ["label"]);
                        return (0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({ label: label, icon: icon }, props));
                    } }) })] }, _id));
};
exports.default = DeviceManagementAdminRow;
