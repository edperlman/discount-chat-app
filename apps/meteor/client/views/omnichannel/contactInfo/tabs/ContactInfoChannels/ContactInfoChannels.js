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
const react_virtuoso_1 = require("react-virtuoso");
const ContactInfoChannelsItem_1 = __importDefault(require("./ContactInfoChannelsItem"));
const Contextualbar_1 = require("../../../../../components/Contextualbar");
const CustomScrollbars_1 = require("../../../../../components/CustomScrollbars");
const ContactInfoChannels = ({ contactId }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const getContactChannels = (0, ui_contexts_1.useEndpoint)('GET', '/v1/omnichannel/contacts.channels');
    const { data, isError, isLoading } = (0, react_query_1.useQuery)(['getContactChannels', contactId], () => getContactChannels({ contactId }));
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { pb: 12, children: (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { size: 'x12' }) }) }));
    }
    if (isError) {
        return ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { paddingInline: 0, children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarContent, { paddingInline: 0, children: [((_a = data.channels) === null || _a === void 0 ? void 0 : _a.length) === 0 && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarEmptyContent, { icon: 'balloon', title: t('No_channels_yet'), subtitle: t('No_channels_yet_description') })), data.channels && data.channels.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', fontScale: 'p2', pbs: 24, pis: 24, mbe: 8, children: t('Last_contacts') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { role: 'list', flexGrow: 1, flexShrink: 1, overflow: 'hidden', display: 'flex', children: (0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { totalCount: data.channels.length, overscan: 25, data: data === null || data === void 0 ? void 0 : data.channels, components: { Scroller: CustomScrollbars_1.VirtuosoScrollbars }, itemContent: (index, data) => (0, jsx_runtime_1.jsx)(ContactInfoChannelsItem_1.default, Object.assign({}, data), index) }) })] }))] }));
};
exports.default = ContactInfoChannels;
