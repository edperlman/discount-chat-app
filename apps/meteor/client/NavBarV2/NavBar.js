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
const toolbar_1 = require("@react-aria/toolbar");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const ui_voip_1 = require("@rocket.chat/ui-voip");
const react_1 = __importStar(require("react"));
const NavBarOmnichannelToolbar_1 = require("./NavBarOmnichannelToolbar");
const NavBarPagesToolbar_1 = require("./NavBarPagesToolbar");
const NavBarSettingsToolbar_1 = require("./NavBarSettingsToolbar");
const NavBarVoipToolbar_1 = require("./NavBarVoipToolbar");
const CallContext_1 = require("../contexts/CallContext");
const useOmnichannelEnabled_1 = require("../hooks/omnichannel/useOmnichannelEnabled");
const useOmnichannelShowQueueLink_1 = require("../hooks/omnichannel/useOmnichannelShowQueueLink");
const useHasLicenseModule_1 = require("../hooks/useHasLicenseModule");
const NavBar = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const user = (0, ui_contexts_1.useUser)();
    const hasAuditLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('auditing') === true;
    const showOmnichannel = (0, useOmnichannelEnabled_1.useOmnichannelEnabled)();
    const hasManageAppsPermission = (0, ui_contexts_1.usePermission)('manage-apps');
    const hasAccessMarketplacePermission = (0, ui_contexts_1.usePermission)('access-marketplace');
    const showMarketplace = hasAccessMarketplacePermission || hasManageAppsPermission;
    const showOmnichannelQueueLink = (0, useOmnichannelShowQueueLink_1.useOmnichannelShowQueueLink)();
    const isCallEnabled = (0, CallContext_1.useIsCallEnabled)();
    const isCallReady = (0, CallContext_1.useIsCallReady)();
    const { isEnabled: showVoip } = (0, ui_voip_1.useVoipState)();
    const pagesToolbarRef = (0, react_1.useRef)(null);
    const { toolbarProps: pagesToolbarProps } = (0, toolbar_1.useToolbar)({ 'aria-label': t('Pages') }, pagesToolbarRef);
    const omnichannelToolbarRef = (0, react_1.useRef)(null);
    const { toolbarProps: omnichannelToolbarProps } = (0, toolbar_1.useToolbar)({ 'aria-label': t('Omnichannel') }, omnichannelToolbarRef);
    const voipToolbarRef = (0, react_1.useRef)(null);
    const { toolbarProps: voipToolbarProps } = (0, toolbar_1.useToolbar)({ 'aria-label': t('Voice_Call') }, voipToolbarRef);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.NavBar, { "aria-label": 'header', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.NavBarSection, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.NavBarGroup, Object.assign({ role: 'toolbar', ref: pagesToolbarRef }, pagesToolbarProps, { children: [(0, jsx_runtime_1.jsx)(NavBarPagesToolbar_1.NavBarItemHomePage, { title: t('Home') }), (0, jsx_runtime_1.jsx)(NavBarPagesToolbar_1.NavBarItemDirectoryPage, { title: t('Directory') }), showMarketplace && (0, jsx_runtime_1.jsx)(NavBarPagesToolbar_1.NavBarItemMarketPlaceMenu, {}), hasAuditLicense && (0, jsx_runtime_1.jsx)(NavBarPagesToolbar_1.NavBarItemAuditMenu, {})] })), showOmnichannel && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.NavBarDivider, {}), (0, jsx_runtime_1.jsxs)(fuselage_1.NavBarGroup, Object.assign({ role: 'toolbar', ref: omnichannelToolbarRef }, omnichannelToolbarProps, { children: [showOmnichannelQueueLink && (0, jsx_runtime_1.jsx)(NavBarOmnichannelToolbar_1.NavBarItemOmnichannelQueue, { title: t('Queue') }), isCallReady && (0, jsx_runtime_1.jsx)(NavBarOmnichannelToolbar_1.NavBarItemOmniChannelCallDialPad, {}), (0, jsx_runtime_1.jsx)(NavBarOmnichannelToolbar_1.NavBarItemOmnichannelContact, { title: t('Contact_Center') }), isCallEnabled && (0, jsx_runtime_1.jsx)(NavBarOmnichannelToolbar_1.NavBarItemOmnichannelCallToggle, {}), (0, jsx_runtime_1.jsx)(NavBarOmnichannelToolbar_1.NavBarItemOmnichannelLivechatToggle, {})] }))] })), showVoip && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.NavBarDivider, {}), (0, jsx_runtime_1.jsx)(fuselage_1.NavBarGroup, Object.assign({ role: 'toolbar', ref: voipToolbarRef }, voipToolbarProps, { children: (0, jsx_runtime_1.jsx)(NavBarVoipToolbar_1.NavBarItemVoipDialer, { primary: isCallEnabled }) }))] }))] }), (0, jsx_runtime_1.jsx)(fuselage_1.NavBarSection, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.NavBarGroup, { "aria-label": t('Workspace_and_user_settings'), children: [(0, jsx_runtime_1.jsx)(NavBarSettingsToolbar_1.NavBarItemAdministrationMenu, {}), user ? (0, jsx_runtime_1.jsx)(NavBarSettingsToolbar_1.UserMenu, { user: user }) : (0, jsx_runtime_1.jsx)(NavBarSettingsToolbar_1.NavBarItemLoginPage, {})] }) })] }));
};
exports.default = NavBar;
