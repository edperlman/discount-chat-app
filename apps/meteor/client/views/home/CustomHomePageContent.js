"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const CustomHomePageContent = (props) => {
    const body = (0, ui_contexts_1.useSetting)('Layout_Home_Body', '');
    return (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ withRichContent: true, dangerouslySetInnerHTML: { __html: body } }, props));
};
exports.default = CustomHomePageContent;
