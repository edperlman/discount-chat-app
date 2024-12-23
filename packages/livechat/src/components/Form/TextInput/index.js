"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextInput = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const createClassName_1 = require("../../../helpers/createClassName");
const styles_scss_1 = __importDefault(require("./styles.scss"));
const TextInput = ({ name, value, placeholder, disabled, small, error, onChange, onInput, className, style = {}, ref }) => ((0, jsx_runtime_1.jsx)("input", { type: 'text', name: name, value: value, placeholder: placeholder, disabled: disabled, onChange: onChange, onInput: onInput, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'text-input', { disabled, error, small }, [className]), ref: ref, style: style }));
exports.TextInput = TextInput;
