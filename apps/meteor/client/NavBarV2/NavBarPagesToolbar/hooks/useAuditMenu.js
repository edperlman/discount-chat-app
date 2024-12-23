"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuditMenu = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const useHasLicenseModule_1 = require("../../../hooks/useHasLicenseModule");
const useAuditMenu = () => {
    const router = (0, ui_contexts_1.useRouter)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const hasAuditLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('auditing') === true;
    const hasAuditPermission = (0, ui_contexts_1.usePermission)('can-audit') && hasAuditLicense;
    const hasAuditLogPermission = (0, ui_contexts_1.usePermission)('can-audit-log') && hasAuditLicense;
    if (!hasAuditPermission && !hasAuditLogPermission) {
        return [];
    }
    const auditMessageItem = {
        id: 'messages',
        icon: 'document-eye',
        content: t('Messages'),
        onClick: () => router.navigate('/audit'),
    };
    const auditLogItem = {
        id: 'auditLog',
        icon: 'document-eye',
        content: t('Logs'),
        onClick: () => router.navigate('/audit-log'),
    };
    return [
        {
            title: t('Audit'),
            items: [hasAuditPermission && auditMessageItem, hasAuditLogPermission && auditLogItem].filter(Boolean),
        },
    ];
};
exports.useAuditMenu = useAuditMenu;
