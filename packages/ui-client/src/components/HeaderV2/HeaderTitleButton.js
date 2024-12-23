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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const HeaderTitleButton = (_a) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    const customClass = (0, css_in_js_1.css) `
		border-width: 1px;
		border-style: solid;
		border-color: transparent;

		&:hover {
			cursor: pointer;
			background-color: ${fuselage_1.Palette.surface['surface-hover']};
		}
		&:focus.focus-visible {
			outline: 0;
			box-shadow: 0 0 0 2px ${fuselage_1.Palette.stroke['stroke-extra-light-highlight']};
			border-color: ${fuselage_1.Palette.stroke['stroke-highlight']};
		}
	`;
    return (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ display: 'flex', alignItems: 'center', borderRadius: 4, withTruncatedText: true, className: [customClass, className] }, props));
};
exports.default = HeaderTitleButton;
