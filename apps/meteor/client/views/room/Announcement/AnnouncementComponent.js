"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const AnnouncementComponent = ({ children, onClickOpen }) => {
    const announcementBar = (0, css_in_js_1.css) `
		background-color: ${fuselage_1.Palette.status['status-background-info'].theme('announcement-background')};
		color: ${fuselage_1.Palette.text['font-pure-black'].theme('announcement-text')};
		cursor: pointer;
		transition: transform 0.2s ease-out;
		a:link {
			color: ${fuselage_1.Palette.text['font-pure-black'].theme('announcement-text')};
			text-decoration: underline;
		}
		> * {
			flex: auto;
		}
		&:hover,
		&:focus {
			text-decoration: underline;
		}
	`;
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { onClick: onClickOpen, height: 'x40', pi: 24, alignItems: 'center', display: 'flex', fontScale: 'p2m', textAlign: 'center', className: announcementBar, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, w: 'none', "data-qa": 'AnnouncementAnnoucementComponent', children: children }) }));
};
exports.default = AnnouncementComponent;
