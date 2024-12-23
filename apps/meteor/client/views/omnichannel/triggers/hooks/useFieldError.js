"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFieldError = void 0;
const react_hook_form_1 = require("react-hook-form");
const useFieldError = ({ control, name }) => {
    const names = Array.isArray(name) ? name : [name];
    const { errors } = (0, react_hook_form_1.useFormState)({ control, name });
    return names.map((name) => (0, react_hook_form_1.get)(errors, name));
};
exports.useFieldError = useFieldError;
