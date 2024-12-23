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
const CannedResponseEdit_1 = __importDefault(require("./CannedResponseEdit"));
const CannedResponseEditWithData_1 = __importDefault(require("./CannedResponseEditWithData"));
const CannedResponsesTable_1 = __importDefault(require("./CannedResponsesTable"));
const Page_1 = require("../../components/Page");
const CannedResponsesPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    if (context === 'edit' && id) {
        return (0, jsx_runtime_1.jsx)(CannedResponseEditWithData_1.default, { cannedResponseId: id });
    }
    if (context === 'new') {
        return (0, jsx_runtime_1.jsx)(CannedResponseEdit_1.default, {});
    }
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Canned_Responses'), children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => router.navigate('/omnichannel/canned-responses/new'), children: t('Create_canned_response') }) }) }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsx)(CannedResponsesTable_1.default, {}) })] }));
};
exports.default = CannedResponsesPage;
