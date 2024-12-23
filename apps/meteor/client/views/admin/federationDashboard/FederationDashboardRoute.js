"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const FederationDashboardPage_1 = __importDefault(require("./FederationDashboardPage"));
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const FederationDashboardRoute = () => {
    const authorized = (0, ui_contexts_1.useRole)('admin');
    if (!authorized) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(FederationDashboardPage_1.default, {});
};
exports.default = FederationDashboardRoute;
