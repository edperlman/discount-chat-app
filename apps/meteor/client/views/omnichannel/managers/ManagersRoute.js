"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const ManagersTable_1 = __importDefault(require("./ManagersTable"));
const Page_1 = require("../../../components/Page");
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const ManagersRoute = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const canViewManagers = (0, ui_contexts_1.usePermission)('manage-livechat-managers');
    if (!canViewManagers) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    return ((0, jsx_runtime_1.jsx)(Page_1.Page, { flexDirection: 'row', children: (0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Managers') }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsx)(ManagersTable_1.default, {}) })] }) }));
};
exports.default = ManagersRoute;
