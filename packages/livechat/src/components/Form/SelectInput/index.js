"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectInput = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const createClassName_1 = require("../../../helpers/createClassName");
const arrowDown_svg_1 = __importDefault(require("../../../icons/arrowDown.svg"));
const styles_scss_1 = __importDefault(require("./styles.scss"));
const SelectInput = ({ name, placeholder, options = [], disabled, small, error, onInput, onBlur, onChange = () => undefined, className, style = {}, value, ref, }) => {
    const SelectOptions = Array.from(options).map(({ value, label }, key) => ((0, jsx_runtime_1.jsx)("option", { value: value, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'select-input__option'), children: label }, key)));
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'select-input', {}, [className]), style: style, children: [(0, jsx_runtime_1.jsxs)("select", { name: name, value: value, disabled: disabled, onChange: onChange, onBlur: onBlur, onInput: onInput, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'select-input__select', {
                    disabled,
                    error,
                    small,
                    placeholder: !value,
                }), ref: ref, children: [placeholder && ((0, jsx_runtime_1.jsx)("option", { selected: true, value: '', disabled: true, hidden: true, children: placeholder })), SelectOptions] }), (0, jsx_runtime_1.jsx)(arrowDown_svg_1.default, { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'select-input__arrow') })] }));
};
exports.SelectInput = SelectInput;
