"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_composer_1 = require("@rocket.chat/ui-composer");
const react_1 = __importDefault(require("react"));
const ComposerSkeleton = () => {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerSkeleton, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { height: 'x24' })] }));
};
exports.default = ComposerSkeleton;
