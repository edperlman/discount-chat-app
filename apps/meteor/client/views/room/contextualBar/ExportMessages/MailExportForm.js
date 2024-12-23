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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useRoomExportMutation_1 = require("./useRoomExportMutation");
const emailValidator_1 = require("../../../../../lib/emailValidator");
const Contextualbar_1 = require("../../../../components/Contextualbar");
const UserAutoCompleteMultiple_1 = __importDefault(require("../../../../components/UserAutoCompleteMultiple"));
const SelectedMessagesContext_1 = require("../../MessageList/contexts/SelectedMessagesContext");
const MailExportForm = ({ formId, rid, onCancel, exportOptions }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const formFocus = (0, fuselage_hooks_1.useAutoFocus)();
    const { watch, setValue, control, register, formState: { errors, isDirty, isSubmitting }, handleSubmit, clearErrors, } = (0, react_hook_form_1.useFormContext)();
    const roomExportMutation = (0, useRoomExportMutation_1.useRoomExportMutation)();
    const { selectedMessageStore } = (0, react_1.useContext)(SelectedMessagesContext_1.SelectedMessageContext);
    const messages = selectedMessageStore.getSelectedMessages();
    const count = (0, SelectedMessagesContext_1.useCountSelected)();
    const clearSelection = (0, fuselage_hooks_1.useMutableCallback)(() => {
        selectedMessageStore.clearStore();
    });
    (0, react_1.useEffect)(() => {
        selectedMessageStore.setIsSelecting(true);
        return () => {
            selectedMessageStore.reset();
        };
    }, [selectedMessageStore]);
    const { toUsers } = watch();
    (0, react_1.useEffect)(() => {
        setValue('messagesCount', messages.length);
    }, [setValue, messages.length]);
    const handleExport = (_a) => __awaiter(void 0, [_a], void 0, function* ({ toUsers, subject, additionalEmails }) {
        roomExportMutation.mutateAsync({
            rid,
            type: 'email',
            toUsers,
            toEmails: additionalEmails === null || additionalEmails === void 0 ? void 0 : additionalEmails.split(','),
            subject,
            messages,
        });
    });
    const clickable = (0, css_in_js_1.css) `
		cursor: pointer;
	`;
    const methodField = (0, fuselage_hooks_1.useUniqueId)();
    const toUsersField = (0, fuselage_hooks_1.useUniqueId)();
    const additionalEmailsField = (0, fuselage_hooks_1.useUniqueId)();
    const subjectField = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsx)("form", { ref: formFocus, tabIndex: -1, "aria-labelledby": `${formId}-title`, id: formId, onSubmit: handleSubmit(handleExport), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: methodField, children: t('Method') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'type', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({ id: methodField }, field, { placeholder: t('Type'), options: exportOptions })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Callout, { onClick: clearSelection, title: t('Messages_selected'), type: count > 0 ? 'success' : 'info', children: [(0, jsx_runtime_1.jsx)("p", { children: `${count} Messages selected` }), count > 0 && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', className: clickable, children: t('Click_here_to_clear_the_selection') })), count === 0 && (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', children: t('Click_the_messages_you_would_like_to_send_by_email') })] }), (0, jsx_runtime_1.jsx)("input", Object.assign({ type: 'hidden' }, register('messagesCount', {
                                        validate: (messagesCount) => (messagesCount > 0 ? undefined : t('Mail_Message_No_messages_selected_select_all')),
                                    }))), errors.messagesCount && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', children: errors.messagesCount.message })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: toUsersField, children: t('To_users') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'toUsers', control: control, render: ({ field: { value, onChange, onBlur, name } }) => ((0, jsx_runtime_1.jsx)(UserAutoCompleteMultiple_1.default, { id: toUsersField, value: value, onChange: (value) => {
                                                    onChange(value);
                                                    clearErrors('additionalEmails');
                                                }, onBlur: onBlur, name: name })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: additionalEmailsField, children: t('To_additional_emails') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'additionalEmails', control: control, rules: {
                                                validate: {
                                                    validateEmail: (additionalEmails) => {
                                                        const emails = additionalEmails === null || additionalEmails === void 0 ? void 0 : additionalEmails.split(',').map((email) => email.trim());
                                                        if (Array.isArray(emails) && emails.every((email) => (0, emailValidator_1.validateEmail)(email.trim()))) {
                                                            return undefined;
                                                        }
                                                        return t('Mail_Message_Invalid_emails', { postProcess: 'sprintf', sprintf: [additionalEmails] });
                                                    },
                                                    validateToUsers: (additionalEmails) => {
                                                        if (additionalEmails !== '' || (toUsers === null || toUsers === void 0 ? void 0 : toUsers.length) > 0) {
                                                            return undefined;
                                                        }
                                                        return t('Mail_Message_Missing_to');
                                                    },
                                                },
                                            }, render: ({ field }) => {
                                                var _a, _b;
                                                return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: additionalEmailsField }, field, { placeholder: t('Email_Placeholder_any'), addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'mail', size: 'x20' }), "aria-describedby": `${additionalEmailsField}-error`, "aria-invalid": Boolean((_a = errors === null || errors === void 0 ? void 0 : errors.additionalEmails) === null || _a === void 0 ? void 0 : _a.message), error: (_b = errors === null || errors === void 0 ? void 0 : errors.additionalEmails) === null || _b === void 0 ? void 0 : _b.message })));
                                            } }) }), (errors === null || errors === void 0 ? void 0 : errors.additionalEmails) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${additionalEmailsField}-error`, children: errors.additionalEmails.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: subjectField, children: t('Subject') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'subject', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ rows: 3, id: subjectField }, field, { addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'edit', size: 'x20' }) })) }) })] })] }) }) }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onCancel, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { loading: isSubmitting, disabled: !isDirty, form: formId, primary: true, type: 'submit', children: t('Send') })] }) })] }));
};
exports.default = MailExportForm;
