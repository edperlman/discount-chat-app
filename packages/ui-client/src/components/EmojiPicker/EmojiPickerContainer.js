"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const EmojiPickerContainer = (0, react_1.forwardRef)(function EmojiPickerContainer(props, ref) {
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({}, props, { color: 'default', ref: ref, height: 'x480', bg: 'light', borderRadius: 4, display: 'flex', flexDirection: 'column', mb: 'neg-x12' })));
});
exports.default = EmojiPickerContainer;
