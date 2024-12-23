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
const CustomFieldsTable_1 = __importDefault(require("./CustomFieldsTable"));
const EditCustomFields_1 = __importDefault(require("./EditCustomFields"));
const EditCustomFieldsWithData_1 = __importDefault(require("./EditCustomFieldsWithData"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const Page_1 = require("../../../components/Page");
const CustomFieldsPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'row', children: [(0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Custom_Fields'), children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { "data-qa-id": 'CustomFieldPageBtnNew', onClick: () => router.navigate('/omnichannel/customfields/new'), children: t('Create_custom_field') }) }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsx)(CustomFieldsTable_1.default, {}) })] }), context && ((0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarDialog, { children: [context === 'edit' && id && (0, jsx_runtime_1.jsx)(EditCustomFieldsWithData_1.default, { customFieldId: id }), context === 'new' && (0, jsx_runtime_1.jsx)(EditCustomFields_1.default, {})] }))] }));
};
exports.default = CustomFieldsPage;
