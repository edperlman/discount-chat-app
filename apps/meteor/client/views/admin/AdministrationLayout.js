"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const AdminSidebar_1 = __importDefault(require("./sidebar/AdminSidebar"));
const SidebarPortal_1 = __importDefault(require("../../sidebar/SidebarPortal"));
const AdministrationLayout = ({ children }) => {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(SidebarPortal_1.default, { children: (0, jsx_runtime_1.jsx)(AdminSidebar_1.default, {}) }), children] }));
};
exports.default = AdministrationLayout;
