"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const HeaderToolbarActionBadge = (props) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: 'absolute', role: 'status', className: (0, css_in_js_1.css) `
			top: 0;
			right: 0;
			transform: translate(30%, -30%);
			z-index: 1;
		`, children: (0, jsx_runtime_1.jsx)(fuselage_1.Badge, Object.assign({}, props)) }));
exports.default = HeaderToolbarActionBadge;
