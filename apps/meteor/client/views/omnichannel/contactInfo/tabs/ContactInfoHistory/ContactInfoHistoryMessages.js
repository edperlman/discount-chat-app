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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_virtuoso_1 = require("react-virtuoso");
const Contextualbar_1 = require("../../../../../components/Contextualbar");
const CustomScrollbars_1 = require("../../../../../components/CustomScrollbars");
const useRecordList_1 = require("../../../../../hooks/lists/useRecordList");
const asyncState_1 = require("../../../../../lib/asyncState");
const isMessageNewDay_1 = require("../../../../room/MessageList/lib/isMessageNewDay");
const isMessageSequential_1 = require("../../../../room/MessageList/lib/isMessageSequential");
const ContactHistoryMessage_1 = __importDefault(require("../../../contactHistory/MessageList/ContactHistoryMessage"));
const useHistoryMessageList_1 = require("../../../contactHistory/MessageList/useHistoryMessageList");
const ContactInfoHistoryMessages = ({ chatId, onBack, onOpenRoom }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [text, setText] = (0, react_1.useState)('');
    const showUserAvatar = !!(0, ui_contexts_1.useUserPreference)('displayAvatars');
    const userId = (0, ui_contexts_1.useUserId)();
    const { ref, contentBoxSize: { inlineSize = 378, blockSize = 1 } = {} } = (0, fuselage_hooks_1.useResizeObserver)({
        debounceDelay: 200,
    });
    const query = (0, fuselage_hooks_1.useDebouncedValue)((0, react_1.useMemo)(() => ({ roomId: chatId, filter: text }), [chatId, text]), 500);
    const { itemsList: messageList, loadMoreItems } = (0, useHistoryMessageList_1.useHistoryMessageList)(query, userId);
    const handleSearchChange = (event) => {
        setText(event.currentTarget.value);
    };
    const { phase, error, items: messages, itemCount: totalItemCount } = (0, useRecordList_1.useRecordList)(messageList);
    const messageGroupingPeriod = Number((0, ui_contexts_1.useSetting)('Message_GroupingPeriod'));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarContent, { paddingInline: 0, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', p: 24, borderBlockEndWidth: 'default', borderBlockEndStyle: 'solid', borderBlockEndColor: 'extra-light', flexShrink: 0, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', alignItems: 'center', flexDirection: 'row', flexGrow: 1, mi: 'neg-x4', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inline: 4, children: [(0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { placeholder: t('Search'), value: text, onChange: handleSearchChange, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x20' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { title: t('Back'), small: true, icon: 'back', onClick: onBack })] }) }) }), phase === asyncState_1.AsyncStatePhase.LOADING && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pi: 24, pb: 12, children: (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { size: 'x12' }) })), error && ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: error.toString() })] })), phase !== asyncState_1.AsyncStatePhase.LOADING && totalItemCount === 0 && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarEmptyContent, { title: t('No_results_found') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 1, flexShrink: 1, overflow: 'hidden', display: 'flex', ref: ref, children: !error && totalItemCount > 0 && history.length > 0 && ((0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { totalCount: totalItemCount, initialTopMostItemIndex: { index: 'LAST' }, followOutput: true, style: {
                                height: blockSize,
                                width: inlineSize,
                            }, endReached: phase === asyncState_1.AsyncStatePhase.LOADING
                                ? () => undefined
                                : (start) => {
                                    loadMoreItems(start, Math.min(50, totalItemCount - start));
                                }, overscan: 25, data: messages, components: { Scroller: CustomScrollbars_1.VirtuosoScrollbars }, itemContent: (index, data) => {
                                const lastMessage = messages[index - 1];
                                const isSequential = (0, isMessageSequential_1.isMessageSequential)(data, lastMessage, messageGroupingPeriod);
                                const isNewDay = (0, isMessageNewDay_1.isMessageNewDay)(data, lastMessage);
                                return ((0, jsx_runtime_1.jsx)(ContactHistoryMessage_1.default, { message: data, sequential: isSequential, isNewDay: isNewDay, showUserAvatar: showUserAvatar }));
                            } })) })] }), onOpenRoom && ((0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onOpenRoom, children: t('Open_chat') }) }) }))] }));
};
exports.default = ContactInfoHistoryMessages;
