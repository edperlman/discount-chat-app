"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Contextualbar_1 = require("../../../components/Contextualbar");
const useIsEnterprise_1 = require("../../../hooks/useIsEnterprise");
const useActiveConnections_1 = require("../../hooks/useActiveConnections");
const CustomUserStatusService = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const result = (0, useActiveConnections_1.useActiveConnections)();
    const presenceDisabled = (0, ui_contexts_1.useSetting)('Presence_broadcast_disabled', false);
    const togglePresenceServiceEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/presence.enableBroadcast');
    const disablePresenceService = (0, react_query_1.useMutation)(() => togglePresenceServiceEndpoint());
    const { data: license, isLoading: licenseIsLoading } = (0, useIsEnterprise_1.useIsEnterprise)();
    if (result.isLoading || disablePresenceService.isLoading || licenseIsLoading) {
        return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { pi: 16, pb: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {})] }));
    }
    if (result.isError || disablePresenceService.isError) {
        return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 20, color: 'default', children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'circle-exclamation' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: t('Unable_to_load_active_connections') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { icon: 'reload', onClick: () => result.refetch(), children: t('Retry') })] }));
    }
    const { current, max, percentage } = result.data;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarContent, { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'default', children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', justifyContent: 'space-between', mb: 16, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p1', children: t('Service_status') }), (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { disabled: disablePresenceService.isLoading || !presenceDisabled || percentage === 100, checked: !presenceDisabled, onChange: () => disablePresenceService.mutate() })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', fontScale: 'c1', justifyContent: 'space-between', mb: 16, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: t('Active_connections') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (license === null || license === void 0 ? void 0 : license.isEnterprise) ? current : `${current}/${max}` })] }), !(license === null || license === void 0 ? void 0 : license.isEnterprise) && (0, jsx_runtime_1.jsx)(fuselage_1.ProgressBar, { percentage: percentage, variant: percentage > 80 ? 'danger' : 'success' }), presenceDisabled && ((0, jsx_runtime_1.jsx)(fuselage_1.Margins, { block: 16, children: (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', title: t('Service_disabled'), children: t('Service_disabled_description') }) }))] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', mb: 16, children: (license === null || license === void 0 ? void 0 : license.isEnterprise) ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', mb: 8, children: t('Premium_cap_description') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', mb: 8, children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'Larger_amounts_of_active_connections', children: ["For larger amounts of active connections you can consider our", (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'a', href: 'https://docs.rocket.chat/deploy/scaling-rocket.chat', target: '_blank', color: 'info', children: "multiple instance solutions" }), "."] }) })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', mb: 8, children: t('Community_cap_description') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', mb: 8, children: t('Premium_cap_description') })] })) })] }), !(license === null || license === void 0 ? void 0 : license.isEnterprise) && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { borderBlockStartWidth: 'default', borderBlockColor: 'extra-light', children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, vertical: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, width: '100%', is: 'a', href: 'https://www.rocket.chat/enterprise', target: '_blank', children: t('More_about_Premium_plans') }) }) }))] }));
};
exports.default = CustomUserStatusService;
