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
exports.ActionSender = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const ActionSender = (_a) => {
    var { control, index, disabled } = _a, props = __rest(_a, ["control", "index", "disabled"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const senderFieldId = (0, fuselage_hooks_1.useUniqueId)();
    const senderFieldName = `actions.${index}.params.sender`;
    const senderNameFieldName = `actions.${index}.params.name`;
    const senderNameFieldValue = (0, react_hook_form_1.useWatch)({ control, name: senderFieldName });
    const senderOptions = (0, react_1.useMemo)(() => [
        ['queue', t('Impersonate_next_agent_from_queue')],
        ['custom', t('Custom_agent')],
    ], [t]);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: senderFieldId, children: t('Sender') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: senderFieldName, defaultValue: 'queue', render: ({ field }) => {
                        return (0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({}, field, { id: senderFieldId, options: senderOptions, placeholder: t('Select_an_option'), disabled: disabled }));
                    } }) }), senderNameFieldValue === 'custom' && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: senderNameFieldName, render: ({ field }) => {
                        return (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { placeholder: t('Name_of_agent'), "aria-label": t('Name_of_agent'), disabled: disabled }));
                    } }) }))] })));
};
exports.ActionSender = ActionSender;
