"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const VersionCardActionItem = ({ icon, label, danger }) => {
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', color: danger ? 'danger' : 'secondary-info', fontScale: 'p2m', children: [(0, jsx_runtime_1.jsx)(fuselage_1.FramedIcon, { danger: danger, icon: icon }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mis: 12, children: label })] }));
};
exports.default = VersionCardActionItem;
