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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const useSendInvitationEmailMutation_1 = require("./hooks/useSendInvitationEmailMutation");
const useSmtpQuery_1 = require("./hooks/useSmtpQuery");
const emailValidator_1 = require("../../../../lib/emailValidator");
const Contextualbar_1 = require("../../../components/Contextualbar");
const Skeleton_1 = require("../../../components/Skeleton");
// TODO: Replace using RHF
const AdminInviteUsers = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const [text, setText] = (0, react_1.useState)('');
    const getEmails = (0, react_1.useCallback)((text) => text.split(/[\ ,;]+/i).filter((val) => (0, emailValidator_1.validateEmail)(val)), []);
    const adminRouter = (0, ui_contexts_1.useRoute)('admin-settings');
    const sendInvitationMutation = (0, useSendInvitationEmailMutation_1.useSendInvitationEmailMutation)();
    const { data, isLoading } = (0, useSmtpQuery_1.useSmtpQuery)();
    const handleClick = () => {
        sendInvitationMutation.mutate({ emails: getEmails(text) });
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { children: (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, {}) }));
    }
    if (!(data === null || data === void 0 ? void 0 : data.isSMTPConfigured)) {
        return ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('SMTP_Server_Not_Setup_Title') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: t('SMTP_Server_Not_Setup_Description') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { role: 'link', onClick: () => adminRouter.push({ group: 'Email' }), children: t('Setup_SMTP') }) })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarScrollableContent, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h2', fontScale: 'h2', mb: 8, children: t('Send_invitation_email') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', mb: 8, children: t('Send_invitation_email_info') }), (0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, { rows: 5, flexGrow: 0, onChange: (e) => setText(e.currentTarget.value) })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'send', primary: true, onClick: handleClick, disabled: !getEmails(text).length, alignItems: 'stretch', mb: 8, children: t('Send') }) }) })] }));
};
exports.default = AdminInviteUsers;
