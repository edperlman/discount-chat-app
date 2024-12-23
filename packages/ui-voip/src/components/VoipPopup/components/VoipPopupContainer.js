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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const styled_1 = __importDefault(require("@rocket.chat/styled"));
const react_aria_1 = require("react-aria");
const Container = (0, styled_1.default)('article', (_a) => {
    var { secondary: _secondary, position: _position } = _a, props = __rest(_a, ["secondary", "position"]);
    return props;
}) `
	position: fixed;
	top: ${(p) => { var _a; return (((_a = p.position) === null || _a === void 0 ? void 0 : _a.top) !== undefined ? `${p.position.top}px` : 'initial'); }};
	right: ${(p) => { var _a; return (((_a = p.position) === null || _a === void 0 ? void 0 : _a.right) !== undefined ? `${p.position.right}px` : 'initial'); }};
	bottom: ${(p) => { var _a; return (((_a = p.position) === null || _a === void 0 ? void 0 : _a.bottom) !== undefined ? `${p.position.bottom}px` : 'initial'); }};
	left: ${(p) => { var _a; return (((_a = p.position) === null || _a === void 0 ? void 0 : _a.left) !== undefined ? `${p.position.left}px` : 'initial'); }};
	display: flex;
	flex-direction: column;
	width: 250px;
	min-height: 128px;
	border-radius: 4px;
	border: 1px solid ${fuselage_1.Palette.stroke['stroke-dark'].toString()};
	box-shadow: 0px 0px 1px 0px ${fuselage_1.Palette.shadow['shadow-elevation-2x'].toString()},
		0px 0px 12px 0px ${fuselage_1.Palette.shadow['shadow-elevation-2y'].toString()};
	background-color: ${(p) => (p.secondary ? fuselage_1.Palette.surface['surface-neutral'].toString() : fuselage_1.Palette.surface['surface-light'].toString())};
	z-index: 100;
`;
const VoipPopupContainer = (_a) => {
    var { children, secondary = false, position = { top: 0, left: 0 } } = _a, props = __rest(_a, ["children", "secondary", "position"]);
    return ((0, jsx_runtime_1.jsx)(react_aria_1.FocusScope, { autoFocus: true, restoreFocus: true, children: (0, jsx_runtime_1.jsx)(Container, Object.assign({ "aria-labelledby": 'voipPopupTitle', secondary: secondary, position: position }, props, { children: children })) }));
};
exports.default = VoipPopupContainer;
