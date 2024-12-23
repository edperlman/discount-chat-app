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
const EditTrigger_1 = __importDefault(require("./EditTrigger"));
const EditTriggerWithData_1 = __importDefault(require("./EditTriggerWithData"));
const TriggersTable_1 = __importDefault(require("./TriggersTable"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const Page_1 = require("../../../components/Page");
const TriggersPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const router = (0, ui_contexts_1.useRouter)();
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'row', children: [(0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Livechat_Triggers'), children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => router.navigate('/omnichannel/triggers/new'), children: t('Create_trigger') }) }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsx)(TriggersTable_1.default, {}) })] }), context && ((0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarDialog, { children: [context === 'edit' && id && (0, jsx_runtime_1.jsx)(EditTriggerWithData_1.default, { triggerId: id }), context === 'new' && (0, jsx_runtime_1.jsx)(EditTrigger_1.default, {})] }))] }));
};
exports.default = TriggersPage;
