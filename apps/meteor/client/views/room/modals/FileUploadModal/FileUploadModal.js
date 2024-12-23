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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const filesize_1 = __importDefault(require("filesize"));
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const FilePreview_1 = __importDefault(require("./FilePreview"));
const FileUploadModal = ({ onClose, file, fileName, fileDescription, onSubmit, invalidContentType, showDescription = true, }) => {
    var _a, _b;
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = (0, react_hook_form_1.useForm)({ mode: 'onBlur', defaultValues: { name: fileName, description: fileDescription } });
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const maxMsgSize = (0, ui_contexts_1.useSetting)('Message_MaxAllowedSize', 5000);
    const maxFileSize = (0, ui_contexts_1.useSetting)('FileUpload_MaxFileSize', 104857600);
    const isDescriptionValid = (description) => description.length >= maxMsgSize ? t('Cannot_upload_file_character_limit', { count: maxMsgSize }) : true;
    const submit = ({ name, description }) => {
        // -1 maxFileSize means there is no limit
        if (maxFileSize > -1 && (file.size || 0) > maxFileSize) {
            onClose();
            return dispatchToastMessage({
                type: 'error',
                message: t('File_exceeds_allowed_size_of_bytes', { size: (0, filesize_1.default)(maxFileSize) }),
            });
        }
        onSubmit(name, description);
    };
    (0, react_1.useEffect)(() => {
        if (invalidContentType) {
            dispatchToastMessage({
                type: 'error',
                message: t('FileUpload_MediaType_NotAccepted__type__', { type: file.type }),
            });
            onClose();
            return;
        }
        if (file.size === 0) {
            dispatchToastMessage({
                type: 'error',
                message: t('FileUpload_File_Empty'),
            });
            onClose();
        }
    }, [file, dispatchToastMessage, invalidContentType, t, onClose]);
    const fileUploadFormId = (0, fuselage_hooks_1.useUniqueId)();
    const fileNameField = (0, fuselage_hooks_1.useUniqueId)();
    const fileDescriptionField = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Modal, { "aria-labelledby": `${fileUploadFormId}-title`, wrapperFunction: (props) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', id: fileUploadFormId, onSubmit: handleSubmit(submit) }, props))), children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', height: '100%', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { id: `${fileUploadFormId}-title`, children: t('FileUpload') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { tabIndex: -1, onClick: onClose })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', maxHeight: 'x360', w: 'full', justifyContent: 'center', alignContent: 'center', mbe: 16, children: (0, jsx_runtime_1.jsx)(FilePreview_1.default, { file: file }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: fileNameField, children: t('Upload_file_name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: fileNameField }, register('name', {
                                                required: t('error-the-field-is-required', { field: t('Upload_file_name') }),
                                            }), { error: (_a = errors.name) === null || _a === void 0 ? void 0 : _a.message, "aria-invalid": errors.name ? 'true' : 'false', "aria-describedby": `${fileNameField}-error`, "aria-required": 'true' })) }), errors.name && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { id: `${fileNameField}-error`, children: errors.name.message })] }), showDescription && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: fileDescriptionField, children: t('Upload_file_description') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: fileDescriptionField }, register('description', {
                                                validate: (value) => isDescriptionValid(value || ''),
                                            }), { error: (_b = errors.description) === null || _b === void 0 ? void 0 : _b.message, "aria-invalid": errors.description ? 'true' : 'false', "aria-describedby": `${fileDescriptionField}-error` })) }), errors.description && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { id: `${fileDescriptionField}-error`, children: errors.description.message })] }))] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { secondary: true, onClick: onClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, type: 'submit', loading: isSubmitting, children: t('Send') })] }) })] }) }));
};
exports.default = (0, react_1.memo)(FileUploadModal);
