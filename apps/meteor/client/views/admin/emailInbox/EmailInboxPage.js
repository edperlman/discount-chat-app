"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const EmailInboxForm_1 = __importDefault(require("./EmailInboxForm"));
const EmailInboxFormWithData_1 = __importDefault(require("./EmailInboxFormWithData"));
const EmailInboxTable_1 = __importDefault(require("./EmailInboxTable"));
const Page_1 = require("../../../components/Page");
const EmailInboxPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const id = (0, ui_contexts_1.useRouteParameter)('_id');
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    return ((0, jsx_runtime_1.jsx)(Page_1.Page, { flexDirection: 'row', children: (0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Email_Inboxes'), onClickBack: context ? () => router.navigate('/admin/email-inboxes') : undefined, children: !context && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: () => router.navigate('/admin/email-inboxes/new'), children: t('New_Email_Inbox') })) }), (0, jsx_runtime_1.jsxs)(Page_1.PageContent, { children: [!context && (0, jsx_runtime_1.jsx)(EmailInboxTable_1.default, {}), context === 'new' && (0, jsx_runtime_1.jsx)(EmailInboxForm_1.default, {}), context === 'edit' && id && (0, jsx_runtime_1.jsx)(EmailInboxFormWithData_1.default, { id: id })] })] }) }));
};
exports.default = EmailInboxPage;
