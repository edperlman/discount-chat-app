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
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const Contextualbar_1 = require("../../../../components/Contextualbar");
const InfoPanel_1 = require("../../../../components/InfoPanel");
const useDeviceLogout_1 = require("../../../../hooks/useDeviceLogout");
const useFormatDateAndTime_1 = require("../../../../hooks/useFormatDateAndTime");
const usePresence_1 = require("../../../../hooks/usePresence");
const DeviceManagementInfo = ({ device, sessionId, loginAt, ip, userId, _user, onReload }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const deviceManagementRouter = (0, ui_contexts_1.useRoute)('device-management');
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const handleDeviceLogout = (0, useDeviceLogout_1.useDeviceLogout)(sessionId, '/v1/sessions/logout');
    const { name: clientName, os, version: rcVersion } = device || {};
    const { username, name } = _user || {};
    const userPresence = (0, usePresence_1.usePresence)(userId);
    const handleCloseContextualBar = (0, react_1.useCallback)(() => deviceManagementRouter.push({}), [deviceManagementRouter]);
    return ((0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Device_Info') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: handleCloseContextualBar })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanel, { children: [(0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Client') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: clientName })] }), (0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Version') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: rcVersion || '—' })] }), (0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('OS') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: `${(os === null || os === void 0 ? void 0 : os.name) || ''} ${(os === null || os === void 0 ? void 0 : os.version) || ''}` })] }), username && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('User') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: username, etag: userPresence === null || userPresence === void 0 ? void 0 : userPresence.avatarETag }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', pi: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.StatusBullet, { status: userPresence === null || userPresence === void 0 ? void 0 : userPresence.status }) }), name && (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', children: name }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', color: 'hint', children: `(${username})` })] })] })), (0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Last_login') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: formatDateAndTime(loginAt) })] }), (0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Device_ID') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: sessionId })] }), (0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('IP_Address') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: ip })] })] }) }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: () => handleDeviceLogout(onReload), children: t('Logout_Device') }) }) })] }));
};
exports.default = DeviceManagementInfo;
