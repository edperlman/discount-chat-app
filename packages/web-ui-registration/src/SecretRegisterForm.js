"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const RegisterForm_1 = __importDefault(require("./RegisterForm"));
const SecretRegisterInvalidForm_1 = __importDefault(require("./SecretRegisterInvalidForm"));
const useCheckRegistrationSecret_1 = require("./hooks/useCheckRegistrationSecret");
const FormSkeleton_1 = __importDefault(require("./template/FormSkeleton"));
const HorizontalTemplate_1 = __importDefault(require("./template/HorizontalTemplate"));
const SecretRegisterForm = ({ setLoginRoute }) => {
    const hash = (0, ui_contexts_1.useRouteParameter)('hash');
    const { data: valid, isSuccess } = (0, useCheckRegistrationSecret_1.useCheckRegistrationSecret)(hash);
    if (isSuccess && !valid) {
        return (0, jsx_runtime_1.jsx)(SecretRegisterInvalidForm_1.default, {});
    }
    if (isSuccess && valid) {
        return ((0, jsx_runtime_1.jsx)(HorizontalTemplate_1.default, { children: (0, jsx_runtime_1.jsx)(RegisterForm_1.default, { setLoginRoute: setLoginRoute }) }));
    }
    return ((0, jsx_runtime_1.jsx)(HorizontalTemplate_1.default, { children: (0, jsx_runtime_1.jsx)(FormSkeleton_1.default, {}) }));
};
exports.default = SecretRegisterForm;
