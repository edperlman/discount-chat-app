"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageActionForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const hooks_1 = require("../hooks");
const ActionSender_1 = require("./ActionSender");
const SendMessageActionForm = (_a) => {
    var { control, index } = _a, props = __rest(_a, ["control", "index"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const messageFieldId = (0, fuselage_hooks_1.useUniqueId)();
    const name = `actions.${index}.params.msg`;
    const [messageError] = (0, hooks_1.useFieldError)({ control, name });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ActionSender_1.ActionSender, Object.assign({}, props, { control: control, index: index })), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: messageFieldId, children: t('Message') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: name, defaultValue: '', rules: { required: t('Required_field', { field: t('Message') }) }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ error: messageError === null || messageError === void 0 ? void 0 : messageError.message, "aria-invalid": Boolean(messageError), "aria-describedby": `${messageFieldId}-error`, "aria-required": true }, field, { rows: 3, placeholder: `${t('Message')}*` }))) }) }), messageError && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${messageFieldId}-error`, children: messageError.message }))] }))] }));
};
exports.SendMessageActionForm = SendMessageActionForm;
