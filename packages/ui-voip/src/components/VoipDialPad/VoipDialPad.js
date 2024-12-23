"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_aria_1 = require("react-aria");
const VoipDialPadButton_1 = __importDefault(require("./components/VoipDialPadButton"));
const VoipDialPadInput_1 = __importDefault(require("./components/VoipDialPadInput"));
const DIGITS = [
    ['1', ''],
    ['2', 'ABC'],
    ['3', 'DEF'],
    ['4', 'GHI'],
    ['5', 'JKL'],
    ['6', 'MNO'],
    ['7', 'PQRS'],
    ['8', 'TUV'],
    ['9', 'WXYZ'],
    ['*', ''],
    ['0', '+', '+'],
    ['#', ''],
];
const dialPadClassName = (0, css_in_js_1.css) `
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	padding: 8px 8px 12px;

	> button {
		margin: 4px;
	}
`;
const VoipDialPad = ({ editable = false, value, longPress = true, onChange }) => ((0, jsx_runtime_1.jsx)(react_aria_1.FocusScope, { autoFocus: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { bg: 'surface-light', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', pi: 12, pbs: 4, pbe: 8, bg: 'surface-neutral', children: (0, jsx_runtime_1.jsx)(VoipDialPadInput_1.default, { value: value, readOnly: !editable, onChange: (e) => onChange(e.currentTarget.value), onBackpaceClick: () => onChange(value.slice(0, -1)) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: dialPadClassName, maxWidth: 196, mi: 'auto', children: DIGITS.map(([primaryDigit, subDigit, longPressDigit]) => ((0, jsx_runtime_1.jsx)(VoipDialPadButton_1.default, { digit: primaryDigit, subDigit: subDigit, longPressDigit: longPress ? longPressDigit : undefined, onClick: (digit) => onChange(`${value}${digit}`, digit) }, primaryDigit))) })] }) }));
exports.default = VoipDialPad;
