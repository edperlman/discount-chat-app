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
const EditRolePage_1 = __importDefault(require("./EditRolePage"));
const useRole_1 = require("./hooks/useRole");
const PageSkeleton_1 = __importDefault(require("../../../components/PageSkeleton"));
const useHasLicenseModule_1 = require("../../../hooks/useHasLicenseModule");
const EditRolePageWithData = ({ roleId }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const role = (0, useRole_1.useRole)(roleId);
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const hasCustomRolesModule = (0, useHasLicenseModule_1.useHasLicenseModule)('custom-roles');
    if (!role && context === 'edit') {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', children: t('error-invalid-role') });
    }
    if (hasCustomRolesModule === 'loading') {
        return (0, jsx_runtime_1.jsx)(PageSkeleton_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(EditRolePage_1.default, { role: role, isEnterprise: hasCustomRolesModule }, roleId);
};
exports.default = EditRolePageWithData;
