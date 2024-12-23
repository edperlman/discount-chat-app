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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const AssignAgentButton_1 = __importDefault(require("./AssignAgentButton"));
const AssignAgentModal_1 = __importDefault(require("./AssignAgentModal"));
const RemoveAgentButton_1 = __importDefault(require("./RemoveAgentButton"));
const GenericNoResults_1 = __importDefault(require("../../../../../components/GenericNoResults"));
const GenericTable_1 = require("../../../../../components/GenericTable");
const usePagination_1 = require("../../../../../components/GenericTable/hooks/usePagination");
const Page_1 = require("../../../../../components/Page");
const VoipExtensionsPage = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage: onSetItemsPerPage, setCurrent: onSetCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const query = (0, react_1.useMemo)(() => (Object.assign(Object.assign({}, (itemsPerPage && { count: itemsPerPage })), (current && { offset: current }))), [itemsPerPage, current]);
    const getExtensions = (0, ui_contexts_1.useEndpoint)('GET', '/v1/omnichannel/extensions');
    const { data, isSuccess, isLoading, refetch } = (0, react_query_1.useQuery)(['omnichannel-extensions', query], () => __awaiter(void 0, void 0, void 0, function* () { return getExtensions(query); }));
    const headers = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 'x156', children: t('Extension_Number') }, 'extension-number'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 'x160', children: t('Agent_Name') }, 'agent-name'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 'x120', children: t('Extension_Status') }, 'extension-status'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 'x120', children: t('Queues') }, 'queues'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 'x60' }, 'remove-add')] }));
    return ((0, jsx_runtime_1.jsxs)(Page_1.PageContent, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', mb: 14, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2', color: 'hint', children: [data === null || data === void 0 ? void 0 : data.total, " ", t('Extensions')] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: () => setModal((0, jsx_runtime_1.jsx)(AssignAgentModal_1.default, { closeModal: () => setModal(), reload: refetch })), children: t('Associate_Agent') }) })] }), isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingRow, { cols: 4 }) })] })), isSuccess && (data === null || data === void 0 ? void 0 : data.extensions.length) === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), isSuccess && (data === null || data === void 0 ? void 0 : data.extensions.length) > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: data === null || data === void 0 ? void 0 : data.extensions.map(({ extension, username, name, state, queues }) => ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { tabIndex: 0, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: extension }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: username ? ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x28', username: username }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', mi: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', alignSelf: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2m', color: 'default', children: name || username }) }) })] })) : (t('Free')) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: state }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, maxHeight: 'x36', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', title: queues === null || queues === void 0 ? void 0 : queues.join(', '), children: [queues === null || queues === void 0 ? void 0 : queues.map((queue, index) => index <= 1 && ((0, jsx_runtime_1.jsx)(fuselage_1.Chip, { mie: 4, value: queue, children: queue }, queue))), queues && (queues === null || queues === void 0 ? void 0 : queues.length) > 2 && `+${(queues.length - 2).toString()}`] }) }), username ? ((0, jsx_runtime_1.jsx)(RemoveAgentButton_1.default, { username: username, reload: refetch })) : ((0, jsx_runtime_1.jsx)(AssignAgentButton_1.default, { extension: extension, reload: refetch }))] }, extension))) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: (data === null || data === void 0 ? void 0 : data.total) || 0, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent }, paginationProps))] }))] }));
};
exports.default = VoipExtensionsPage;
