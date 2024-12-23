"use strict";
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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const emailValidator_1 = require("../../../../lib/emailValidator");
const isJSON_1 = require("../../../../lib/utils/isJSON");
const Page_1 = require("../../../components/Page");
const initialData = { fromEmail: '', query: '', dryRun: false, subject: '', emailBody: '' };
const MailerPage = () => {
    var _a, _b, _c, _d;
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { register, formState: { errors, isDirty }, handleSubmit, reset, control, } = (0, react_hook_form_1.useForm)({ defaultValues: initialData, mode: 'onBlur' });
    const mailerEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/mailer');
    const sendMailAction = (0, react_query_1.useMutation)({
        mutationFn: mailerEndpoint,
        onSuccess: () => {
            dispatchToastMessage({
                type: 'success',
                message: t('The_emails_are_being_sent'),
            });
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    const handleSendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fromEmail, subject, emailBody, dryRun, query }) {
        sendMailAction.mutateAsync({ from: fromEmail, subject, body: emailBody, dryrun: dryRun, query });
    });
    const mailerFormId = (0, fuselage_hooks_1.useUniqueId)();
    const fromEmailId = (0, fuselage_hooks_1.useUniqueId)();
    const queryId = (0, fuselage_hooks_1.useUniqueId)();
    const dryRunId = (0, fuselage_hooks_1.useUniqueId)();
    const subjectId = (0, fuselage_hooks_1.useUniqueId)();
    const emailBodyId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Mailer') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { alignSelf: 'center', w: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { id: mailerFormId, is: 'form', autoComplete: 'off', maxWidth: 'x600', onSubmit: handleSubmit(handleSendEmail), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: fromEmailId, children: t('From') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: fromEmailId, placeholder: t('Type_your_email') }, register('fromEmail', {
                                            required: t('Required_field', { field: t('From') }),
                                            validate: (fromEmail) => ((0, emailValidator_1.validateEmail)(fromEmail) ? undefined : t('error-invalid-email-address')),
                                        }), { error: (_a = errors.fromEmail) === null || _a === void 0 ? void 0 : _a.message, "aria-required": 'true', "aria-invalid": errors.fromEmail ? 'true' : 'false', "aria-describedby": `${fromEmailId}-error` })) }), errors.fromEmail && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${fromEmailId}-error`, children: errors.fromEmail.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: dryRunId, children: t('Dry_run') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'dryRun', render: ({ field: { ref, value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { "aria-describedby": `${dryRunId}-hint`, ref: ref, id: dryRunId, checked: value, onChange: onChange })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${dryRunId}-hint`, children: t('Dry_run_description') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: queryId, children: t('Query') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: queryId }, register('query', {
                                            validate: (query) => (query && query !== '' && !(0, isJSON_1.isJSON)(query) ? t('Query_is_not_valid_JSON') : true),
                                        }), { error: (_b = errors.query) === null || _b === void 0 ? void 0 : _b.message, "aria-describedby": `${queryId}-error ${queryId}-hint`, "aria-invalid": errors.query ? 'true' : 'false' })) }), errors.query && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { id: `${queryId}-error`, "aria-live": 'assertive', children: errors.query.message })), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${queryId}-hint`, children: t('Query_description') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: subjectId, children: t('Subject') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: subjectId }, register('subject', { required: t('Required_field', { field: t('Subject') }) }), { "aria-describedby": `${subjectId}-error`, error: (_c = errors.subject) === null || _c === void 0 ? void 0 : _c.message, "aria-required": 'true', "aria-invalid": errors.subject ? 'true' : 'false' })) }), errors.subject && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${subjectId}-error`, children: errors.subject.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: emailBodyId, children: t('Email_body') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ id: emailBodyId }, register('emailBody', {
                                            required: t('Required_field', { field: t('Email_body') }),
                                            validate: (emailBody) => ((emailBody === null || emailBody === void 0 ? void 0 : emailBody.indexOf('[unsubscribe]')) === -1 ? t('error-missing-unsubscribe-link') : true),
                                        }), { rows: 10, "aria-describedby": `${emailBodyId}-error ${emailBodyId}-hint`, error: (_d = errors.emailBody) === null || _d === void 0 ? void 0 : _d.message, "aria-required": 'true', "aria-invalid": errors.emailBody ? 'true' : 'false' })) }), errors.emailBody && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${emailBodyId}-error`, children: errors.emailBody.message })), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${emailBodyId}-hint`, dangerouslySetInnerHTML: { __html: t('Mailer_body_tags') } })] })] }) }) }), (0, jsx_runtime_1.jsx)(Page_1.PageFooter, { isDirty: isDirty, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => reset(initialData), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: mailerFormId, primary: true, type: 'submit', children: t('Send_email') })] }) })] }));
};
exports.default = MailerPage;
