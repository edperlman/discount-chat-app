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
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const MultiSelectCustomAnchor = (0, react_1.forwardRef)(function MultiSelectCustomAnchor(_a, ref) {
    var { className, collapsed, selectedOptionsCount, selectedOptionsTitle, defaultTitle, maxCount } = _a, props = __rest(_a, ["className", "collapsed", "selectedOptionsCount", "selectedOptionsTitle", "defaultTitle", "maxCount"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const customStyle = (0, css_in_js_1.css) `
		&:hover {
			cursor: pointer;
		}
	`;
    const isDirty = selectedOptionsCount > 0 && selectedOptionsCount !== maxCount - 1;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({ ref: ref, role: 'button', tabIndex: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', h: 'x40', className: ['rcx-input-box__wrapper', customStyle, ...(Array.isArray(className) ? className : [className])].filter(Boolean) }, props, { children: [isDirty ? `${t(selectedOptionsTitle)} (${selectedOptionsCount})` : t(defaultTitle), (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: collapsed ? 'chevron-up' : 'chevron-down', fontSize: 'x20', color: 'hint' })] })));
});
exports.default = MultiSelectCustomAnchor;
