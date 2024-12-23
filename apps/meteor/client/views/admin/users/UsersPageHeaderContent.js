"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const SeatsCapUsage_1 = __importDefault(require("./SeatsCapUsage"));
const AssignExtensionButton_1 = __importDefault(require("./voip/AssignExtensionButton"));
const useExternalLink_1 = require("../../../hooks/useExternalLink");
const useCheckoutUrl_1 = require("../subscription/hooks/useCheckoutUrl");
const useVoipExtensionPermission_1 = require("./voip/hooks/useVoipExtensionPermission");
const UsersPageHeaderContent = ({ isSeatsCapExceeded, seatsCap }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const canCreateUser = (0, ui_contexts_1.usePermission)('create-user');
    const canBulkCreateUser = (0, ui_contexts_1.usePermission)('bulk-register-user');
    const canManageVoipExtension = (0, useVoipExtensionPermission_1.useVoipExtensionPermission)();
    const manageSubscriptionUrl = (0, useCheckoutUrl_1.useCheckoutUrl)()({ target: 'user-page', action: 'buy_more' });
    const openExternalLink = (0, useExternalLink_1.useExternalLink)();
    const handleNewButtonClick = () => {
        router.navigate('/admin/users/new');
    };
    const handleInviteButtonClick = () => {
        router.navigate('/admin/users/invite');
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [seatsCap && seatsCap.maxActiveUsers < Number.POSITIVE_INFINITY && ((0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inline: 16, children: (0, jsx_runtime_1.jsx)(SeatsCapUsage_1.default, { members: seatsCap.activeUsers, limit: seatsCap.maxActiveUsers }) })), (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [canManageVoipExtension && (0, jsx_runtime_1.jsx)(AssignExtensionButton_1.default, {}), canBulkCreateUser && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'mail', onClick: handleInviteButtonClick, disabled: isSeatsCapExceeded, children: t('Invite') })), canCreateUser && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'user-plus', onClick: handleNewButtonClick, disabled: isSeatsCapExceeded, children: t('New_user') })), isSeatsCapExceeded && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, role: 'link', onClick: () => openExternalLink(manageSubscriptionUrl), children: t('Buy_more_seats') }))] })] }));
};
exports.default = UsersPageHeaderContent;
