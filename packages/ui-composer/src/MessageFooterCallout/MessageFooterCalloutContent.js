"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const MessageFooterCalloutContent = (0, react_1.forwardRef)(function MessageFooterCalloutContent(props, ref) {
    return (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ mi: 4, ref: ref, flexWrap: 'wrap', textAlign: 'center', color: 'default', flexGrow: 1, flexShrink: 1 }, props));
});
exports.default = MessageFooterCalloutContent;
