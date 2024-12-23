"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const useHasLicenseModule_1 = require("../../../hooks/useHasLicenseModule");
const PreferencesConversationTranscript = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const { register } = (0, react_hook_form_1.useFormContext)();
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    const alwaysSendEmailTranscript = (0, ui_contexts_1.useSetting)('Livechat_transcript_send_always');
    const canSendTranscriptPDF = (0, ui_contexts_1.usePermission)('request-pdf-transcript');
    const canSendTranscriptEmailPermission = (0, ui_contexts_1.usePermission)('send-omnichannel-chat-transcript');
    const canSendTranscriptEmail = canSendTranscriptEmailPermission && !alwaysSendEmailTranscript;
    const cantSendTranscriptPDF = !canSendTranscriptPDF || !hasLicense;
    const omnichannelTranscriptPDF = (0, fuselage_hooks_1.useUniqueId)();
    const omnichannelTranscriptEmail = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { defaultExpanded: true, title: t('Conversational_transcript'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: omnichannelTranscriptPDF, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [t('Omnichannel_transcript_pdf'), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { marginInline: 4, children: [!hasLicense && (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { variant: 'featured', children: t('Premium') }), !canSendTranscriptPDF && hasLicense && (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { children: t('No_permission') })] })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: omnichannelTranscriptPDF, disabled: cantSendTranscriptPDF }, register('omnichannelTranscriptPDF')))] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: t('Accounts_Default_User_Preferences_omnichannelTranscriptPDF_Description') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: omnichannelTranscriptEmail, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [t('Omnichannel_transcript_email'), !canSendTranscriptEmailPermission && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { marginInline: 4, children: (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { children: t('No_permission') }) }))] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: omnichannelTranscriptEmail, disabled: !canSendTranscriptEmail }, register('omnichannelTranscriptEmail')))] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: t('Accounts_Default_User_Preferences_omnichannelTranscriptEmail_Description') })] })] }) }));
};
exports.default = PreferencesConversationTranscript;
