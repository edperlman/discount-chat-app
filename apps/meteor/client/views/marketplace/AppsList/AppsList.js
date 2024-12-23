"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const AppRow_1 = __importDefault(require("./AppRow"));
const AppsList = ({ apps, title, appsListId }) => {
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbe: 16, children: [title && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h2', id: appsListId, fontScale: 'h3', color: 'default', mbe: 20, children: title })), (0, jsx_runtime_1.jsx)(fuselage_1.CardGroup, { vertical: true, stretch: true, "aria-labelledby": appsListId, role: 'list', children: apps.map((app) => ((0, jsx_runtime_1.jsx)(AppRow_1.default, Object.assign({}, app), app.id))) })] }));
};
exports.default = AppsList;
