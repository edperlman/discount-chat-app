"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const QueueListTable_1 = __importDefault(require("./QueueListTable"));
const Page_1 = require("../../../components/Page");
const QueueListPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Livechat_Queue') }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsx)(QueueListTable_1.default, {}) })] }));
};
exports.default = QueueListPage;