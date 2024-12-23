"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdministrationMenu = void 0;
const react_i18next_1 = require("react-i18next");
const useAdministrationItems_1 = require("./useAdministrationItems");
const useAppsItems_1 = require("./useAppsItems");
const useAuditItems_1 = require("./useAuditItems");
const useAdministrationMenu = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const administrationItems = (0, useAdministrationItems_1.useAdministrationItems)();
    const appItems = (0, useAppsItems_1.useAppsItems)();
    const auditItems = (0, useAuditItems_1.useAuditItems)();
    return [
        administrationItems.length && { title: t('Administration'), items: administrationItems },
        appItems.length && { title: t('Apps'), items: appItems },
        auditItems.length && { title: t('Audit'), items: auditItems },
    ].filter(Boolean);
};
exports.useAdministrationMenu = useAdministrationMenu;
