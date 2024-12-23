"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const react_virtuoso_1 = require("react-virtuoso");
const VideoConfListItem_1 = __importDefault(require("./VideoConfListItem"));
const Contextualbar_1 = require("../../../../../components/Contextualbar");
const CustomScrollbars_1 = require("../../../../../components/CustomScrollbars");
const errorHandling_1 = require("../../../../../lib/errorHandling");
const VideoConfList = ({ onClose, total, videoConfs, loading, error, reload, loadMoreItems }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { ref, contentBoxSize: { inlineSize = 378, blockSize = 1 } = {} } = (0, fuselage_hooks_1.useResizeObserver)({
        debounceDelay: 200,
    });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'phone' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Calls') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClose })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarContent, { paddingInline: 0, ref: ref, children: [loading && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pi: 24, pb: 12, children: (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { size: 'x12' }) })), (total === 0 || error) && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', children: [error && ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'circle-exclamation', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: (0, errorHandling_1.getErrorMessage)(error) })] })), !loading && total === 0 && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarEmptyContent, { icon: 'phone', title: t('No_history'), subtitle: t('There_is_no_video_conference_history_in_this_room') }))] })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 1, flexShrink: 1, overflow: 'hidden', display: 'flex', children: videoConfs.length > 0 && ((0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { style: {
                                height: blockSize,
                                width: inlineSize,
                            }, totalCount: total, endReached: loading
                                ? () => undefined
                                : (start) => {
                                    loadMoreItems(start, Math.min(50, total - start));
                                }, overscan: 25, data: videoConfs, components: { Scroller: CustomScrollbars_1.VirtuosoScrollbars }, itemContent: (_index, data) => (0, jsx_runtime_1.jsx)(VideoConfListItem_1.default, { videoConfData: data, reload: reload }) })) })] })] }));
};
exports.default = VideoConfList;
