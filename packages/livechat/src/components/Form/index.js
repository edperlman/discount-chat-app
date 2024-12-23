"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFields = exports.SelectInput = exports.PasswordInput = exports.MultilineTextInput = exports.TextInput = exports.FormField = exports.Validations = exports.Form = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const i18next_1 = __importDefault(require("i18next"));
const Form = ({ onSubmit, className, style = {}, id, children }) => ((0, jsx_runtime_1.jsx)("form", { noValidate: true, id: id, onSubmit: onSubmit, className: className, style: style, children: children }));
exports.Form = Form;
exports.Validations = {
    nonEmpty: ({ value }) => (!value.trim() ? i18next_1.default.t('field_required') : undefined),
    custom: ({ value, pattern }) => new RegExp(pattern, 'i').test(String(value)) ? null : i18next_1.default.t('invalid_value'),
};
var FormField_1 = require("./FormField");
Object.defineProperty(exports, "FormField", { enumerable: true, get: function () { return FormField_1.FormField; } });
var TextInput_1 = require("./TextInput");
Object.defineProperty(exports, "TextInput", { enumerable: true, get: function () { return TextInput_1.TextInput; } });
var MultilineTextInput_1 = require("./MultilineTextInput");
Object.defineProperty(exports, "MultilineTextInput", { enumerable: true, get: function () { return MultilineTextInput_1.MultilineTextInput; } });
var PasswordInput_1 = require("./PasswordInput");
Object.defineProperty(exports, "PasswordInput", { enumerable: true, get: function () { return PasswordInput_1.PasswordInput; } });
var SelectInput_1 = require("./SelectInput");
Object.defineProperty(exports, "SelectInput", { enumerable: true, get: function () { return SelectInput_1.SelectInput; } });
var CustomFields_1 = require("./CustomFields");
Object.defineProperty(exports, "CustomFields", { enumerable: true, get: function () { return CustomFields_1.CustomFields; } });
