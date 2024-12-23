"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRedirectModerationConsole = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const useRedirectModerationConsole = (uid) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const hasPermissionToView = (0, ui_contexts_1.usePermission)('view-moderation-console');
    const router = (0, ui_contexts_1.useRoute)('moderation-console');
    // only rediret if user has permission else return undefined
    if (!hasPermissionToView) {
        return;
    }
    const redirectModerationConsoleAction = () => {
        router.push({ uid });
    };
    return {
        content: t('Moderation_Action_View_reports'),
        icon: 'warning',
        onClick: redirectModerationConsoleAction,
        type: 'privileges',
    };
};
exports.useRedirectModerationConsole = useRedirectModerationConsole;
