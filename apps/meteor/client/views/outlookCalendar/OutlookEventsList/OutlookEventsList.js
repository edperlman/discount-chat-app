"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_virtuoso_1 = require("react-virtuoso");
const OutlookEventItem_1 = __importDefault(require("./OutlookEventItem"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const CustomScrollbars_1 = require("../../../components/CustomScrollbars");
const errorHandling_1 = require("../../../lib/errorHandling");
const useOutlookAuthentication_1 = require("../hooks/useOutlookAuthentication");
const useOutlookCalendarList_1 = require("../hooks/useOutlookCalendarList");
const NotOnDesktopError_1 = require("../lib/NotOnDesktopError");
const OutlookEventsList = ({ onClose, changeRoute }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const outlookUrl = (0, ui_contexts_1.useSetting)('Outlook_Calendar_Outlook_Url', '');
    const { authEnabled, isError, error } = (0, useOutlookAuthentication_1.useOutlookAuthentication)();
    const hasOutlookMethods = !(isError && error instanceof NotOnDesktopError_1.NotOnDesktopError);
    const syncOutlookCalendar = (0, useOutlookCalendarList_1.useMutationOutlookCalendarSync)();
    const calendarListResult = (0, useOutlookCalendarList_1.useOutlookCalendarListForToday)();
    const { ref, contentBoxSize: { inlineSize = 378, blockSize = 1 } = {} } = (0, fuselage_hooks_1.useResizeObserver)({
        debounceDelay: 200,
    });
    if (calendarListResult.isLoading) {
        return (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarSkeleton, {});
    }
    const calendarEvents = calendarListResult.data;
    const total = (calendarEvents === null || calendarEvents === void 0 ? void 0 : calendarEvents.length) || 0;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'calendar' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Outlook_calendar') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClose })] }), hasOutlookMethods && !authEnabled && total === 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { paddingInline: 0, ref: ref, color: 'default', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'user' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Log_in_to_sync') })] }) }) }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, loading: syncOutlookCalendar.isLoading, onClick: () => syncOutlookCalendar.mutate(), children: t('Login') }) }) }) })] })), (authEnabled || !hasOutlookMethods) && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarContent, { paddingInline: 0, ref: ref, color: 'default', children: [(total === 0 || calendarListResult.isError) && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', children: [calendarListResult.isError && ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'circle-exclamation', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: (0, errorHandling_1.getErrorMessage)(calendarListResult.error) })] })), !calendarListResult.isError && total === 0 && ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'calendar' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('No_history') })] }))] })), calendarListResult.isSuccess && calendarListResult.data.length > 0 && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 1, flexShrink: 1, overflow: 'hidden', display: 'flex', children: (0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { style: {
                                        height: blockSize,
                                        width: inlineSize,
                                    }, totalCount: total, overscan: 25, data: calendarEvents, components: { Scroller: CustomScrollbars_1.VirtuosoScrollbars }, itemContent: (_index, calendarData) => (0, jsx_runtime_1.jsx)(OutlookEventItem_1.default, Object.assign({}, calendarData)) }) }))] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarFooter, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [authEnabled && (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: changeRoute, children: t('Calendar_settings') }), outlookUrl && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'new-window', onClick: () => window.open(outlookUrl, '_blank'), children: t('Open_Outlook') }))] }), hasOutlookMethods && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, loading: syncOutlookCalendar.isLoading, onClick: () => syncOutlookCalendar.mutate(), children: t('Sync') }) }) }))] })] }))] }));
};
exports.default = OutlookEventsList;
