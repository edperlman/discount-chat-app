"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const MarkupInteractionContext_1 = require("../MarkupInteractionContext");
const InlineElements_1 = __importDefault(require("../elements/InlineElements"));
const TaksListBlock = ({ tasks }) => {
    const { onTaskChecked } = (0, react_1.useContext)(MarkupInteractionContext_1.MarkupInteractionContext);
    return ((0, jsx_runtime_1.jsx)("ul", { className: 'task-list', children: tasks.map((item, index) => ((0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: item.status, onChange: onTaskChecked === null || onTaskChecked === void 0 ? void 0 : onTaskChecked(item) }), " ", (0, jsx_runtime_1.jsx)(InlineElements_1.default, { children: item.value })] }, index))) }));
};
exports.default = TaksListBlock;
