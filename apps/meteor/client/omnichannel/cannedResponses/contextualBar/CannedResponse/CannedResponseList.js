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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_virtuoso_1 = require("react-virtuoso");
const Item_1 = __importDefault(require("./Item"));
const WrapCannedResponse_1 = __importDefault(require("./WrapCannedResponse"));
const Contextualbar_1 = require("../../../../components/Contextualbar");
const CustomScrollbars_1 = require("../../../../components/CustomScrollbars");
const RoomToolboxContext_1 = require("../../../../views/room/contexts/RoomToolboxContext");
const CannedResponseList = ({ loadMoreItems, cannedItems, itemCount, onClose, loading, options, text, setText, type, setType, isRoomOverMacLimit, onClickItem, onClickCreate, onClickUse, reload, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const inputRef = (0, fuselage_hooks_1.useAutoFocus)(true);
    const { context: cannedId } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const { ref, contentBoxSize: { inlineSize = 378 } = {} } = (0, fuselage_hooks_1.useResizeObserver)({
        debounceDelay: 200,
    });
    const cannedItem = cannedItems.find((canned) => canned._id === cannedId);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Canned_Responses') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClose })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarContent, { paddingInline: 0, ref: ref, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', p: 24, flexShrink: 0, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', flexGrow: 1, mi: 'neg-x4', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inline: 4, children: [(0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { placeholder: t('Search'), value: text, onChange: setText, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x20' }), ref: inputRef }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: 'x144', children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { onChange: (value) => setType(String(value)), value: type, options: options }) })] }) }) }), itemCount === 0 && (0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarEmptyContent, { title: t('No_Canned_Responses') }), itemCount > 0 && cannedItems.length > 0 && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 1, flexShrink: 1, overflow: 'hidden', display: 'flex', children: (0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { style: { width: inlineSize }, totalCount: itemCount, endReached: loading ? undefined : (start) => loadMoreItems(start, Math.min(25, itemCount - start)), overscan: 25, data: cannedItems, components: {
                                Scroller: CustomScrollbars_1.VirtuosoScrollbars,
                            }, itemContent: (_index, data) => ((0, jsx_runtime_1.jsx)(Item_1.default, { data: data, allowUse: !isRoomOverMacLimit, onClickItem: () => {
                                    onClickItem(data);
                                }, onClickUse: onClickUse })) }) }))] }), cannedItem && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarInnerContent, { children: (0, jsx_runtime_1.jsx)(WrapCannedResponse_1.default, { allowUse: !isRoomOverMacLimit, cannedItem: cannedItem, onClickBack: onClickItem, onClickUse: onClickUse, reload: reload }) })), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClickCreate, children: t('Create') }) }) })] }));
};
exports.default = (0, react_1.memo)(CannedResponseList);
