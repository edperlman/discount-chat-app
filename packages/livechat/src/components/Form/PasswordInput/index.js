"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordInput = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const createClassName_1 = require("../../../helpers/createClassName");
const styles_scss_1 = __importDefault(require("./styles.scss"));
const PasswordInput = ({ name, placeholder, disabled, small, error, className, style = {}, onBlur, onChange, onInput, ref, }) => ((0, jsx_runtime_1.jsx)("input", { name: name, type: 'password', placeholder: placeholder, disabled: disabled, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'password-input', { disabled, error, small }, [className]), style: style, onBlur: onBlur, onChange: onChange, onInput: onInput, ref: ref }));
exports.PasswordInput = PasswordInput;
