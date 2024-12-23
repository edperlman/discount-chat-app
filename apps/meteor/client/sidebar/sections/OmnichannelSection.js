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
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const OverMacLimitSection_1 = require("./OverMacLimitSection");
const actions_1 = require("./actions");
const CallContext_1 = require("../../contexts/CallContext");
const useIsOverMacLimit_1 = require("../../hooks/omnichannel/useIsOverMacLimit");
const useOmnichannelShowQueueLink_1 = require("../../hooks/omnichannel/useOmnichannelShowQueueLink");
const SidebarHeaderToolbar_1 = __importDefault(require("../header/SidebarHeaderToolbar"));
const OmnichannelSection = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const isCallEnabled = (0, CallContext_1.useIsCallEnabled)();
    const isCallReady = (0, CallContext_1.useIsCallReady)();
    const hasPermissionToSeeContactCenter = (0, ui_contexts_1.usePermission)('view-omnichannel-contact-center');
    const showOmnichannelQueueLink = (0, useOmnichannelShowQueueLink_1.useOmnichannelShowQueueLink)();
    const { sidebar } = (0, ui_contexts_1.useLayout)();
    const directoryRoute = (0, ui_contexts_1.useRoute)('omnichannel-directory');
    const queueListRoute = (0, ui_contexts_1.useRoute)('livechat-queue');
    const isWorkspaceOverMacLimit = (0, useIsOverMacLimit_1.useIsOverMacLimit)();
    const handleRoute = (0, fuselage_hooks_1.useMutableCallback)((route) => {
        sidebar.toggle();
        switch (route) {
            case 'directory':
                directoryRoute.push({});
                break;
            case 'queue':
                queueListRoute.push({});
                break;
        }
    });
    // The className is a paliative while we make TopBar.ToolBox optional on fuselage
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isWorkspaceOverMacLimit && (0, jsx_runtime_1.jsx)(OverMacLimitSection_1.OverMacLimitSection, {}), (0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreview, { feature: 'newNavigation', children: [(0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOff, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Sidebar.TopBar.Section, { "aria-label": t('Omnichannel_actions'), className: 'omnichannel-sidebar', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.TopBar.Title, { children: t('Omnichannel') }), (0, jsx_runtime_1.jsxs)(SidebarHeaderToolbar_1.default, { children: [showOmnichannelQueueLink && ((0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.TopBar.Action, { icon: 'queue', "data-tooltip": t('Queue'), onClick: () => handleRoute('queue') })), isCallEnabled && (0, jsx_runtime_1.jsx)(actions_1.OmnichannelCallToggle, {}), (0, jsx_runtime_1.jsx)(actions_1.OmnichannelLivechatToggle, {}), hasPermissionToSeeContactCenter && ((0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.TopBar.Action, { "data-tooltip": t('Contact_Center'), "aria-label": t('Contact_Center'), icon: 'address-book', onClick: () => handleRoute('directory') })), isCallReady && (0, jsx_runtime_1.jsx)(actions_1.OmniChannelCallDialPad, {})] })] }) }), (0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreviewOn, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.SidebarSection, { "aria-label": t('Omnichannel_actions'), children: [(0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.TopBar.Title, { children: t('Omnichannel') }), (0, jsx_runtime_1.jsxs)(SidebarHeaderToolbar_1.default, { children: [showOmnichannelQueueLink && ((0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.TopBar.Action, { icon: 'queue', "data-tooltip": t('Queue'), onClick: () => handleRoute('queue') })), isCallEnabled && (0, jsx_runtime_1.jsx)(actions_1.OmnichannelCallToggle, {}), (0, jsx_runtime_1.jsx)(actions_1.OmnichannelLivechatToggle, {}), hasPermissionToSeeContactCenter && ((0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.TopBar.Action, { "data-tooltip": t('Contact_Center'), "aria-label": t('Contact_Center'), icon: 'address-book', onClick: () => handleRoute('directory') })), isCallReady && (0, jsx_runtime_1.jsx)(actions_1.OmniChannelCallDialPad, {})] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.SidebarDivider, {})] })] })] }));
};
exports.default = (0, react_1.memo)(OmnichannelSection);
