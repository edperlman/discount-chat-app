"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const DateRangePicker_1 = __importDefault(require("./DateRangePicker"));
const FilterByText_1 = __importDefault(require("../../../../components/FilterByText"));
const ModerationFilter = ({ text, setText, setDateRange }) => {
    return ((0, jsx_runtime_1.jsx)(FilterByText_1.default, { shouldAutoFocus: true, value: text, onChange: (event) => setText(event.target.value), children: (0, jsx_runtime_1.jsx)(DateRangePicker_1.default, { onChange: setDateRange }) }));
};
exports.default = ModerationFilter;
