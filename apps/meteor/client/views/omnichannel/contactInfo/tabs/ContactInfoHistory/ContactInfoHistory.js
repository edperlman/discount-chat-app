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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_virtuoso_1 = require("react-virtuoso");
const ContactInfoHistoryItem_1 = __importDefault(require("./ContactInfoHistoryItem"));
const Contextualbar_1 = require("../../../../../components/Contextualbar");
const CustomScrollbars_1 = require("../../../../../components/CustomScrollbars");
const useHasLicenseModule_1 = require("../../../../../hooks/useHasLicenseModule");
const useOmnichannelSource_1 = require("../../../hooks/useOmnichannelSource");
const AdvancedContactModal_1 = __importDefault(require("../../AdvancedContactModal"));
const isFilterBlocked = (hasLicense, fieldValue) => !hasLicense && fieldValue !== 'all';
const ContactInfoHistory = ({ contact, setChatId }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const [storedType, setStoredType] = (0, fuselage_hooks_1.useLocalStorage)('contact-history-type', 'all');
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('contact-id-verification');
    const type = isFilterBlocked(hasLicense, storedType) ? 'all' : storedType;
    const { getSourceName } = (0, useOmnichannelSource_1.useOmnichannelSource)();
    const getContactHistory = (0, ui_contexts_1.useEndpoint)('GET', '/v1/omnichannel/contacts.history');
    const { data, isLoading, isError } = (0, react_query_1.useQuery)(['getContactHistory', contact._id, type], () => getContactHistory({ contactId: contact._id, source: type === 'all' ? undefined : type }));
    const handleChangeFilter = (value) => {
        if (isFilterBlocked(hasLicense, value)) {
            return setModal((0, jsx_runtime_1.jsx)(AdvancedContactModal_1.default, { onCancel: () => setModal(null) }));
        }
        setStoredType(value);
    };
    const historyFilterOptions = (0, react_1.useMemo)(() => Object.values(core_typings_1.OmnichannelSourceType).reduce((acc, cv) => {
        var _a;
        let sourceName;
        const hasSourceType = (_a = contact.channels) === null || _a === void 0 ? void 0 : _a.find((item) => {
            sourceName = getSourceName(item.details, false);
            return item.details.type === cv;
        });
        if (hasSourceType && sourceName) {
            acc.push([cv, sourceName]);
        }
        return acc;
    }, [['all', t('All')]]), [contact.channels, getSourceName, t]);
    return ((0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarContent, { paddingInline: 0, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', p: 24, borderBlockEndWidth: 'default', borderBlockEndStyle: 'solid', borderBlockEndColor: 'extra-light', flexShrink: 0, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', flexGrow: 1, mi: 'neg-x4', children: (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inline: 4, children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { value: type, onChange: handleChangeFilter, placeholder: t('Filter'), options: historyFilterOptions, disabled: type === 'all' && (data === null || data === void 0 ? void 0 : data.history.length) === 0 }) }) }) }), isLoading && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pi: 24, pb: 12, children: (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { size: 'x12' }) })), isError && ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') })] })), (data === null || data === void 0 ? void 0 : data.history.length) === 0 && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarEmptyContent, { icon: 'history', title: t('No_history_yet'), subtitle: t('No_history_yet_description') })), !isError && (data === null || data === void 0 ? void 0 : data.history) && data.history.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { pi: 24, pb: 12, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', color: 'hint', fontScale: 'p2', children: t('Showing_current_of_total', { current: data === null || data === void 0 ? void 0 : data.history.length, total: data === null || data === void 0 ? void 0 : data.total }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { role: 'list', flexGrow: 1, flexShrink: 1, overflow: 'hidden', display: 'flex', children: (0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { totalCount: data.history.length, overscan: 25, data: data === null || data === void 0 ? void 0 : data.history, components: { Scroller: CustomScrollbars_1.VirtuosoScrollbars }, itemContent: (index, data) => (0, jsx_runtime_1.jsx)(ContactInfoHistoryItem_1.default, Object.assign({ onClick: () => setChatId(data._id) }, data), index) }) })] }))] }));
};
exports.default = ContactInfoHistory;
