"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const EngagementDashboardCardFilter = ({ children = (0, jsx_runtime_1.jsx)(fuselage_1.InputBox.Skeleton, {}) }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { "rcx-card__row": true, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', wrap: 'no-wrap', pbe: 8, children: children && (0, jsx_runtime_1.jsx)(fuselage_1.Flex.Item, { grow: 0, children: children }) }));
exports.default = EngagementDashboardCardFilter;
