"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdministrationItems = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
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
/**
 * @deprecated Feature preview
 * @description Should be moved to navbar when the feature became part of the core
 * @memberof navigationBar
 */
const useAdministrationItems = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const shouldShowAdminMenu = (0, ui_contexts_1.useAtLeastOnePermission)(ADMIN_PERMISSIONS);
    const adminRoute = (0, ui_contexts_1.useRoute)('admin-index');
    const omnichannel = (0, ui_contexts_1.usePermission)('view-livechat-manager');
    const omnichannelItem = {
        id: 'omnichannel',
        content: t('Omnichannel'),
        icon: 'headset',
        onClick: () => router.navigate('/omnichannel/current'),
    };
    const workspaceItem = {
        id: 'workspace',
        content: t('Workspace'),
        icon: 'cog',
        onClick: () => {
            adminRoute.push({ context: '/' });
        },
    };
    return [shouldShowAdminMenu && workspaceItem, omnichannel && omnichannelItem].filter(Boolean);
};
exports.useAdministrationItems = useAdministrationItems;
