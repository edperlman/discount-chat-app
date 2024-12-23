"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const ContactInfoDetailsEntry_1 = __importDefault(require("./ContactInfoDetailsEntry"));
const parseOutboundPhoneNumber_1 = require("../../../../../lib/voip/parseOutboundPhoneNumber");
const ContactInfoDetailsGroup = ({ type, label, values }) => {
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 4, fontScale: 'p2', children: label }), values.map((value, index) => ((0, jsx_runtime_1.jsx)(ContactInfoDetailsEntry_1.default, { isPhone: type === 'phone', icon: type === 'phone' ? 'phone' : 'mail', value: type === 'phone' ? (0, parseOutboundPhoneNumber_1.parseOutboundPhoneNumber)(value) : value }, index)))] }));
};
exports.default = ContactInfoDetailsGroup;
