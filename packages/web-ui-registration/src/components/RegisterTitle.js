"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterTitle = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const RegisterTitle = () => {
    const siteName = (0, ui_contexts_1.useSetting)('Site_Name', 'Rocket.Chat');
    const hideTitle = (0, ui_contexts_1.useSetting)('Layout_Login_Hide_Title', false);
    if (hideTitle) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("span", { id: 'welcomeTitle', children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'registration.component.welcome', children: ["Welcome to ", siteName, " workspace"] }) }));
};
exports.RegisterTitle = RegisterTitle;
