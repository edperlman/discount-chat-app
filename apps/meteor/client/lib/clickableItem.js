"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clickableItem = clickableItem;
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
// TODO remove border from here
function clickableItem(Component) {
    var _a, _b;
    const clickable = (0, css_in_js_1.css) `
		cursor: pointer;
		&:hover,
		&:focus {
			background: ${fuselage_1.Palette.surface['surface-hover']};
		}
		border-bottom: 1px solid ${fuselage_1.Palette.stroke['stroke-extra-light']} !important;
	`;
    const WrappedComponent = (props) => (0, jsx_runtime_1.jsx)(Component, Object.assign({ className: clickable, tabIndex: 0 }, props));
    WrappedComponent.displayName = `clickableItem(${(_b = (_a = Component.displayName) !== null && _a !== void 0 ? _a : Component.name) !== null && _b !== void 0 ? _b : 'Component'})`;
    return WrappedComponent;
}
