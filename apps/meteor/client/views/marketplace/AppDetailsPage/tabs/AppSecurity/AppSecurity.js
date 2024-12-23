"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AppSecurityLabel_1 = __importDefault(require("./AppSecurityLabel"));
const AppPermissionsList_1 = __importDefault(require("../../../components/AppPermissionsList"));
const AppSecurity = ({ privacyPolicySummary, appPermissions, tosLink, privacyLink }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { maxWidth: 'x640', w: 'full', marginInline: 'auto', color: 'default', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { block: 16, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'section', children: [(0, jsx_runtime_1.jsx)(AppSecurityLabel_1.default, { children: t('Privacy_summary') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', lineHeight: 'x20', children: (privacyPolicySummary === null || privacyPolicySummary === void 0 ? void 0 : privacyPolicySummary.length) && privacyPolicySummary })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'section', children: [(0, jsx_runtime_1.jsx)(AppSecurityLabel_1.default, { children: t('Permissions') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'ol', type: '1', style: { listStyleType: 'decimal' }, mis: 24, children: (0, jsx_runtime_1.jsx)(AppPermissionsList_1.default, { appPermissions: appPermissions }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'section', children: [(0, jsx_runtime_1.jsx)(AppSecurityLabel_1.default, { children: t('Policies') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', children: [tosLink && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'a', href: tosLink, target: '_blank', children: t('Terms_of_use') })), privacyLink && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'a', href: privacyLink, target: '_blank', children: t('Privacy_policy') }))] })] })] }) }) }));
};
exports.default = AppSecurity;
