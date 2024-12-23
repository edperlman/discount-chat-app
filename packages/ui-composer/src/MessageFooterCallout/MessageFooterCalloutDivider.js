"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const MessageFooterCalloutDivider = (0, react_1.forwardRef)(function MessageFooterCalloutDivider(props, ref) {
    return (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'hr', ref: ref, borderInlineStart: '1px solid', mi: 4, flexShrink: 0 }, props));
});
exports.default = MessageFooterCalloutDivider;
