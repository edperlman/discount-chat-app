"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const HomePageHeader_1 = __importDefault(require("./HomePageHeader"));
const CustomContentCard_1 = __importDefault(require("./cards/CustomContentCard"));
const Page_1 = __importDefault(require("../../components/Page/Page"));
const PageScrollableContentWithShadow_1 = __importDefault(require("../../components/Page/PageScrollableContentWithShadow"));
const CustomHomePage = () => {
    return ((0, jsx_runtime_1.jsxs)(Page_1.default, { "data-qa": 'page-home', "data-qa-type": 'custom', color: 'default', background: 'tint', children: [(0, jsx_runtime_1.jsx)(HomePageHeader_1.default, {}), (0, jsx_runtime_1.jsx)(PageScrollableContentWithShadow_1.default, { children: (0, jsx_runtime_1.jsx)(CustomContentCard_1.default, {}) })] }));
};
exports.default = CustomHomePage;
