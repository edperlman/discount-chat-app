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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const useHasLicenseModule_1 = require("../../../hooks/useHasLicenseModule");
const toast_1 = require("../../../lib/toast");
const GenericModal_1 = __importDefault(require("../../GenericModal"));
const Tags_1 = __importDefault(require("../Tags"));
const CloseChatModal = ({ department, visitorEmail, onCancel, onConfirm, }) => {
    var _a, _b, _c, _d, _e;
    const t = (0, ui_contexts_1.useTranslation)();
    const { formState: { errors }, handleSubmit, register, setError, setFocus, setValue, watch, } = (0, react_hook_form_1.useForm)();
    const commentRequired = (0, ui_contexts_1.useSetting)('Livechat_request_comment_when_closing_conversation', true);
    const alwaysSendTranscript = (0, ui_contexts_1.useSetting)('Livechat_transcript_send_always', false);
    const customSubject = (0, ui_contexts_1.useSetting)('Livechat_transcript_email_subject', '');
    const [tagRequired, setTagRequired] = (0, react_1.useState)(false);
    const tags = watch('tags');
    const comment = watch('comment');
    const transcriptEmail = watch('transcriptEmail');
    const subject = watch('subject');
    const userTranscriptEmail = (_a = (0, ui_contexts_1.useUserPreference)('omnichannelTranscriptEmail')) !== null && _a !== void 0 ? _a : false;
    const userTranscriptPDF = (_b = (0, ui_contexts_1.useUserPreference)('omnichannelTranscriptPDF')) !== null && _b !== void 0 ? _b : false;
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    const transcriptPDFPermission = (0, ui_contexts_1.usePermission)('request-pdf-transcript');
    const transcriptEmailPermission = (0, ui_contexts_1.usePermission)('send-omnichannel-chat-transcript');
    const canSendTranscriptEmail = transcriptEmailPermission && visitorEmail && !alwaysSendTranscript;
    const canSendTranscriptPDF = transcriptPDFPermission && hasLicense;
    const canSendTranscript = canSendTranscriptEmail || canSendTranscriptPDF;
    const handleTags = (value) => {
        setValue('tags', value);
    };
    const onSubmit = (0, react_1.useCallback)(({ comment, tags, transcriptPDF, transcriptEmail, subject }) => {
        const preferences = {
            omnichannelTranscriptPDF: !!transcriptPDF,
            omnichannelTranscriptEmail: alwaysSendTranscript ? true : !!transcriptEmail,
        };
        const requestData = transcriptEmail && visitorEmail ? { email: visitorEmail, subject } : undefined;
        if (!(comment === null || comment === void 0 ? void 0 : comment.trim()) && commentRequired) {
            setError('comment', { type: 'custom', message: t('Required_field', { field: t('Comment') }) });
        }
        if (transcriptEmail && !subject) {
            setError('subject', { type: 'custom', message: t('Required_field', { field: t('Subject') }) });
        }
        if (!(tags === null || tags === void 0 ? void 0 : tags.length) && tagRequired) {
            setError('tags', { type: 'custom', message: t('error-tags-must-be-assigned-before-closing-chat') });
        }
        if (!errors.comment || errors.tags) {
            onConfirm(comment, tags, preferences, requestData);
        }
    }, [commentRequired, tagRequired, visitorEmail, errors, setError, t, onConfirm, alwaysSendTranscript]);
    const cannotSubmit = (0, react_1.useMemo)(() => {
        const cannotSendTag = (tagRequired && !(tags === null || tags === void 0 ? void 0 : tags.length)) || errors.tags;
        const cannotSendComment = (commentRequired && !(comment === null || comment === void 0 ? void 0 : comment.trim())) || errors.comment;
        const cannotSendTranscriptEmail = transcriptEmail && (!visitorEmail || !subject);
        return Boolean(cannotSendTag || cannotSendComment || cannotSendTranscriptEmail);
    }, [comment, commentRequired, errors, tagRequired, tags, transcriptEmail, visitorEmail, subject]);
    (0, react_1.useEffect)(() => {
        if (department === null || department === void 0 ? void 0 : department.requestTagBeforeClosingChat) {
            setTagRequired(true);
        }
    }, [department]);
    (0, react_1.useEffect)(() => {
        if (commentRequired) {
            setFocus('comment');
        }
    }, [commentRequired, setFocus]);
    (0, react_1.useEffect)(() => {
        if (tagRequired) {
            register('tags');
        }
    }, [register, tagRequired]);
    (0, react_1.useEffect)(() => {
        if (transcriptEmail) {
            if (!visitorEmail) {
                (0, toast_1.dispatchToastMessage)({ type: 'error', message: t('Customer_without_registered_email') });
                return;
            }
            setValue('subject', subject || customSubject || t('Transcript_of_your_livechat_conversation'));
        }
    }, [transcriptEmail, setValue, visitorEmail, subject, t, customSubject]);
    if (commentRequired || tagRequired || canSendTranscript) {
        return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleSubmit(onSubmit) }, props, { "data-qa-id": 'close-chat-modal' })), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Icon, { name: 'baloon-close-top-right' }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Wrap_up_conversation') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onCancel })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { fontScale: 'p2', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'annotation', children: t('Close_room_description') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: commentRequired, children: t('Comment') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, register('comment'), { error: errors.comment && t('Required_field', { field: t('Comment') }), flexGrow: 1, placeholder: t('Please_add_a_comment') })) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: (_c = errors.comment) === null || _c === void 0 ? void 0 : _c.message })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(Tags_1.default, Object.assign({ tagRequired: tagRequired, tags: tags, handler: handleTags }, (department && { department: department._id }))), (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: (_d = errors.tags) === null || _d === void 0 ? void 0 : _d.message })] }), canSendTranscript && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Divider, {}), (0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { marginBlockStart: 8, children: t('Chat_transcript') })] }), canSendTranscriptPDF && ((0, jsx_runtime_1.jsx)(fuselage_1.Field, { marginBlockStart: 10, children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: 'transcript-pdf', children: t('Omnichannel_transcript_pdf') }), (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, Object.assign({ id: 'transcript-pdf' }, register('transcriptPDF', { value: userTranscriptPDF })))] }) })), canSendTranscriptEmail && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field, { marginBlockStart: 10, children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: 'transcript-email', children: t('Omnichannel_transcript_email') }), (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, Object.assign({ id: 'transcript-email' }, register('transcriptEmail', { value: userTranscriptEmail })))] }) }), transcriptEmail && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { marginBlockStart: 14, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, children: t('Contact_email') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.EmailInput, { value: visitorEmail, required: true, disabled: true, flexGrow: 1 }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { marginBlockStart: 12, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, children: t('Subject') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, register('subject', { required: true }), { className: 'active', error: errors.subject && t('Required_field', { field: t('Subject') }), flexGrow: 1 })) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: (_e = errors.subject) === null || _e === void 0 ? void 0 : _e.message })] })] }))] })), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { marginBlockStart: 16, children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { color: 'annotation', fontScale: 'c1', children: canSendTranscriptPDF && canSendTranscriptEmail
                                                    ? t('These_options_affect_this_conversation_only_To_set_default_selections_go_to_My_Account_Omnichannel')
                                                    : t('This_option_affect_this_conversation_only_To_set_default_selection_go_to_My_Account_Omnichannel') }) })] }))] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onCancel, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'submit', disabled: cannotSubmit, primary: true, children: t('Confirm') })] }) })] }));
    }
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'warning', title: t('Are_you_sure_you_want_to_close_this_chat'), onConfirm: () => onConfirm(), onCancel: onCancel, onClose: onCancel, confirmText: t('Confirm') }));
};
exports.default = CloseChatModal;
