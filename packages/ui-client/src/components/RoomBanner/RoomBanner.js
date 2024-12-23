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
exports.RoomBanner = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const clickable = (0, css_in_js_1.css) `
	cursor: pointer;
	&:focus-visible {
		outline: ${fuselage_1.Palette.stroke['stroke-highlight']} solid 1px;
	}
`;
const style = (0, css_in_js_1.css) `
	background-color: ${fuselage_1.Palette.surface['surface-room']};
`;
const RoomBanner = (_a) => {
    var { onClick, className } = _a, props = __rest(_a, ["onClick", "className"]);
    const { isMobile } = (0, ui_contexts_1.useLayout)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ pi: isMobile ? 'x12' : 'x24', height: 'x44', w: 'full', display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', className: [style, onClick && clickable, ...(Array.isArray(className) ? className : [className])], onClick: onClick, tabIndex: onClick ? 0 : -1, role: onClick ? 'button' : 'banner', is: onClick ? 'button' : 'div' }, props)), (0, jsx_runtime_1.jsx)(fuselage_1.Divider, { mbs: -2, mbe: 0 })] }));
};
exports.RoomBanner = RoomBanner;
