"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const AppsPageContent_1 = __importDefault(require("./AppsPageContent"));
const Page_1 = require("../../../components/Page");
const AppsPage = () => {
    return ((0, jsx_runtime_1.jsx)(Page_1.Page, { background: 'tint', children: (0, jsx_runtime_1.jsx)(AppsPageContent_1.default, {}) }));
};
exports.default = AppsPage;
