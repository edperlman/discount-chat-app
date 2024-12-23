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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const re_resizable_1 = require("re-resizable");
const react_1 = __importDefault(require("react"));
const ContextualbarResizable = (_a) => {
    var { defaultWidth, children } = _a, props = __rest(_a, ["defaultWidth", "children"]);
    const [contextualbarWidth, setContextualbarWidth] = (0, fuselage_hooks_1.useLocalStorage)('contextualbarWidth', defaultWidth);
    const [expanded] = (0, fuselage_hooks_1.useLocalStorage)('expand-threads', false);
    const handleStyle = (0, css_in_js_1.css) `
		height: 100%;
		&:hover {
			background-color: ${fuselage_1.Palette.stroke['stroke-highlight']};
		}
	`;
    return ((0, jsx_runtime_1.jsx)(re_resizable_1.Resizable, Object.assign({}, props, { onResize: (_e, _dir, elRef) => {
            setContextualbarWidth(elRef.style.width);
        }, defaultSize: {
            width: contextualbarWidth,
            height: '100%',
        }, minWidth: defaultWidth, maxWidth: '50%', minHeight: '100%', handleStyles: { left: { width: '3px', zIndex: expanded ? 5 : 99, left: 0 } }, handleComponent: { left: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: handleStyle }) }, children: children })));
};
exports.default = ContextualbarResizable;
