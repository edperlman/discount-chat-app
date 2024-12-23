"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuditItems = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useHasLicenseModule_1 = require("../../../../hooks/useHasLicenseModule");
/**
 * @deprecated Feature preview
 * @description Should be moved to navbar when the feature became part of the core
 * @memberof navigationBar
 */
const useAuditItems = () => {
    const hasAuditLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('auditing') === true;
    const hasAuditPermission = (0, ui_contexts_1.usePermission)('can-audit') && hasAuditLicense;
    const hasAuditLogPermission = (0, ui_contexts_1.usePermission)('can-audit-log') && hasAuditLicense;
    const t = (0, ui_contexts_1.useTranslation)();
    const auditHomeRoute = (0, ui_contexts_1.useRoute)('audit-home');
    const auditSettingsRoute = (0, ui_contexts_1.useRoute)('audit-log');
    if (!hasAuditPermission && !hasAuditLogPermission) {
        return [];
    }
    const auditMessageItem = {
        id: 'messages',
        icon: 'document-eye',
        content: t('Messages'),
        onClick: () => auditHomeRoute.push(),
    };
    const auditLogItem = {
        id: 'auditLog',
        icon: 'document-eye',
        content: t('Logs'),
        onClick: () => auditSettingsRoute.push(),
    };
    return [hasAuditPermission && auditMessageItem, hasAuditLogPermission && auditLogItem].filter(Boolean);
};
exports.useAuditItems = useAuditItems;
