"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const Field_1 = __importDefault(require("./Field"));
const ShortField = (props) => (0, jsx_runtime_1.jsx)(Field_1.default, Object.assign({}, props, { flexGrow: 1, width: '50%', flexBasis: 1 }));
exports.default = ShortField;
