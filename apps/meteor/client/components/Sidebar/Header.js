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
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Header = (_a) => {
    var { title, onClose, children } = _a, props = __rest(_a, ["title", "onClose", "children"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({ display: 'flex', flexDirection: 'column', pb: 16 }, props, { children: [(title || onClose) && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', pi: 24, justifyContent: 'space-between', flexGrow: 1, children: [title && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'default', fontScale: 'p2b', flexShrink: 1, withTruncatedText: true, children: title })), onClose && (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { small: true, "aria-label": t('Close'), icon: 'cross', onClick: onClose })] })), children] })));
};
exports.default = Header;
