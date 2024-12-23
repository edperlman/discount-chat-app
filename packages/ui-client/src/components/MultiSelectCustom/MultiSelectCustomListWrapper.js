"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const MultiSelectCustomListWrapper = (0, react_1.forwardRef)(function MultiSelectCustomListWrapper({ children }, ref) {
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { ref: ref, zIndex: 999, w: 'full', position: 'absolute', mbs: 40, pbs: 4, children: children }));
});
exports.default = MultiSelectCustomListWrapper;
