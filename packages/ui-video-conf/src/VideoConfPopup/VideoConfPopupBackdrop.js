"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const backdropStyle = (0, css_in_js_1.css) `
	position: fixed;
	top: 0;
	min-width: 276px;
	[dir='ltr'] & {
		right: 0;
	}
	[dir='rtl'] & {
		left: 0;
	}
`;
const VideoConfPopupBackdrop = ({ children }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { m: 40, className: backdropStyle, children: children }));
exports.default = VideoConfPopupBackdrop;
