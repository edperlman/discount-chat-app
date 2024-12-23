"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const VoipPopupContent = ({ children }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'section', "data-testid": 'vc-popup-content', children: children }));
exports.default = VoipPopupContent;
