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
const react_i18next_1 = require("react-i18next");
const Page_1 = require("../../components/Page");
const ChannelsTab_1 = __importDefault(require("./tabs/channels/ChannelsTab"));
const TeamsTab_1 = __importDefault(require("./tabs/teams/TeamsTab"));
const UsersTab_1 = __importDefault(require("./tabs/users/UsersTab"));
const DirectoryPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const defaultTab = (0, ui_contexts_1.useSetting)('Accounts_Directory_DefaultView', 'users');
    const federationEnabled = (0, ui_contexts_1.useSetting)('FEDERATION_Enabled');
    const tab = (0, ui_contexts_1.useRouteParameter)('tab');
    const router = (0, ui_contexts_1.useRouter)();
    (0, react_1.useEffect)(() => router.subscribeToRouteChange(() => {
        if (router.getRouteName() !== 'directory') {
            return;
        }
        const { tab } = router.getRouteParameters();
        if (!tab || (tab === 'external' && !federationEnabled)) {
            router.navigate(`/directory/${defaultTab}`, { replace: true });
        }
    }), [router, federationEnabled, defaultTab]);
    const handleTabClick = (0, react_1.useCallback)((tab) => () => router.navigate(`/directory/${tab}`), [router]);
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { background: 'room', children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Directory') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Tabs, { flexShrink: 0, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: tab === 'channels', onClick: handleTabClick('channels'), children: t('Channels') }), (0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: tab === 'users', onClick: handleTabClick('users'), children: t('Users') }), (0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: tab === 'teams', onClick: handleTabClick('teams'), children: t('Teams') }), federationEnabled && ((0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: tab === 'external', onClick: handleTabClick('external'), children: t('External_Users') }))] }), (0, jsx_runtime_1.jsxs)(Page_1.PageContent, { children: [tab === 'channels' && (0, jsx_runtime_1.jsx)(ChannelsTab_1.default, {}), tab === 'users' && (0, jsx_runtime_1.jsx)(UsersTab_1.default, {}), tab === 'teams' && (0, jsx_runtime_1.jsx)(TeamsTab_1.default, {}), federationEnabled && tab === 'external' && (0, jsx_runtime_1.jsx)(UsersTab_1.default, { workspace: 'external' })] })] }));
};
exports.default = DirectoryPage;
