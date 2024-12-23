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
const IntegrationsTable_1 = __importDefault(require("./IntegrationsTable"));
const NewBot_1 = __importDefault(require("./NewBot"));
const NewZapier_1 = __importDefault(require("./NewZapier"));
const Page_1 = require("../../../components/Page");
const IntegrationsPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const showTable = !['zapier', 'bots'].includes(context || '');
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Integrations'), children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: () => router.navigate(`/admin/integrations/new/${context === 'webhook-outgoing' ? 'outgoing' : 'incoming'}`), children: t('New') }) }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Tabs, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: !context, onClick: () => router.navigate('/admin/integrations'), children: t('All') }), (0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: context === 'webhook-incoming', onClick: () => router.navigate('/admin/integrations/webhook-incoming'), children: t('Incoming') }), (0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: context === 'webhook-outgoing', onClick: () => router.navigate('/admin/integrations/webhook-outgoing'), children: t('Outgoing') }), (0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: context === 'zapier', onClick: () => router.navigate('/admin/integrations/zapier'), children: t('Zapier') }), (0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: context === 'bots', onClick: () => router.navigate('/admin/integrations/bots'), children: t('Bots') })] }), (0, jsx_runtime_1.jsxs)(Page_1.PageContent, { children: [context === 'zapier' && (0, jsx_runtime_1.jsx)(NewZapier_1.default, {}), context === 'bots' && (0, jsx_runtime_1.jsx)(NewBot_1.default, {}), showTable && (0, jsx_runtime_1.jsx)(IntegrationsTable_1.default, { type: context })] })] }));
};
exports.default = IntegrationsPage;
