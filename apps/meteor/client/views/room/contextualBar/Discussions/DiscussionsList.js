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
const DiscussionsListRow_1 = __importDefault(require("./DiscussionsListRow"));
const Contextualbar_1 = require("../../../../components/Contextualbar");
const CustomScrollbars_1 = require("../../../../components/CustomScrollbars");
const goToRoomById_1 = require("../../../../lib/utils/goToRoomById");
function DiscussionsList({ total = 10, discussions = [], loadMoreItems, loading, onClose, error, text, onChangeFilter, }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const showRealNames = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name', false);
    const inputRef = (0, fuselage_hooks_1.useAutoFocus)(true);
    const onClick = (0, react_1.useCallback)((e) => {
        const { drid } = e.currentTarget.dataset;
        (0, goToRoomById_1.goToRoomById)(drid);
    }, []);
    const { ref, contentBoxSize: { inlineSize = 378, blockSize = 1 } = {} } = (0, fuselage_hooks_1.useResizeObserver)({
        debounceDelay: 200,
    });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'discussion' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Discussions') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClose })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarSection, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { placeholder: t('Search_Messages'), value: text, onChange: onChangeFilter, ref: inputRef, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x20' }) }) }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarContent, { paddingInline: 0, ref: ref, children: [loading && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pi: 24, pb: 12, children: (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { size: 'x12' }) })), error instanceof Error && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { mi: 24, type: 'danger', children: error.toString() })), !loading && total === 0 && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarEmptyContent, { title: t('No_Discussions_found') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 1, flexShrink: 1, overflow: 'hidden', display: 'flex', children: !error && total > 0 && discussions.length > 0 && ((0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { style: {
                                height: blockSize,
                                width: inlineSize,
                                overflow: 'hidden',
                            }, totalCount: total, endReached: loading ? () => undefined : (start) => loadMoreItems(start, Math.min(50, total - start)), overscan: 25, data: discussions, components: { Scroller: CustomScrollbars_1.VirtuosoScrollbars }, itemContent: (_, data) => (0, jsx_runtime_1.jsx)(DiscussionsListRow_1.default, { discussion: data, showRealNames: showRealNames, onClick: onClick }) })) })] })] }));
}
exports.default = DiscussionsList;
