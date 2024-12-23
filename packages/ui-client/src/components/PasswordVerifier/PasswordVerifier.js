"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordVerifier = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const PasswordVerifierItem_1 = require("./PasswordVerifierItem");
const PasswordVerifier = ({ password, id, vertical }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const uniqueId = (0, fuselage_hooks_1.useUniqueId)();
    const passwordVerifications = (0, ui_contexts_1.useVerifyPassword)(password || '');
    if (!(passwordVerifications === null || passwordVerifications === void 0 ? void 0 : passwordVerifications.length)) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { id: id, hidden: true, children: t('Password_Policy_Aria_Description') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', mbs: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 8, fontScale: 'c2', id: uniqueId, "aria-hidden": true, children: t('Password_must_have') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexWrap: 'wrap', role: 'list', "aria-labelledby": uniqueId, children: passwordVerifications.map(({ isValid, limit, name }) => ((0, jsx_runtime_1.jsx)(PasswordVerifierItem_1.PasswordVerifierItem, { text: t(`${name}-label`, { limit }), isValid: isValid, "aria-invalid": !isValid, vertical: !!vertical }, name))) })] })] }));
};
exports.PasswordVerifier = PasswordVerifier;
