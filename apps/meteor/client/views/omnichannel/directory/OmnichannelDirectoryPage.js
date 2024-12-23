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
const ContextualBarRouter_1 = __importDefault(require("./ContextualBarRouter"));
const CallTab_1 = __importDefault(require("./calls/CallTab"));
const ChatsTab_1 = __importDefault(require("./chats/ChatsTab"));
const ContactTab_1 = __importDefault(require("./contacts/ContactTab"));
const ChatsProvider_1 = __importDefault(require("./providers/ChatsProvider"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const Page_1 = require("../../../components/Page");
const DEFAULT_TAB = 'chats';
const OmnichannelDirectoryPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const tab = (0, ui_contexts_1.useRouteParameter)('tab');
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    (0, react_1.useEffect)(() => router.subscribeToRouteChange(() => {
        if (router.getRouteName() !== 'omnichannel-directory' || !!router.getRouteParameters().tab) {
            return;
        }
        router.navigate({
            name: 'omnichannel-directory',
            params: { tab: DEFAULT_TAB },
        });
    }), [router]);
    const handleTabClick = (0, react_1.useCallback)((tab) => router.navigate({ name: 'omnichannel-directory', params: { tab } }), [router]);
    return ((0, jsx_runtime_1.jsx)(ChatsProvider_1.default, { children: (0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'row', children: [(0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Omnichannel_Contact_Center') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Tabs, { flexShrink: 0, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: tab === 'chats', onClick: () => handleTabClick('chats'), children: t('Chats') }), (0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: tab === 'contacts', onClick: () => handleTabClick('contacts'), children: t('Contacts') }), (0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: tab === 'calls', onClick: () => handleTabClick('calls'), children: t('Calls') })] }), (0, jsx_runtime_1.jsxs)(Page_1.PageContent, { children: [tab === 'chats' && (0, jsx_runtime_1.jsx)(ChatsTab_1.default, {}), tab === 'contacts' && (0, jsx_runtime_1.jsx)(ContactTab_1.default, {}), tab === 'calls' && (0, jsx_runtime_1.jsx)(CallTab_1.default, {})] })] }), context && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarDialog, { children: (0, jsx_runtime_1.jsx)(ContextualBarRouter_1.default, {}) }))] }) }));
};
exports.default = OmnichannelDirectoryPage;
