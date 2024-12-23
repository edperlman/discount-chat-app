"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const ConditionForm = (_a) => {
    var { control, index } = _a, props = __rest(_a, ["control", "index"]);
    const conditionFieldId = (0, fuselage_hooks_1.useUniqueId)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const conditionName = (0, react_hook_form_1.useWatch)({ control, name: `conditions.${index}.name` });
    const placeholders = (0, react_1.useMemo)(() => ({
        'page-url': t('Enter_a_regex'),
        'time-on-site': t('Time_in_seconds'),
    }), [t]);
    const conditionOptions = (0, react_1.useMemo)(() => [
        ['page-url', t('Visitor_page_URL')],
        ['time-on-site', t('Visitor_time_on_site')],
        ['chat-opened-by-visitor', t('Chat_opened_by_visitor')],
        ['after-guest-registration', t('After_guest_registration')],
    ], [t]);
    const conditionValuePlaceholder = placeholders[conditionName];
    return ((0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, Object.assign({}, props, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: conditionFieldId, children: t('Condition') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: `conditions.${index}.name`, control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({}, field, { id: conditionFieldId, options: conditionOptions, placeholder: t('Select_an_option') }))) }) }), conditionValuePlaceholder && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: `conditions.${index}.value`, control: control, render: ({ field }) => {
                            if (conditionName === 'time-on-site') {
                                return (0, jsx_runtime_1.jsx)(fuselage_1.NumberInput, Object.assign({}, field, { placeholder: conditionValuePlaceholder }));
                            }
                            return (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { placeholder: conditionValuePlaceholder }));
                        } }) }))] }) })));
};
exports.ConditionForm = ConditionForm;
