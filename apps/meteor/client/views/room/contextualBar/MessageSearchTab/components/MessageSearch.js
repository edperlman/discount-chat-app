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
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_virtuoso_1 = require("react-virtuoso");
const client_1 = require("../../../../../../app/ui-utils/client");
const Contextualbar_1 = require("../../../../../components/Contextualbar");
const CustomScrollbars_1 = require("../../../../../components/CustomScrollbars");
const RoomMessage_1 = __importDefault(require("../../../../../components/message/variants/RoomMessage"));
const SystemMessage_1 = __importDefault(require("../../../../../components/message/variants/SystemMessage"));
const useFormatDate_1 = require("../../../../../hooks/useFormatDate");
const MessageListErrorBoundary_1 = __importDefault(require("../../../MessageList/MessageListErrorBoundary"));
const isMessageNewDay_1 = require("../../../MessageList/lib/isMessageNewDay");
const MessageListProvider_1 = __importDefault(require("../../../MessageList/providers/MessageListProvider"));
const LoadingMessagesIndicator_1 = __importDefault(require("../../../body/LoadingMessagesIndicator"));
const RoomContext_1 = require("../../../contexts/RoomContext");
const useMessageSearchQuery_1 = require("../hooks/useMessageSearchQuery");
const MessageSearch = ({ searchText, globalSearch }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const formatDate = (0, useFormatDate_1.useFormatDate)();
    const pageSize = (0, ui_contexts_1.useSetting)('PageSize', 10);
    const [limit, setLimit] = (0, react_1.useState)(pageSize);
    const showUserAvatar = !!(0, ui_contexts_1.useUserPreference)('displayAvatars');
    const subscription = (0, RoomContext_1.useRoomSubscription)();
    const messageSearchQuery = (0, useMessageSearchQuery_1.useMessageSearchQuery)({ searchText, limit, globalSearch });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', flexGrow: 1, flexShrink: 1, flexBasis: 0, children: [messageSearchQuery.data && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [messageSearchQuery.data.length === 0 && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarEmptyContent, { title: t('No_results_found') }), messageSearchQuery.data.length > 0 && ((0, jsx_runtime_1.jsx)(MessageListErrorBoundary_1.default, { children: (0, jsx_runtime_1.jsx)(MessageListProvider_1.default, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'section', display: 'flex', flexDirection: 'column', flexGrow: 1, flexShrink: 1, flexBasis: 'auto', height: 'full', children: (0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { totalCount: messageSearchQuery.data.length, overscan: 25, data: messageSearchQuery.data, components: { Scroller: CustomScrollbars_1.VirtuosoScrollbars }, itemContent: (index, message) => {
                                        var _a, _b, _c, _d, _e, _f;
                                        const previous = messageSearchQuery.data[index - 1];
                                        const newDay = (0, isMessageNewDay_1.isMessageNewDay)(message, previous);
                                        const system = client_1.MessageTypes.isSystemMessage(message);
                                        const unread = (_b = (_a = subscription === null || subscription === void 0 ? void 0 : subscription.tunread) === null || _a === void 0 ? void 0 : _a.includes(message._id)) !== null && _b !== void 0 ? _b : false;
                                        const mention = (_d = (_c = subscription === null || subscription === void 0 ? void 0 : subscription.tunreadUser) === null || _c === void 0 ? void 0 : _c.includes(message._id)) !== null && _d !== void 0 ? _d : false;
                                        const all = (_f = (_e = subscription === null || subscription === void 0 ? void 0 : subscription.tunreadGroup) === null || _e === void 0 ? void 0 : _e.includes(message._id)) !== null && _f !== void 0 ? _f : false;
                                        return ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [newDay && (0, jsx_runtime_1.jsx)(fuselage_1.MessageDivider, { children: formatDate(message.ts) }), system ? ((0, jsx_runtime_1.jsx)(SystemMessage_1.default, { message: message, showUserAvatar: showUserAvatar })) : ((0, jsx_runtime_1.jsx)(RoomMessage_1.default, { message: message, sequential: false, unread: unread, mention: mention, all: all, context: 'search', searchText: searchText, showUserAvatar: showUserAvatar }))] }, message._id));
                                    }, endReached: () => {
                                        setLimit((limit) => limit + pageSize);
                                    } }) }) }) }))] })), searchText && messageSearchQuery.isLoading && (0, jsx_runtime_1.jsx)(LoadingMessagesIndicator_1.default, {})] }));
};
exports.default = (0, react_1.memo)(MessageSearch);
