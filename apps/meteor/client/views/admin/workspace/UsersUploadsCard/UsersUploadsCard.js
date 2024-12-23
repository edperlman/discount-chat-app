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
const useFormatMemorySize_1 = require("../../../../hooks/useFormatMemorySize");
const useHasLicenseModule_1 = require("../../../../hooks/useHasLicenseModule");
const WorkspaceCardSection_1 = __importDefault(require("../components/WorkspaceCardSection"));
const WorkspaceCardTextSeparator_1 = __importDefault(require("../components/WorkspaceCardTextSeparator"));
const UsersUploadsCard = ({ statistics }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatMemorySize = (0, useFormatMemorySize_1.useFormatMemorySize)();
    const router = (0, ui_contexts_1.useRouter)();
    const handleEngagement = (0, fuselage_hooks_1.useMutableCallback)(() => {
        router.navigate('/admin/engagement');
    });
    const canViewEngagement = (0, useHasLicenseModule_1.useHasLicenseModule)('engagement-dashboard');
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Card, { height: 'full', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.CardBody, { flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(WorkspaceCardSection_1.default, { title: t('Users'), body: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Online'), status: 'online', value: statistics.onlineUsers }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Busy'), status: 'busy', value: statistics.busyUsers }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Away'), status: 'away', value: statistics.awayUsers }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Offline'), status: 'offline', value: statistics.offlineUsers }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Total'), value: statistics.totalUsers })] }) }), (0, jsx_runtime_1.jsx)(WorkspaceCardSection_1.default, { title: t('Types'), body: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Users_Connected'), value: statistics.totalConnectedUsers }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Stats_Active_Users'), value: statistics.activeUsers }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Stats_Active_Guests'), value: statistics.activeGuests }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Stats_Non_Active_Users'), value: statistics.nonActiveUsers }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Stats_App_Users'), value: statistics.appUsers })] }) }), (0, jsx_runtime_1.jsx)(WorkspaceCardSection_1.default, { title: t('Uploads'), body: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Stats_Total_Uploads'), value: statistics.uploadsTotal }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Stats_Total_Uploads_Size'), value: formatMemorySize(statistics.uploadsTotalSize) })] }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.CardControls, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { disabled: !canViewEngagement, medium: true, onClick: handleEngagement, children: t('See_on_Engagement_Dashboard') }) })] }));
};
exports.default = (0, react_1.memo)(UsersUploadsCard);
