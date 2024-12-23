"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const MessageFooterCalloutAction = (0, react_1.forwardRef)(function MessageFooterCalloutAction(props, ref) {
    return (0, jsx_runtime_1.jsx)(fuselage_1.Button, Object.assign({ mi: 4, ref: ref, primary: true, small: true, flexShrink: 0 }, props));
});
exports.default = MessageFooterCalloutAction;
