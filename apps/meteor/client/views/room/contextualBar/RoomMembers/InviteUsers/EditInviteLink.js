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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const EditInviteLink = ({ daysAndMaxUses, onClickNewLink }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { handleSubmit, formState: { isDirty, isSubmitting }, control, } = (0, react_hook_form_1.useForm)({ defaultValues: { days: daysAndMaxUses.days, maxUses: daysAndMaxUses.maxUses } });
    const daysOptions = (0, react_1.useMemo)(() => [
        ['1', '1'],
        ['7', '7'],
        ['15', '15'],
        ['30', '30'],
        ['0', t('Never')],
    ], [t]);
    const maxUsesOptions = (0, react_1.useMemo)(() => [
        ['5', '5'],
        ['10', '10'],
        ['25', '25'],
        ['50', '50'],
        ['100', '100'],
        ['0', t('No_Limit')],
    ], [t]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { flexGrow: 0, children: t('Expiration_(Days)') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'days', control: control, render: ({ field: { onChange, value, name } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, { name: name, value: value, onChange: onChange, options: daysOptions })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { flexGrow: 0, children: t('Max_number_of_uses') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'maxUses', control: control, render: ({ field: { onChange, value, name } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, { name: name, value: value, onChange: onChange, options: maxUsesOptions })) }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { loading: isSubmitting, disabled: !isDirty, primary: true, onClick: handleSubmit(onClickNewLink), children: t('Generate_New_Link') }) })] }));
};
exports.default = EditInviteLink;
