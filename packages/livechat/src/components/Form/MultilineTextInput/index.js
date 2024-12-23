"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultilineTextInput = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const createClassName_1 = require("../../../helpers/createClassName");
const styles_scss_1 = __importDefault(require("./styles.scss"));
const MultilineTextInput = ({ name, placeholder, disabled, small, rows = 1, error, className, style = {}, onChange, onInput, onBlur, ref, value, }) => ((0, jsx_runtime_1.jsx)("textarea", { rows: rows, name: name, placeholder: placeholder, disabled: disabled, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'textarea-input', { disabled, error, small }, [className]), style: style, onChange: onChange, onInput: onInput, onBlur: onBlur, ref: ref, value: value }));
exports.MultilineTextInput = MultilineTextInput;
