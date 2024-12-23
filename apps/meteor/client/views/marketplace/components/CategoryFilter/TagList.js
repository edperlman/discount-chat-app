"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const TagList = ({ categories, onClick }) => {
    if (!categories.length) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { wrap: true, small: true, children: categories.map((category) => ((0, jsx_runtime_1.jsx)(fuselage_1.Chip, { onClick: () => onClick(category), children: category.label }, category.id))) }));
};
exports.default = TagList;
