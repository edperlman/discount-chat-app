"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const PrivateEmptyStateDefault_1 = __importDefault(require("./PrivateEmptyStateDefault"));
const PrivateEmptyStateUpgrade_1 = __importDefault(require("./PrivateEmptyStateUpgrade"));
const usePrivateAppsEnabled_1 = require("../hooks/usePrivateAppsEnabled");
const PrivateEmptyState = () => {
    const privateAppsEnabled = (0, usePrivateAppsEnabled_1.usePrivateAppsEnabled)();
    return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: '24px', children: privateAppsEnabled ? (0, jsx_runtime_1.jsx)(PrivateEmptyStateDefault_1.default, {}) : (0, jsx_runtime_1.jsx)(PrivateEmptyStateUpgrade_1.default, {}) });
};
exports.default = PrivateEmptyState;
