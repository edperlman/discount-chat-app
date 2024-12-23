"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const useLongPress_1 = require("./hooks/useLongPress");
const padButtonStyle = (0, css_in_js_1.css) `
	background-color: transparent;
	width: 94px;
	height: 64px;
	padding: 8px;
	margin: 8px;
	border: none;
	display: flex;
	flex-direction: column;
	align-items: center;

	&:hover {
		background-color: ${fuselage_1.Palette.surface['surface-neutral']};
	}
`;
const PadButton = ({ children, onClickPadButton, onLongPressPadButton, }) => {
    const [firstDigit, secondDigit] = children;
    const { onClick, onMouseDown, onMouseUp, onTouchStart, onTouchEnd } = (0, useLongPress_1.useLongPress)(() => onLongPressPadButton(secondDigit), {
        onClick: () => onClickPadButton(firstDigit),
    });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Button, { className: padButtonStyle, onClick: onClick, onMouseDown: onMouseDown, onMouseUp: onMouseUp, onTouchStart: onTouchStart, onTouchEnd: onTouchEnd, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', fontSize: 'h2', lineHeight: '32px', children: firstDigit }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', fontSize: 'c1', lineHeight: '16px', color: 'hint', children: secondDigit })] }));
};
exports.default = PadButton;
