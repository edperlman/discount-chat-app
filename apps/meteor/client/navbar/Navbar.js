"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const Navbar_1 = require("../components/Navbar");
const NavbarAdministrationAction_1 = __importDefault(require("./actions/NavbarAdministrationAction"));
const NavbarAuditAction_1 = __importDefault(require("./actions/NavbarAuditAction"));
const NavbarHomeAction_1 = __importDefault(require("./actions/NavbarHomeAction"));
const NavbarMarketplaceAction_1 = __importDefault(require("./actions/NavbarMarketplaceAction"));
const NavbarUserAction_1 = __importDefault(require("./actions/NavbarUserAction"));
const Navbar = () => {
    return ((0, jsx_runtime_1.jsxs)(Navbar_1.Navbar, { children: [(0, jsx_runtime_1.jsx)(NavbarUserAction_1.default, {}), (0, jsx_runtime_1.jsx)(NavbarHomeAction_1.default, {}), (0, jsx_runtime_1.jsx)(NavbarMarketplaceAction_1.default, {}), (0, jsx_runtime_1.jsx)(NavbarAuditAction_1.default, {}), (0, jsx_runtime_1.jsx)(NavbarAdministrationAction_1.default, {})] }));
};
exports.default = Navbar;
