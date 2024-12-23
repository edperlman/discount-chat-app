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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const ChannelsTab_1 = __importDefault(require("./channels/ChannelsTab"));
const MessagesTab_1 = __importDefault(require("./messages/MessagesTab"));
const UsersTab_1 = __importDefault(require("./users/UsersTab"));
const Page_1 = require("../../../components/Page");
const EngagementDashboardPage = ({ tab = 'users', onSelectTab }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const timezoneOptions = (0, react_1.useMemo)(() => [
        ['utc', t('UTC_Timezone')],
        ['local', t('Local_Timezone')],
    ], [t]);
    const [timezoneId, setTimezoneId] = (0, react_1.useState)('utc');
    const handleTimezoneChange = (timezoneId) => setTimezoneId(timezoneId);
    const handleTabClick = (0, react_1.useCallback)((tab) => (onSelectTab ? () => onSelectTab(tab) : undefined), [onSelectTab]);
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { background: 'tint', children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Engagement'), children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { options: timezoneOptions, value: timezoneId, onChange: (value) => handleTimezoneChange(String(value)), "aria-label": t('Default_Timezone_For_Reporting') }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Tabs, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: tab === 'users', onClick: handleTabClick('users'), children: t('Users') }), (0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: tab === 'messages', onClick: handleTabClick('messages'), children: t('Messages') }), (0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: tab === 'channels', onClick: handleTabClick('channels'), children: t('Channels') })] }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContent, { padding: 0, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { m: 24, children: (tab === 'users' && (0, jsx_runtime_1.jsx)(UsersTab_1.default, { timezone: timezoneId })) ||
                        (tab === 'messages' && (0, jsx_runtime_1.jsx)(MessagesTab_1.default, {})) ||
                        (tab === 'channels' && (0, jsx_runtime_1.jsx)(ChannelsTab_1.default, {})) }) })] }));
};
exports.default = EngagementDashboardPage;
