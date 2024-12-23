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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const MarkdownText_1 = __importDefault(require("../../../../components/MarkdownText"));
const MessageContentBody_1 = __importDefault(require("../../../../components/message/MessageContentBody"));
const wordBreak = (0, css_in_js_1.css) `
	word-break: break-word;
`;
const ReportMessageModal = ({ message, onClose }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const { register, formState: { errors }, handleSubmit, } = (0, react_hook_form_1.useForm)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const reportMessage = (0, ui_contexts_1.useEndpoint)('POST', '/v1/chat.reportMessage');
    const { _id } = message;
    const handleReportMessage = (_a) => __awaiter(void 0, [_a], void 0, function* ({ description }) {
        try {
            yield reportMessage({ messageId: _id, description });
            dispatchToastMessage({ type: 'success', message: t('Report_has_been_sent') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
        finally {
            onClose();
        }
    });
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleSubmit(handleReportMessage) }, props)), variant: 'danger', title: t('Report_this_message_question_mark'), onClose: onClose, onCancel: onClose, confirmText: t('Report_exclamation_mark'), children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 24, className: wordBreak, children: message.md ? (0, jsx_runtime_1.jsx)(MessageContentBody_1.default, { md: message.md }) : (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inline', parseEmoji: true, content: message.msg }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({}, register('description', { required: true }), { placeholder: t('Why_do_you_want_to_report_question_mark') })) }), errors.description && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('You_need_to_write_something') })] }) })] }));
};
exports.default = ReportMessageModal;
