"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormField = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const preact_1 = require("preact");
const createClassName_1 = require("../../../helpers/createClassName");
const styles_scss_1 = __importDefault(require("./styles.scss"));
const FormField = ({ required, label, description, error, className, style = {}, children }) => ((0, jsx_runtime_1.jsxs)("div", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'form-field', { required, error: !!error }, [className]), style: style, children: [(0, jsx_runtime_1.jsxs)("label", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'form-field__label-wrapper'), children: [label ? (0, jsx_runtime_1.jsx)("span", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'form-field__label'), children: label }) : null, (0, jsx_runtime_1.jsx)("span", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'form-field__input'), children: error ? (Array.isArray(children) ? children : [children]).map((child) => (0, preact_1.cloneElement)(child, { error: !!error })) : children })] }), (0, jsx_runtime_1.jsx)("small", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'form-field__description'), children: error || description })] }));
exports.FormField = FormField;
