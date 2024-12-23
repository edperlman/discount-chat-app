"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = require("react");
const voipAnchorId = 'voip-root';
const VoipPopupPortal = ({ children }) => {
    return (0, jsx_runtime_1.jsx)(ui_client_1.AnchorPortal, { id: voipAnchorId, children: children });
};
exports.default = (0, react_1.memo)(VoipPopupPortal);
