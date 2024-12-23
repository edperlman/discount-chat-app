"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const SettingSkeleton_1 = __importDefault(require("../Setting/SettingSkeleton"));
function SettingsSectionSkeleton() {
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Accordion.Item, { noncollapsible: true, title: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}), children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', color: 'hint', fontScale: 'p2', children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: Array.from({ length: 10 }).map((_, i) => ((0, jsx_runtime_1.jsx)(SettingSkeleton_1.default, {}, i))) })] }));
}
exports.default = SettingsSectionSkeleton;
