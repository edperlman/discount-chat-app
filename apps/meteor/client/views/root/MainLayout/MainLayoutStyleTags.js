"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainLayoutStyleTags = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_theming_1 = require("@rocket.chat/ui-theming");
const react_1 = __importDefault(require("react"));
const codeBlockStyles_1 = require("../lib/codeBlockStyles");
const MainLayoutStyleTags = () => {
    const [, , theme] = (0, ui_theming_1.useThemeMode)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.PaletteStyleTag, { theme: theme, selector: '.rcx-content--main, .rcx-tile', tagId: `main-palette-${theme}` }), (0, jsx_runtime_1.jsx)(fuselage_1.PaletteStyleTag, { theme: 'dark', selector: '.rcx-sidebar--main, .rcx-navbar', tagId: 'sidebar-palette' }), theme === 'dark' && (0, jsx_runtime_1.jsx)(fuselage_1.PaletteStyleTag, { selector: '.rcx-content--main', palette: codeBlockStyles_1.codeBlock, tagId: 'codeBlock-palette' })] }));
};
exports.MainLayoutStyleTags = MainLayoutStyleTags;
