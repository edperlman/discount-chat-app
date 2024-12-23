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
const useClipboardWithToast_1 = __importDefault(require("../hooks/useClipboardWithToast"));
const defaultWrapperRenderer = (text) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontFamily: 'mono', alignSelf: 'center', fontScale: 'p2', style: { wordBreak: 'break-all' }, mie: 4, flexGrow: 1, maxHeight: 'x108', children: text }));
const TextCopy = (_a) => {
    var { text, wrapper = defaultWrapperRenderer } = _a, props = __rest(_a, ["text", "wrapper"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const { copy } = (0, useClipboardWithToast_1.default)(text);
    const handleClick = () => {
        copy();
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({ display: 'flex', flexDirection: 'row', justifyContent: 'stretch', alignItems: 'flex-start', flexGrow: 1, padding: 16, backgroundColor: 'surface', width: 'full' }, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Scrollable, { vertical: true, children: wrapper(text) }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'copy', secondary: true, square: true, small: true, flexShrink: 0, onClick: handleClick, title: t('Copy') })] })));
};
exports.default = TextCopy;
