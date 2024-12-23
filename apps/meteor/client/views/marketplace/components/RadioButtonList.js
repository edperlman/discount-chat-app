"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const RadioButtonList = ({ group, onSelected }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Tile, { overflow: 'auto', pb: 12, pi: 0, elevation: '2', w: 'full', bg: 'light', borderRadius: 'x2', children: [group.label && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pi: 16, pbs: 8, pbe: 4, fontScale: 'micro', textTransform: 'uppercase', color: 'default', children: group.label })), group.items.map((item) => ((0, jsx_runtime_1.jsx)(fuselage_1.Option, { label: item.label, onClick: () => onSelected(item), children: (0, jsx_runtime_1.jsx)(fuselage_1.RadioButton, { checked: item.checked, onChange: () => onSelected(item) }) }, item.id)))] }));
exports.default = RadioButtonList;
