"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const VoipPopupFooter = ({ children }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'footer', "data-testid": 'vc-popup-footer', p: 12, mbs: 'auto', bg: 'surface-light', borderRadius: '0 0 4px 4px', children: children }));
exports.default = VoipPopupFooter;
