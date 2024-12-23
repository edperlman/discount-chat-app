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
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const SidebarHeaderToolbar_1 = __importDefault(require("./SidebarHeaderToolbar"));
const UserAvatarWithStatus_1 = __importDefault(require("./UserAvatarWithStatus"));
const UserMenu_1 = __importDefault(require("./UserMenu"));
const Administration_1 = __importDefault(require("./actions/Administration"));
const CreateRoom_1 = __importDefault(require("./actions/CreateRoom"));
const Directory_1 = __importDefault(require("./actions/Directory"));
const Home_1 = __importDefault(require("./actions/Home"));
const Login_1 = __importDefault(require("./actions/Login"));
const Search_1 = __importDefault(require("./actions/Search"));
const Sort_1 = __importDefault(require("./actions/Sort"));
/**
 * @deprecated Feature preview
 * @description Should be removed when the feature became part of the core
 * @memberof navigationBar
 */
const Header = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const user = (0, ui_contexts_1.useUser)();
    return ((0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreview, { feature: 'newNavigation', children: [(0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOff, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Sidebar.TopBar.Section, { children: [user ? (0, jsx_runtime_1.jsx)(UserMenu_1.default, { user: user }) : (0, jsx_runtime_1.jsx)(UserAvatarWithStatus_1.default, {}), (0, jsx_runtime_1.jsxs)(SidebarHeaderToolbar_1.default, { "aria-label": t('Sidebar_actions'), children: [(0, jsx_runtime_1.jsx)(Home_1.default, { title: t('Home') }), (0, jsx_runtime_1.jsx)(Search_1.default, { title: t('Search') }), user && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Directory_1.default, { title: t('Directory') }), (0, jsx_runtime_1.jsx)(Sort_1.default, { title: t('Display') }), (0, jsx_runtime_1.jsx)(CreateRoom_1.default, { title: t('Create_new'), "data-qa": 'sidebar-create' }), (0, jsx_runtime_1.jsx)(Administration_1.default, { title: t('Administration') })] })), !user && (0, jsx_runtime_1.jsx)(Login_1.default, { title: t('Login') })] })] }) }), (0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreviewOn, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.SidebarSection, { children: [user ? (0, jsx_runtime_1.jsx)(UserMenu_1.default, { user: user }) : (0, jsx_runtime_1.jsx)(UserAvatarWithStatus_1.default, {}), (0, jsx_runtime_1.jsxs)(SidebarHeaderToolbar_1.default, { "aria-label": t('Sidebar_actions'), children: [(0, jsx_runtime_1.jsx)(Home_1.default, { title: t('Home') }), (0, jsx_runtime_1.jsx)(Search_1.default, { title: t('Search') }), user && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Directory_1.default, { title: t('Directory') }), (0, jsx_runtime_1.jsx)(Sort_1.default, { title: t('Display') }), (0, jsx_runtime_1.jsx)(CreateRoom_1.default, { title: t('Create_new'), "data-qa": 'sidebar-create' }), (0, jsx_runtime_1.jsx)(Administration_1.default, { title: t('Administration') })] })), !user && (0, jsx_runtime_1.jsx)(Login_1.default, { title: t('Login') })] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.SidebarDivider, {})] })] }));
};
exports.default = (0, react_1.memo)(Header);
