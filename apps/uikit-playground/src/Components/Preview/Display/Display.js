"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const Surface_1 = __importDefault(require("./Surface/Surface"));
const Display = () => ((0, jsx_runtime_1.jsx)(fuselage_1.Scrollable, { vertical: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { height: '100%', width: '100%', borderInlineStart: 'var(--default-border)', children: (0, jsx_runtime_1.jsx)(Surface_1.default, {}) }) }));
exports.default = Display;
