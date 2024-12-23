"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AgentEditWithData_1 = __importDefault(require("./AgentEditWithData"));
const AgentInfo_1 = __importDefault(require("./AgentInfo"));
const AgentsTable_1 = __importDefault(require("./AgentsTable/AgentsTable"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const Page_1 = require("../../../components/Page");
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const AgentsPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const canViewAgents = (0, ui_contexts_1.usePermission)('manage-livechat-agents');
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    if (!canViewAgents) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'row', children: [(0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Agents') }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsx)(AgentsTable_1.default, {}) })] }), context && ((0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarDialog, { children: [id && context === 'edit' && (0, jsx_runtime_1.jsx)(AgentEditWithData_1.default, { uid: id }), id && context === 'info' && (0, jsx_runtime_1.jsx)(AgentInfo_1.default, { uid: id })] }))] }));
};
exports.default = AgentsPage;
