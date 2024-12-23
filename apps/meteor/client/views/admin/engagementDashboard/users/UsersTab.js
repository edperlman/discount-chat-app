"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const EngagementDashboardCard_1 = __importDefault(require("../EngagementDashboardCard"));
const ActiveUsersSection_1 = __importDefault(require("./ActiveUsersSection"));
const BusiestChatTimesSection_1 = __importDefault(require("./BusiestChatTimesSection"));
const NewUsersSection_1 = __importDefault(require("./NewUsersSection"));
const UsersByTimeOfTheDaySection_1 = __importDefault(require("./UsersByTimeOfTheDaySection"));
const UsersTab = ({ timezone }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const isXxlScreen = (0, fuselage_hooks_1.useBreakpoints)().includes('xxl');
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(EngagementDashboardCard_1.default, { title: t('New_users'), children: (0, jsx_runtime_1.jsx)(NewUsersSection_1.default, { timezone: timezone }) }), (0, jsx_runtime_1.jsx)(EngagementDashboardCard_1.default, { title: t('Active_users'), children: (0, jsx_runtime_1.jsx)(ActiveUsersSection_1.default, { timezone: timezone }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexWrap: 'wrap', style: { columnGap: '16px' }, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Flex.Item, { grow: 1, shrink: 0, basis: isXxlScreen ? '0' : '100%', children: (0, jsx_runtime_1.jsx)(EngagementDashboardCard_1.default, { title: t('Users_by_time_of_day'), children: (0, jsx_runtime_1.jsx)(UsersByTimeOfTheDaySection_1.default, { timezone: timezone }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 1, flexShrink: 0, flexBasis: isXxlScreen ? '0' : '100%', children: (0, jsx_runtime_1.jsx)(EngagementDashboardCard_1.default, { title: t('When_is_the_chat_busier?'), children: (0, jsx_runtime_1.jsx)(BusiestChatTimesSection_1.default, { timezone: timezone }) }) })] })] }));
};
exports.default = UsersTab;
