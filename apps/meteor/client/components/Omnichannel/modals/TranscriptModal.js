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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const TranscriptModal = (_a) => {
    var _b, _c, _d, _e, _f;
    var { email: emailDefault = '', room, onRequest, onSend, onCancel, onDiscard } = _a, props = __rest(_a, ["email", "room", "onRequest", "onSend", "onCancel", "onDiscard"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const { register, handleSubmit, setValue, setFocus, formState: { errors, isSubmitting }, } = (0, react_hook_form_1.useForm)({
        defaultValues: { email: emailDefault || '', subject: t('Transcript_of_your_livechat_conversation') },
    });
    (0, react_1.useEffect)(() => {
        setFocus('subject');
    }, [setFocus]);
    const { transcriptRequest } = room;
    const roomOpen = room === null || room === void 0 ? void 0 : room.open;
    const token = (_b = room === null || room === void 0 ? void 0 : room.v) === null || _b === void 0 ? void 0 : _b.token;
    const handleDiscard = (0, react_1.useCallback)(() => onDiscard(), [onDiscard]);
    const submit = (0, react_1.useCallback)(({ email, subject }) => {
        if (roomOpen && !transcriptRequest) {
            onRequest(email, subject);
        }
        if (!roomOpen && onSend && token) {
            onSend(email, subject, token);
        }
    }, [onRequest, onSend, roomOpen, token, transcriptRequest]);
    (0, react_1.useEffect)(() => {
        if (transcriptRequest) {
            setValue('email', transcriptRequest.email);
            setValue('subject', transcriptRequest.subject);
        }
    }, [setValue, transcriptRequest]);
    // const canSubmit = isValid && Boolean(watch('subject'));
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, Object.assign({ open: true, wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleSubmit(submit) }, props)) }, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Icon, { name: 'mail-arrow-top-right' }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Transcript') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onCancel })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { fontScale: 'p2', children: [!!transcriptRequest && (0, jsx_runtime_1.jsx)("p", { children: t('Livechat_transcript_already_requested_warning') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldLabel, { children: [t('Email'), "*"] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ disabled: !!emailDefault || !!transcriptRequest, error: (_c = errors.email) === null || _c === void 0 ? void 0 : _c.message, flexGrow: 1 }, register('email', { required: t('Required_field', { field: t('Email') }) }))) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: (_d = errors.email) === null || _d === void 0 ? void 0 : _d.message })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldLabel, { children: [t('Subject'), "*"] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ disabled: !!transcriptRequest, error: (_e = errors.subject) === null || _e === void 0 ? void 0 : _e.message, flexGrow: 1 }, register('subject', { required: t('Required_field', { field: t('Subject') }) }))) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: (_f = errors.subject) === null || _f === void 0 ? void 0 : _f.message })] })] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onCancel, children: t('Cancel') }), roomOpen && transcriptRequest && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: true, onClick: handleDiscard, children: t('Undo_request') })), roomOpen && !transcriptRequest && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { "aria-label": 'request-button', disabled: isSubmitting, loading: isSubmitting, primary: true, type: 'submit', children: t('Request') })), !roomOpen && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { "aria-label": 'send-button', disabled: isSubmitting, loading: isSubmitting, primary: true, type: 'submit', children: t('Send') }))] }) })] })));
};
exports.default = TranscriptModal;
