"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const WorkspaceCardTextSeparator = ({ icon, label, value, status }) => ((0, jsx_runtime_1.jsx)(ui_client_1.TextSeparator, { label: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [icon && (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: icon, size: 'x16', mie: 4 }), status && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { minWidth: 'x16', display: 'inline-flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.StatusBullet, { status: status }) })), label && label] }), value: value }));
exports.default = WorkspaceCardTextSeparator;
