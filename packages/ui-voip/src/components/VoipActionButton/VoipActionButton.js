"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const VoipActionButton = ({ disabled, label, pressed, icon, danger, success, className, onClick }) => ((0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { medium: true, secondary: true, danger: danger, success: success, className: className, icon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: icon }), title: label, pressed: pressed, "aria-label": label, disabled: disabled, onClick: () => onClick === null || onClick === void 0 ? void 0 : onClick() }));
exports.default = VoipActionButton;
