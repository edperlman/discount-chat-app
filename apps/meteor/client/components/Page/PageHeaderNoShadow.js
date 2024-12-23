"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Header_1 = require("../Header");
const SidebarToggler_1 = __importDefault(require("../SidebarToggler"));
const PageHeaderNoShadow = (_a) => {
    var { children = undefined, title, onClickBack } = _a, props = __rest(_a, ["children", "title", "onClickBack"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const { isMobile } = (0, ui_contexts_1.useLayout)();
    (0, ui_client_1.useDocumentTitle)(typeof title === 'string' ? title : undefined);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'header', borderBlockEndWidth: 'default', borderBlockEndColor: 'transparent' }, props, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { height: '100%', marginInline: 24, minHeight: 'x64', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', color: 'default', children: [isMobile && ((0, jsx_runtime_1.jsx)(Header_1.HeaderToolbar, { children: (0, jsx_runtime_1.jsx)(SidebarToggler_1.default, {}) })), onClickBack && (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { small: true, mie: 8, icon: 'arrow-back', onClick: onClickBack, title: t('Back') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h1', fontScale: 'h2', flexGrow: 1, "data-qa-type": 'PageHeader-title', children: title }), children] }) })));
};
exports.default = PageHeaderNoShadow;
