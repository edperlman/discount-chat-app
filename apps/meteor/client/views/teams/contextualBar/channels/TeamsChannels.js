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
const TeamsChannelItem_1 = __importDefault(require("./TeamsChannelItem"));
const Contextualbar_1 = require("../../../../components/Contextualbar");
const CustomScrollbars_1 = require("../../../../components/CustomScrollbars");
const InfiniteListAnchor_1 = __importDefault(require("../../../../components/InfiniteListAnchor"));
const TeamsChannels = ({ loading, channels = [], mainRoom, text, type, setText, setType, onClickClose, onClickAddExisting, onClickCreateNew, total, loadMoreItems, onClickView, reload, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const inputRef = (0, fuselage_hooks_1.useAutoFocus)(true);
    const options = (0, react_1.useMemo)(() => [
        ['all', t('All')],
        ['autoJoin', t('Team_Auto-join')],
    ], [t]);
    const lm = (0, fuselage_hooks_1.useMutableCallback)((start) => !loading && loadMoreItems(start, Math.min(50, total - start)));
    const loadMoreChannels = (0, fuselage_hooks_1.useDebouncedCallback)(() => {
        if (channels.length >= total) {
            return;
        }
        lm(channels.length);
    }, 300, [lm, channels]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'hash' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Team_Channels') }), onClickClose && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClickClose })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarSection, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { placeholder: t('Search'), value: text, ref: inputRef, onChange: setText, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x20' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: 'x144', mis: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { onChange: (val) => setType(val), value: type, options: options }) })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarContent, { p: 12, children: [loading && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pi: 24, pb: 12, children: (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { size: 'x12' }) })), !loading && channels.length === 0 && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarEmptyContent, { title: t('No_channels_in_team') }), !loading && channels.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { pi: 18, pb: 12, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'span', color: 'hint', fontScale: 'p2', children: [t('Showing'), ": ", channels.length] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'span', color: 'hint', fontScale: 'p2', mis: 8, children: [t('Total'), ": ", total] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: 'full', h: 'full', role: 'list', overflow: 'hidden', flexShrink: 1, children: (0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { totalCount: total, data: channels, 
                                    // eslint-disable-next-line react/no-multi-comp
                                    components: { Scroller: CustomScrollbars_1.VirtuosoScrollbars, Footer: () => (0, jsx_runtime_1.jsx)(InfiniteListAnchor_1.default, { loadMore: loadMoreChannels }) }, itemContent: (index, data) => ((0, jsx_runtime_1.jsx)(TeamsChannelItem_1.default, { onClickView: onClickView, room: data, mainRoom: mainRoom, reload: reload }, index)) }) })] }))] }), (onClickAddExisting || onClickCreateNew) && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [onClickAddExisting && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClickAddExisting, width: '50%', children: t('Team_Add_existing') })), onClickCreateNew && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClickCreateNew, width: '50%', children: t('Create_new') }))] }) }))] }));
};
exports.default = TeamsChannels;
