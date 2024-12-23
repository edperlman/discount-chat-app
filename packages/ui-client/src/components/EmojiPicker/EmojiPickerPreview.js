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
const EmojiPickerPreview = (_a) => {
    var { emoji, name } = _a, props = __rest(_a, ["emoji", "name"]);
    const previewEmojiClass = (0, css_in_js_1.css) `
		span {
			width: 40px;
			height: 40px;
		}
	`;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({}, props, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: previewEmojiClass, dangerouslySetInnerHTML: { __html: emoji } }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mis: 4, display: 'flex', flexDirection: 'column', maxWidth: 'x160', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'c2', withTruncatedText: true, children: name }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'c1', withTruncatedText: true, children: `:${name}:` })] })] })));
};
exports.default = EmojiPickerPreview;
