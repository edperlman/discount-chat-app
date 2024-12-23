"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const SKELETON_ITEMS = 3;
const AccordionLoading = () => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: Array.from({ length: SKELETON_ITEMS }, (_v, k) => ((0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: '80px', m: '2px' }, k))) }));
exports.default = AccordionLoading;
