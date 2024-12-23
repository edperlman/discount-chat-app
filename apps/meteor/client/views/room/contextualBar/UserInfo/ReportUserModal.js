"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal/GenericModal"));
const ReportUserModal = ({ username, displayName, onConfirm, onClose }) => {
    const { register, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        defaultValues: {
            reasonForReport: '',
        },
    });
    const { t } = (0, react_i18next_1.useTranslation)();
    const reasonForReportId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { wrapperFunction: (props) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleSubmit(({ reasonForReport }) => onConfirm(reasonForReport)) }, props))), variant: 'danger', title: t('Report_User'), onClose: onClose, onCancel: onClose, confirmText: t('Report'), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbe: 16, display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: username }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mis: 8, fontScale: 'p2b', children: displayName })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: reasonForReportId, children: t('Report_reason') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldDescription, { id: `${reasonForReportId}-description`, children: t('Let_moderators_know_what_the_issue_is') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ id: reasonForReportId, rows: 3 }, register('reasonForReport', { required: t('Required_field', { field: t('Reason_for_report') }) }), { width: 'full', mbe: 4, "aria-required": 'true', "aria-describedby": `${reasonForReportId}-description ${reasonForReportId}-error` })) }), errors.reasonForReport && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${reasonForReportId}-error`, children: errors.reasonForReport.message }))] }) })] }));
};
exports.default = ReportUserModal;
