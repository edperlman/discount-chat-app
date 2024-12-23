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
const GenericTable_1 = require("../../../../components/GenericTable");
const DeviceIcon_1 = __importDefault(require("../../../../components/deviceManagement/DeviceIcon"));
const useDeviceLogout_1 = require("../../../../hooks/useDeviceLogout");
const useFormatDateAndTime_1 = require("../../../../hooks/useFormatDateAndTime");
const DeviceManagementAccountRow = ({ _id, deviceName, deviceType = 'browser', deviceOSName, loginAt, onReload, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const mediaQuery = (0, fuselage_hooks_1.useMediaQuery)('(min-width: 1024px)');
    const handleDeviceLogout = (0, useDeviceLogout_1.useDeviceLogout)(_id, '/v1/sessions/logout.me');
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(DeviceIcon_1.default, { deviceType: deviceType }), deviceName && (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: deviceName })] }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: deviceOSName || '' }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: formatDateAndTime(loginAt) }), mediaQuery && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: _id }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { align: 'end', children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => handleDeviceLogout(onReload), children: t('Logout') }) })] }, _id));
};
exports.default = DeviceManagementAccountRow;
