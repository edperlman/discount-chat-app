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
exports.VideoConfPopupContainer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const styled_1 = __importDefault(require("@rocket.chat/styled"));
const react_1 = require("react");
exports.VideoConfPopupContainer = (0, styled_1.default)('div', (_a) => {
    var { position: _position } = _a, props = __rest(_a, ["position"]);
    return props;
}) `
	width: 100%;
	position: absolute;
	box-shadow: 0px 0px 1px 0px ${fuselage_1.Palette.shadow['shadow-elevation-2x'].toString()},
		0px 0px 12px 0px ${fuselage_1.Palette.shadow['shadow-elevation-2y'].toString()};
	background-color: ${fuselage_1.Palette.surface['surface-light'].toString()};
	border: 1px solid ${fuselage_1.Palette.stroke['stroke-extra-light'].toString()};
	top: ${(p) => (p.position ? `${p.position}px` : '0')};
	left: -${(p) => (p.position ? `${p.position}px` : '0')};
	border-radius: 0.25rem;
`;
const VideoConfPopup = (0, react_1.forwardRef)(function VideoConfPopup(_a, ref) {
    var { children, position } = _a, props = __rest(_a, ["children", "position"]);
    return ((0, jsx_runtime_1.jsx)(exports.VideoConfPopupContainer, Object.assign({ role: 'dialog', ref: ref, position: position }, props, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { p: 24, maxWidth: 'x276', color: 'default', children: children }) })));
});
exports.default = VideoConfPopup;
