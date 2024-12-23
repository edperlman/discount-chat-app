"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const ContactTableRow_1 = __importDefault(require("./ContactTableRow"));
const useCurrentContacts_1 = require("./hooks/useCurrentContacts");
const FilterByText_1 = __importDefault(require("../../../../components/FilterByText"));
const GenericNoResults_1 = __importDefault(require("../../../../components/GenericNoResults"));
const GenericTable_1 = require("../../../../components/GenericTable");
const usePagination_1 = require("../../../../components/GenericTable/hooks/usePagination");
const useSort_1 = require("../../../../components/GenericTable/hooks/useSort");
const CallContext_1 = require("../../../../contexts/CallContext");
function ContactTable() {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [term, setTerm] = (0, react_1.useState)('');
    const directoryRoute = (0, ui_contexts_1.useRoute)('omnichannel-directory');
    const isCallReady = (0, CallContext_1.useIsCallReady)();
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage, setCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const { sortBy, sortDirection, setSort } = (0, useSort_1.useSort)('name');
    const query = (0, fuselage_hooks_1.useDebouncedValue)((0, react_1.useMemo)(() => (Object.assign(Object.assign({ searchText: term, sort: `{ "${sortBy}": ${sortDirection === 'asc' ? 1 : -1} }` }, (itemsPerPage && { count: itemsPerPage })), (current && { offset: current }))), [itemsPerPage, current, sortBy, sortDirection, term]), 500);
    const onButtonNewClick = (0, fuselage_hooks_1.useEffectEvent)(() => directoryRoute.push({
        tab: 'contacts',
        context: 'new',
    }));
    const { data, isLoading, isError, isSuccess, refetch } = (0, useCurrentContacts_1.useCurrentContacts)(query);
    const [defaultQuery] = (0, react_1.useState)((0, react_query_1.hashQueryKey)([query]));
    const queryHasChanged = defaultQuery !== (0, react_query_1.hashQueryKey)([query]);
    const headers = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'name', onClick: setSort, sort: 'name', children: t('Name') }, 'name'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'channels.lastChat.ts', onClick: setSort, sort: 'channels.lastChat.ts', children: t('Last_channel') }, 'lastChannel'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'contactManager.username', onClick: setSort, sort: 'contactManager.username', children: t('Contact_Manager') }, 'contactManager'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'lastChat.ts', onClick: setSort, sort: 'lastChat.ts', children: t('Last_Chat') }, 'lastchat'), isCallReady && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { width: 44 }, 'call')] }));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [((isSuccess && (data === null || data === void 0 ? void 0 : data.contacts.length) > 0) || queryHasChanged) && ((0, jsx_runtime_1.jsx)(FilterByText_1.default, { value: term, onChange: (event) => setTerm(event.target.value), children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onButtonNewClick, primary: true, children: t('New_contact') }) })), isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: headers.props.children.filter(Boolean).length }) })] })), isSuccess && (data === null || data === void 0 ? void 0 : data.contacts.length) === 0 && queryHasChanged && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), isSuccess && (data === null || data === void 0 ? void 0 : data.contacts.length) === 0 && !queryHasChanged && ((0, jsx_runtime_1.jsx)(GenericNoResults_1.default, { icon: 'user-plus', title: t('No_contacts_yet'), description: t('No_contacts_yet_description'), buttonTitle: t('New_contact'), buttonAction: onButtonNewClick, linkHref: 'https://go.rocket.chat/i/omnichannel-docs', linkText: t('Learn_more_about_contacts') })), isSuccess && (data === null || data === void 0 ? void 0 : data.contacts.length) > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: data === null || data === void 0 ? void 0 : data.contacts.map((contact) => (0, jsx_runtime_1.jsx)(ContactTableRow_1.default, Object.assign({}, contact), contact._id)) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: data === null || data === void 0 ? void 0 : data.total, onSetItemsPerPage: setItemsPerPage, onSetCurrent: setCurrent }, paginationProps))] })), isError && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 20, children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { variation: 'danger', name: 'circle-exclamation' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Connection_error') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { icon: 'reload', onClick: () => refetch(), children: t('Reload_page') }) })] }) }))] }));
}
exports.default = ContactTable;
