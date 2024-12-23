"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const PruneMessagesDateTimeRow = ({ label, field }) => {
    const { register } = (0, react_hook_form_1.useFormContext)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { flexGrow: 0, children: label }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', mi: 'neg-x4', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inline: 4, children: [(0, jsx_runtime_1.jsx)(fuselage_1.InputBox, Object.assign({ type: 'date', flexGrow: 1, h: 'x20' }, register(`${field}.date`))), (0, jsx_runtime_1.jsx)(fuselage_1.InputBox, Object.assign({ type: 'time', flexGrow: 1, h: 'x20' }, register(`${field}.time`)))] }) })] }));
};
exports.default = PruneMessagesDateTimeRow;
