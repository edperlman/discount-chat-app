"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdministrationMenu = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const ADMIN_PERMISSIONS = [
    'view-statistics',
    'run-import',
    'view-user-administration',
    'view-room-administration',
    'create-invite-links',
    'manage-cloud',
    'view-logs',
    'manage-sounds',
    'view-federation-data',
    'manage-email-inbox',
    'manage-emoji',
    'manage-outgoing-integrations',
    'manage-own-outgoing-integrations',
    'manage-incoming-integrations',
    'manage-own-incoming-integrations',
    'manage-oauth-apps',
    'access-mailer',
    'manage-user-status',
    'access-permissions',
    'access-setting-permissions',
    'view-privileged-setting',
    'edit-privileged-setting',
    'manage-selected-settings',
    'view-engagement-dashboard',
    'view-moderation-console',
];
const useAdministrationMenu = () => {
    const router = (0, ui_contexts_1.useRouter)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const isAdmin = (0, ui_contexts_1.useAtLeastOnePermission)(ADMIN_PERMISSIONS);
    const isOmnichannel = (0, ui_contexts_1.usePermission)('view-livechat-manager');
    const workspace = {
        id: 'workspace',
        content: t('Workspace'),
        onClick: () => router.navigate('/admin'),
    };
    const omnichannel = {
        id: 'omnichannel',
        content: t('Omnichannel'),
        onClick: () => router.navigate('/omnichannel/current'),
    };
    return [
        {
            title: t('Manage'),
            items: [isAdmin && workspace, isOmnichannel && omnichannel].filter(Boolean),
        },
    ];
};
exports.useAdministrationMenu = useAdministrationMenu;
