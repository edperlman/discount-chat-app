"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const TagEdit_1 = __importDefault(require("./TagEdit"));
const TagEditWithData_1 = __importDefault(require("./TagEditWithData"));
const TagsTable_1 = __importDefault(require("./TagsTable"));
const Contextualbar_1 = require("../../components/Contextualbar");
const Page_1 = require("../../components/Page");
const TagsPage = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'row', children: [(0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Tags'), children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => router.navigate('/omnichannel/tags/new'), children: t('Create_tag') }) }) }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsx)(TagsTable_1.default, {}) })] }), context && ((0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarDialog, { children: [context === 'edit' && id && (0, jsx_runtime_1.jsx)(TagEditWithData_1.default, { tagId: id }), context === 'new' && (0, jsx_runtime_1.jsx)(TagEdit_1.default, {})] }))] }));
};
exports.default = TagsPage;
