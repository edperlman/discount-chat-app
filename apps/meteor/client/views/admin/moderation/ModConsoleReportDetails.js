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
const UserMessages_1 = __importDefault(require("./UserMessages"));
const UserReportInfo_1 = __importDefault(require("./UserReports/UserReportInfo"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const ModConsoleReportDetails = ({ userId, default: defaultTab, onRedirect }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const [tab, setTab] = (0, react_1.useState)(defaultTab);
    const moderationRoute = (0, ui_contexts_1.useRouter)();
    const activeTab = (0, ui_contexts_1.useRouteParameter)('tab');
    return ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarDialog, { children: (0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarTitle, { children: t('Reports') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: () => moderationRoute.navigate(`/admin/moderation/${activeTab}`, { replace: true }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Tabs, { paddingBlockStart: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.TabsItem, { selected: tab === 'messages', onClick: () => setTab('messages'), children: t('Messages') }), (0, jsx_runtime_1.jsx)(fuselage_1.TabsItem, { selected: tab === 'users', onClick: () => setTab('users'), children: t('User') })] }), tab === 'messages' && (0, jsx_runtime_1.jsx)(UserMessages_1.default, { userId: userId, onRedirect: onRedirect }), tab === 'users' && (0, jsx_runtime_1.jsx)(UserReportInfo_1.default, { userId: userId })] }) }));
};
exports.default = ModConsoleReportDetails;
