"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const HeaderDivider_1 = __importDefault(require("./HeaderDivider"));
const Header = (props) => {
    const { isMobile } = (0, ui_contexts_1.useLayout)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { "rcx-room-header": true, is: 'header', height: 'x64', display: 'flex', justifyContent: 'center', flexDirection: 'column', overflow: 'hidden', flexShrink: 0, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ height: 'x64', mi: 'neg-x4', pi: isMobile ? 'x12' : 'x24', display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row' }, props)), (0, jsx_runtime_1.jsx)(HeaderDivider_1.default, {})] }));
};
exports.default = Header;
