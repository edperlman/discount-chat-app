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
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const AdvancedContactModal_1 = __importDefault(require("./AdvancedContactModal"));
const useCreateContact_1 = require("./hooks/useCreateContact");
const useEditContact_1 = require("./hooks/useEditContact");
const client_1 = require("../../../../app/authorization/client");
const emailValidator_1 = require("../../../../lib/emailValidator");
const Contextualbar_1 = require("../../../components/Contextualbar");
const useHasLicenseModule_1 = require("../../../hooks/useHasLicenseModule");
const additionalForms_1 = require("../additionalForms");
const FormSkeleton_1 = require("../directory/components/FormSkeleton");
const useCustomFieldsMetadata_1 = require("../directory/hooks/useCustomFieldsMetadata");
const DEFAULT_VALUES = {
    name: '',
    emails: [],
    phones: [],
    contactManager: '',
    customFields: {},
};
const getInitialValues = (data) => {
    if (!data) {
        return DEFAULT_VALUES;
    }
    const { name, phones, emails, customFields, contactManager } = data !== null && data !== void 0 ? data : {};
    return {
        name: name !== null && name !== void 0 ? name : '',
        emails: emails !== null && emails !== void 0 ? emails : [],
        phones: phones !== null && phones !== void 0 ? phones : [],
        customFields: customFields !== null && customFields !== void 0 ? customFields : {},
        contactManager: contactManager !== null && contactManager !== void 0 ? contactManager : '',
    };
};
const validateMultipleFields = (fieldsLength, hasLicense) => fieldsLength >= 1 && !hasLicense;
const EditContactInfo = ({ contactData, onClose, onCancel }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('contact-id-verification');
    const canViewCustomFields = (0, client_1.hasAtLeastOnePermission)(['view-livechat-room-customfields', 'edit-livechat-room-customfields']);
    const editContact = (0, useEditContact_1.useEditContact)(['current-contacts']);
    const createContact = (0, useCreateContact_1.useCreateContact)(['current-contacts']);
    const handleOpenUpSellModal = () => setModal((0, jsx_runtime_1.jsx)(AdvancedContactModal_1.default, { onCancel: () => setModal(null) }));
    const { data: customFieldsMetadata = [], isInitialLoading: isLoadingCustomFields } = (0, useCustomFieldsMetadata_1.useCustomFieldsMetadata)({
        scope: 'visitor',
        enabled: canViewCustomFields,
    });
    const initialValue = getInitialValues(contactData);
    const { formState: { errors, isSubmitting }, control, watch, handleSubmit, } = (0, react_hook_form_1.useForm)({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        defaultValues: initialValue,
    });
    const { fields: emailFields, append: appendEmail, remove: removeEmail, } = (0, react_hook_form_1.useFieldArray)({
        control,
        name: 'emails',
    });
    const { fields: phoneFields, append: appendPhone, remove: removePhone, } = (0, react_hook_form_1.useFieldArray)({
        control,
        name: 'phones',
    });
    const { emails, phones } = watch();
    const validateEmailFormat = (emailValue) => __awaiter(void 0, void 0, void 0, function* () {
        const currentEmails = emails.map(({ address }) => address);
        const isDuplicated = currentEmails.filter((email) => email === emailValue).length > 1;
        if (!(0, emailValidator_1.validateEmail)(emailValue)) {
            return t('error-invalid-email-address');
        }
        return !isDuplicated ? true : t('Email_already_exists');
    });
    const validatePhone = (phoneValue) => __awaiter(void 0, void 0, void 0, function* () {
        const currentPhones = phones.map(({ phoneNumber }) => phoneNumber);
        const isDuplicated = currentPhones.filter((phone) => phone === phoneValue).length > 1;
        return !isDuplicated ? true : t('Phone_already_exists');
    });
    const validateName = (v) => (!v.trim() ? t('Required_field', { field: t('Name') }) : true);
    const handleSave = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, phones, emails, customFields, contactManager } = data;
        const payload = {
            name,
            phones: phones.map(({ phoneNumber }) => phoneNumber),
            emails: emails.map(({ address }) => address),
            customFields,
            contactManager,
        };
        if (contactData) {
            return editContact.mutate(Object.assign({ contactId: contactData === null || contactData === void 0 ? void 0 : contactData._id }, payload));
        }
        return createContact.mutate(payload);
    });
    const formId = (0, fuselage_hooks_1.useUniqueId)();
    const nameField = (0, fuselage_hooks_1.useUniqueId)();
    const emailField = (0, fuselage_hooks_1.useUniqueId)();
    const phoneField = (0, fuselage_hooks_1.useUniqueId)();
    if (isLoadingCustomFields) {
        return ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { children: (0, jsx_runtime_1.jsx)(FormSkeleton_1.FormSkeleton, {}) }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: contactData ? 'pencil' : 'user' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: contactData ? t('Edit_Contact_Profile') : t('New_contact') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClose })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarScrollableContent, { id: formId, is: 'form', onSubmit: handleSubmit(handleSave), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: nameField, required: true, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'name', control: control, rules: { validate: validateName }, render: ({ field }) => {
                                        var _a;
                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: nameField }, field, { error: (_a = errors.name) === null || _a === void 0 ? void 0 : _a.message, "aria-invalid": errors.name ? 'true' : 'false', "aria-describedby": `${nameField}-error` })));
                                    } }) }), errors.name && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { id: `${nameField}-error`, role: 'alert', children: errors.name.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { id: emailField, children: t('Email') }), emailFields.map((field, index) => {
                                var _a, _b, _c, _d, _e;
                                return ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: `emails.${index}.address`, control: control, rules: {
                                                        required: t('Required_field', { field: t('Email') }),
                                                        validate: validateEmailFormat,
                                                    }, render: ({ field }) => {
                                                        var _a, _b, _c, _d, _e;
                                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { "aria-labelledby": emailField, error: (_c = (_b = (_a = errors.emails) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.address) === null || _c === void 0 ? void 0 : _c.message, "aria-invalid": ((_e = (_d = errors.emails) === null || _d === void 0 ? void 0 : _d[index]) === null || _e === void 0 ? void 0 : _e.address) ? 'true' : 'false', "aria-describedby": `${emailField + index}-error`, "aria-required": 'true' })));
                                                    } }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { title: t('Remove_email'), small: true, onClick: () => removeEmail(index), mis: 8, icon: 'trash' })] }), ((_b = (_a = errors.emails) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.address) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { id: `${emailField + index}-error`, role: 'alert', children: (_e = (_d = (_c = errors.emails) === null || _c === void 0 ? void 0 : _c[index]) === null || _d === void 0 ? void 0 : _d.address) === null || _e === void 0 ? void 0 : _e.message }))] }, field.id));
                            }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { mbs: 8, onClick: validateMultipleFields(emailFields.length, hasLicense) ? handleOpenUpSellModal : () => appendEmail({ address: '' }), children: t('Add_email') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { id: phoneField, children: t('Phone') }), phoneFields.map((field, index) => {
                                var _a, _b, _c, _d, _e;
                                return ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: `phones.${index}.phoneNumber`, control: control, rules: {
                                                        required: t('Required_field', { field: t('Phone') }),
                                                        validate: validatePhone,
                                                    }, render: ({ field }) => {
                                                        var _a, _b, _c, _d, _e;
                                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { "aria-labelledby": phoneField, error: (_c = (_b = (_a = errors.phones) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.phoneNumber) === null || _c === void 0 ? void 0 : _c.message, "aria-invalid": ((_e = (_d = errors.phones) === null || _d === void 0 ? void 0 : _d[index]) === null || _e === void 0 ? void 0 : _e.phoneNumber) ? 'true' : 'false', "aria-describedby": `${phoneField + index}-error`, "aria-required": 'true' })));
                                                    } }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { title: t('Remove_phone'), small: true, onClick: () => removePhone(index), mis: 8, icon: 'trash' })] }), ((_b = (_a = errors.phones) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.phoneNumber) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { id: `${phoneField + index}-error`, role: 'alert', children: (_e = (_d = (_c = errors.phones) === null || _c === void 0 ? void 0 : _c[index]) === null || _d === void 0 ? void 0 : _d.phoneNumber) === null || _e === void 0 ? void 0 : _e.message }))] }, field.id));
                            }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { mbs: 8, onClick: validateMultipleFields(phoneFields.length, hasLicense) ? handleOpenUpSellModal : () => appendPhone({ phoneNumber: '' }), children: t('Add_phone') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Contact_Manager') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'contactManager', control: control, render: ({ field: { value, onChange } }) => (0, jsx_runtime_1.jsx)(additionalForms_1.ContactManagerInput, { value: value, onChange: onChange }) }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Divider, {}), canViewCustomFields && (0, jsx_runtime_1.jsx)(ui_client_1.CustomFieldsForm, { formName: 'customFields', formControl: control, metadata: customFieldsMetadata })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onCancel, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'submit', form: formId, loading: isSubmitting, primary: true, children: t('Save') })] }) })] }));
};
exports.default = EditContactInfo;
