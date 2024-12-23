"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomBannerContent = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const RoomBannerContent = (props) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ fontScale: 'p2', p: 4, flexGrow: 1, withTruncatedText: true, className: (0, css_in_js_1.css) `
			color: ${fuselage_1.Palette.text['font-hint']};
		` }, props)));
exports.RoomBannerContent = RoomBannerContent;
