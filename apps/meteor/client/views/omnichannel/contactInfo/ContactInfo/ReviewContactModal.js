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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const mapLivechatContactConflicts_1 = require("../../../../../lib/mapLivechatContactConflicts");
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const useHasLicenseModule_1 = require("../../../../hooks/useHasLicenseModule");
const additionalForms_1 = require("../../additionalForms");
const useCustomFieldsMetadata_1 = require("../../directory/hooks/useCustomFieldsMetadata");
const useEditContact_1 = require("../hooks/useEditContact");
const ReviewContactModal = ({ contact, onCancel }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    const { control, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)();
    const canViewCustomFields = (0, ui_contexts_1.useAtLeastOnePermission)(['view-livechat-room-customfields', 'edit-livechat-room-customfields']);
    const { data: customFieldsMetadata = [] } = (0, useCustomFieldsMetadata_1.useCustomFieldsMetadata)({
        scope: 'visitor',
        enabled: canViewCustomFields,
    });
    const editContact = (0, useEditContact_1.useEditContact)(['getContactById']);
    const handleConflicts = (_a) => __awaiter(void 0, void 0, void 0, function* () {
        var { name, contactManager } = _a, customFields = __rest(_a, ["name", "contactManager"]);
        const payload = Object.assign(Object.assign({ name,
            contactManager }, (customFields && Object.assign({}, customFields))), { wipeConflicts: true });
        editContact.mutate(Object.assign({ contactId: contact === null || contact === void 0 ? void 0 : contact._id }, payload), {
            onSettled: () => onCancel(),
        });
    });
    const conflictingFields = (0, react_1.useMemo)(() => {
        const mappedConflicts = (0, mapLivechatContactConflicts_1.mapLivechatContactConflicts)(contact, customFieldsMetadata);
        return Object.values(mappedConflicts);
    }, [contact, customFieldsMetadata]);
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { icon: null, variant: 'warning', onCancel: onCancel, confirmText: t('Save'), onConfirm: handleSubmit(handleConflicts), annotation: t('Contact_history_is_preserved'), title: t('Review_contact'), children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: conflictingFields.map(({ name, label, values }, index) => {
                var _a;
                const isContactManagerField = name === 'contactManager';
                const mappedOptions = values.map((option) => [option, option]);
                const Component = isContactManagerField ? additionalForms_1.ContactManagerInput : fuselage_1.Select;
                if (isContactManagerField && !hasLicense) {
                    return null;
                }
                return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t(label) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: name, control: control, rules: {
                                    required: isContactManagerField ? undefined : t('Required_field', { field: t(label) }),
                                }, render: ({ field: { value, onChange } }) => (0, jsx_runtime_1.jsx)(Component, { options: mappedOptions, value: value, onChange: onChange }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mie: 4, children: t('different_values_found', { number: values.length }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Badge, { variant: 'primary', small: true })] }) }), (errors === null || errors === void 0 ? void 0 : errors[name]) && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: (_a = errors === null || errors === void 0 ? void 0 : errors[name]) === null || _a === void 0 ? void 0 : _a.message })] }, index));
            }) }) }));
};
exports.default = ReviewContactModal;
