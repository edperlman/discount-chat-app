"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const EditOauthAppWithData_1 = __importDefault(require("./EditOauthAppWithData"));
const OAuthAddApp_1 = __importDefault(require("./OAuthAddApp"));
const OAuthAppsTable_1 = __importDefault(require("./OAuthAppsTable"));
const Page_1 = require("../../../components/Page");
const OAuthAppsPage = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    return ((0, jsx_runtime_1.jsx)(Page_1.Page, { flexDirection: 'row', children: (0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Third_party_login'), onClickBack: context ? () => router.navigate('/admin/third-party-login') : undefined, children: !context && ((0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: () => router.navigate('/admin/third-party-login/new'), children: t('New_Application') }) })) }), (0, jsx_runtime_1.jsxs)(Page_1.PageContent, { children: [!context && (0, jsx_runtime_1.jsx)(OAuthAppsTable_1.default, {}), id && context === 'edit' && (0, jsx_runtime_1.jsx)(EditOauthAppWithData_1.default, { _id: id }), context === 'new' && (0, jsx_runtime_1.jsx)(OAuthAddApp_1.default, {})] })] }) }));
};
exports.default = OAuthAppsPage;
