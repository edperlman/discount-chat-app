"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPoweredBy = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const layout_1 = require("@rocket.chat/layout");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const LoginPoweredBy = () => {
    const hidePoweredBy = (0, ui_contexts_1.useSetting)('Layout_Login_Hide_Powered_By', false);
    if (hidePoweredBy) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 18, children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'registration.page.poweredBy', children: ['Powered by ', (0, jsx_runtime_1.jsx)(layout_1.Link, { href: 'https://rocket.chat/', target: '_blank', rel: 'noopener noreferrer', children: "Rocket.Chat" })] }) }));
};
exports.LoginPoweredBy = LoginPoweredBy;
exports.default = exports.LoginPoweredBy;
