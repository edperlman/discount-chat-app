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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useRoomExportMutation_1 = require("./useRoomExportMutation");
const Contextualbar_1 = require("../../../../components/Contextualbar");
const FileExport = ({ formId, rid, exportOptions, onCancel }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { control, handleSubmit } = (0, react_hook_form_1.useFormContext)();
    const roomExportMutation = (0, useRoomExportMutation_1.useRoomExportMutation)();
    const formFocus = (0, fuselage_hooks_1.useAutoFocus)();
    const outputOptions = (0, react_1.useMemo)(() => [
        ['html', t('HTML')],
        ['json', t('JSON')],
    ], [t]);
    const handleExport = ({ dateFrom, dateTo, format }) => {
        roomExportMutation.mutateAsync(Object.assign(Object.assign(Object.assign({ rid, type: 'file' }, (dateFrom && { dateFrom })), (dateTo && { dateTo })), { format }));
    };
    const typeField = (0, fuselage_hooks_1.useUniqueId)();
    const dateFromField = (0, fuselage_hooks_1.useUniqueId)();
    const dateToField = (0, fuselage_hooks_1.useUniqueId)();
    const formatField = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsx)("form", { ref: formFocus, tabIndex: -1, "aria-labelledby": `${formId}-title`, id: formId, onSubmit: handleSubmit(handleExport), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: typeField, children: t('Method') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'type', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({ id: typeField }, field, { placeholder: t('Type'), options: exportOptions })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: dateFromField, children: t('Date_From') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'dateFrom', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.InputBox, Object.assign({ id: dateFromField, type: 'date' }, field)) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: dateToField, children: t('Date_to') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'dateTo', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.InputBox, Object.assign({ id: dateToField }, field, { type: 'date' })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: formatField, children: t('Output_format') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'format', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({}, field, { id: formatField, placeholder: t('Format'), options: outputOptions })) }) })] })] }) }) }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onCancel, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: formId, primary: true, type: 'submit', children: t('Export') })] }) })] }));
};
exports.default = FileExport;
