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
const react_virtuoso_1 = require("react-virtuoso");
const RoomMembersRow_1 = __importDefault(require("./RoomMembersRow"));
const Contextualbar_1 = require("../../../../components/Contextualbar");
const CustomScrollbars_1 = require("../../../../components/CustomScrollbars");
const InfiniteListAnchor_1 = __importDefault(require("../../../../components/InfiniteListAnchor"));
const RoomMembers = ({ loading, members = [], text, type, setText, setType, onClickClose, onClickView, onClickAdd, onClickInvite, total, error, loadMoreItems, renderRow: RowComponent = RoomMembersRow_1.default, rid, isTeam, isDirect, reload, }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const inputRef = (0, fuselage_hooks_1.useAutoFocus)(true);
    const itemData = (0, react_1.useMemo)(() => ({ onClickView, rid }), [onClickView, rid]);
    const options = (0, react_1.useMemo)(() => [
        ['online', t('Online')],
        ['all', t('All')],
    ], [t]);
    const loadMoreMembers = (0, fuselage_hooks_1.useDebouncedCallback)(() => {
        loadMoreItems();
    }, 300, [loadMoreItems, members]);
    const useRealName = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name', false);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { "data-qa-id": 'RoomHeader-Members', children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'members' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: isTeam ? t('Teams_members') : t('Members') }), onClickClose && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClickClose })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarSection, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { placeholder: t('Search_by_username'), value: text, ref: inputRef, onChange: setText, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x20' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: 'x144', mis: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { onChange: (value) => setType(value), value: type, options: options }) })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarContent, { p: 12, children: [loading && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pi: 24, pb: 12, children: (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { size: 'x12' }) })), error && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pi: 12, pb: 12, children: (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', children: error.message }) })), !loading && members.length <= 0 && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarEmptyContent, { title: t('No_members_found') }), !loading && members.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { pi: 18, pb: 12, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', color: 'hint', fontScale: 'p2', children: t('Showing_current_of_total', { current: members.length, total }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: 'full', h: 'full', overflow: 'hidden', flexShrink: 1, children: (0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { style: {
                                        height: '100%',
                                        width: '100%',
                                    }, totalCount: total, overscan: 50, data: members, 
                                    // eslint-disable-next-line react/no-multi-comp
                                    components: { Scroller: CustomScrollbars_1.VirtuosoScrollbars, Footer: () => (0, jsx_runtime_1.jsx)(InfiniteListAnchor_1.default, { loadMore: loadMoreMembers }) }, itemContent: (index, data) => ((0, jsx_runtime_1.jsx)(RowComponent, { useRealName: useRealName, data: itemData, user: data, index: index, reload: reload })) }) })] }))] }), !isDirect && (onClickInvite || onClickAdd) && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [onClickInvite && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'link', onClick: onClickInvite, width: '50%', children: t('Invite_Link') })), onClickAdd && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'user-plus', onClick: onClickAdd, width: '50%', primary: true, children: t('Add') }))] }) }))] }));
};
exports.default = RoomMembers;
