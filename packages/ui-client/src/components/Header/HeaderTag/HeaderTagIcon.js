"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const HeaderTagIcon = ({ icon }) => {
    if (!icon) {
        return null;
    }
    return (0, react_1.isValidElement)(icon) ? ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { marginInlineEnd: 4, display: 'inline-block', verticalAlign: 'middle', children: icon })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Icon, Object.assign({ size: 'x12', mie: 4 }, icon)));
};
exports.default = HeaderTagIcon;
