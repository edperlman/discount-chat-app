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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const CustomUserActiveConnections_1 = __importDefault(require("./CustomUserActiveConnections"));
const CustomUserStatusFormWithData_1 = __importDefault(require("./CustomUserStatusFormWithData"));
const CustomUserStatusService_1 = __importDefault(require("./CustomUserStatusService"));
const CustomUserStatusTable_1 = __importDefault(require("./CustomUserStatusTable"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const Page_1 = require("../../../components/Page");
const useIsEnterprise_1 = require("../../../hooks/useIsEnterprise");
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const CustomUserStatusRoute = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const route = (0, ui_contexts_1.useRoute)('user-status');
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    const canManageUserStatus = (0, ui_contexts_1.usePermission)('manage-user-status');
    const { data: license } = (0, useIsEnterprise_1.useIsEnterprise)();
    const presenceDisabled = (0, ui_contexts_1.useSetting)('Presence_broadcast_disabled', false);
    (0, react_1.useEffect)(() => {
        presenceDisabled && route.push({ context: 'presence-service' });
    }, [presenceDisabled, route]);
    const handleItemClick = (id) => {
        route.push({
            context: 'edit',
            id,
        });
    };
    const handleNewButtonClick = (0, react_1.useCallback)(() => {
        route.push({ context: 'new' });
    }, [route]);
    const handlePresenceServiceClick = (0, react_1.useCallback)(() => {
        route.push({ context: 'presence-service' });
    }, [route]);
    const handleClose = (0, react_1.useCallback)(() => {
        route.push({});
    }, [route]);
    const reload = (0, react_1.useRef)(() => null);
    const handleReload = (0, react_1.useCallback)(() => {
        reload.current();
    }, [reload]);
    if (!canManageUserStatus) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'row', children: [(0, jsx_runtime_1.jsxs)(Page_1.Page, { name: 'admin-user-status', children: [(0, jsx_runtime_1.jsxs)(Page_1.PageHeader, { title: t('User_Status'), children: [!(license === null || license === void 0 ? void 0 : license.isEnterprise) && (0, jsx_runtime_1.jsx)(CustomUserActiveConnections_1.default, {}), (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handlePresenceServiceClick, children: t('Presence_service') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleNewButtonClick, children: t('New_custom_status') })] })] }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsx)(CustomUserStatusTable_1.default, { reload: reload, onClick: handleItemClick }) })] }), context && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarDialog, { children: (0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarTitle, { children: [context === 'edit' && t('Custom_User_Status_Edit'), context === 'new' && t('Custom_User_Status_Add'), context === 'presence-service' && t('Presence_service_cap')] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: handleClose })] }), context === 'presence-service' && (0, jsx_runtime_1.jsx)(CustomUserStatusService_1.default, {}), (context === 'new' || context === 'edit') && ((0, jsx_runtime_1.jsx)(CustomUserStatusFormWithData_1.default, { _id: id, onClose: handleClose, onReload: handleReload }))] }) }))] }));
};
exports.default = CustomUserStatusRoute;
