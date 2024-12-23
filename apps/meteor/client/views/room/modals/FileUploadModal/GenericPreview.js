"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const formatBytes_1 = require("../../../../lib/utils/formatBytes");
const GenericPreview = ({ file }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', w: 'full', fontScale: 'h4', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'file', size: 'x24', mis: -2, mie: 4 }), `${file.name} - ${(0, formatBytes_1.formatBytes)(file.size, 2)}`] }));
exports.default = GenericPreview;
