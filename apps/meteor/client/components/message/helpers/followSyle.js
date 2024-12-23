"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followStyle = exports.anchor = void 0;
const css_in_js_1 = require("@rocket.chat/css-in-js");
exports.anchor = 'rcx-contextual-message__follow';
exports.followStyle = (0, css_in_js_1.css) `
	& .${exports.anchor} {
		opacity: 0;
	}
	.${exports.anchor}:focus, &:hover .${exports.anchor}, &:focus .${exports.anchor} {
		opacity: 1;
	}
`;
