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
const ThreadListItem_1 = __importDefault(require("./components/ThreadListItem"));
const useThreadsList_1 = require("./hooks/useThreadsList");
const Contextualbar_1 = require("../../../../components/Contextualbar");
const CustomScrollbars_1 = require("../../../../components/CustomScrollbars");
const useRecordList_1 = require("../../../../hooks/lists/useRecordList");
const asyncState_1 = require("../../../../lib/asyncState");
const RoomContext_1 = require("../../contexts/RoomContext");
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const useGoToThread_1 = require("../../hooks/useGoToThread");
const ThreadList = () => {
    var _a;
    const t = (0, ui_contexts_1.useTranslation)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const handleTabBarCloseButtonClick = (0, react_1.useCallback)(() => {
        closeTab();
    }, [closeTab]);
    const { ref, contentBoxSize: { inlineSize = 378, blockSize = 1 } = {} } = (0, fuselage_hooks_1.useResizeObserver)({
        debounceDelay: 200,
    });
    const autoFocusRef = (0, fuselage_hooks_1.useAutoFocus)(true);
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const handleSearchTextChange = (0, react_1.useCallback)((event) => {
        setSearchText(event.currentTarget.value);
    }, [setSearchText]);
    const typeOptions = (0, react_1.useMemo)(() => [
        ['all', t('All')],
        ['following', t('Following')],
        ['unread', t('Unread')],
    ], [t]);
    const [type, setType] = (0, fuselage_hooks_1.useLocalStorage)('thread-list-type', 'all');
    const handleTypeChange = (0, react_1.useCallback)((type) => {
        const typeOption = typeOptions.find(([t]) => t === type);
        if (typeOption)
            setType(typeOption[0]);
    }, [setType, typeOptions]);
    const room = (0, RoomContext_1.useRoom)();
    const rid = room._id;
    const subscription = (0, RoomContext_1.useRoomSubscription)();
    const subscribed = !!subscription;
    const uid = (0, ui_contexts_1.useUserId)();
    const tunread = (_a = subscription === null || subscription === void 0 ? void 0 : subscription.tunread) === null || _a === void 0 ? void 0 : _a.sort().join(',');
    const text = (0, fuselage_hooks_1.useDebouncedValue)(searchText, 400);
    const options = (0, fuselage_hooks_1.useDebouncedValue)((0, react_1.useMemo)(() => {
        if (type === 'all' || !subscribed || !uid) {
            return {
                rid,
                text,
            };
        }
        switch (type) {
            case 'following':
                return {
                    rid,
                    text,
                    type,
                    uid,
                };
            case 'unread':
                return {
                    rid,
                    text,
                    type,
                    tunread: tunread === null || tunread === void 0 ? void 0 : tunread.split(','),
                };
        }
    }, [rid, subscribed, text, tunread, type, uid]), 300);
    const { threadsList, loadMoreItems } = (0, useThreadsList_1.useThreadsList)(options, uid);
    const { phase, error, items, itemCount } = (0, useRecordList_1.useRecordList)(threadsList);
    const goToThread = (0, useGoToThread_1.useGoToThread)({ replace: true });
    const handleThreadClick = (0, react_1.useCallback)((tmid) => {
        goToThread({ rid, tmid });
    }, [rid, goToThread]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'thread' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Threads') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: handleTabBarCloseButtonClick })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarSection, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { placeholder: t('Search_Messages'), addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x20' }), ref: autoFocusRef, value: searchText, onChange: handleSearchTextChange }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: 'x144', mis: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { options: typeOptions, value: type, onChange: (value) => handleTypeChange(String(value)) }) })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarContent, { paddingInline: 0, children: [phase === asyncState_1.AsyncStatePhase.LOADING && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pi: 24, pb: 12, children: (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { size: 'x12' }) })), error && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { mi: 24, type: 'danger', children: error.toString() })), phase !== asyncState_1.AsyncStatePhase.LOADING && itemCount === 0 && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarEmptyContent, { title: t('No_Threads') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 1, flexShrink: 1, overflow: 'hidden', display: 'flex', ref: ref, children: !error && itemCount > 0 && items.length > 0 && ((0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { style: {
                                height: blockSize,
                                width: inlineSize,
                            }, totalCount: itemCount, endReached: phase === asyncState_1.AsyncStatePhase.LOADING
                                ? () => undefined
                                : (start) => {
                                    loadMoreItems(start, Math.min(50, itemCount - start));
                                }, overscan: 25, data: items, components: { Scroller: CustomScrollbars_1.VirtuosoScrollbars }, itemContent: (_index, data) => {
                                var _a, _b, _c;
                                return ((0, jsx_runtime_1.jsx)(ThreadListItem_1.default, { thread: data, unread: (_a = subscription === null || subscription === void 0 ? void 0 : subscription.tunread) !== null && _a !== void 0 ? _a : [], unreadUser: (_b = subscription === null || subscription === void 0 ? void 0 : subscription.tunreadUser) !== null && _b !== void 0 ? _b : [], unreadGroup: (_c = subscription === null || subscription === void 0 ? void 0 : subscription.tunreadGroup) !== null && _c !== void 0 ? _c : [], onClick: handleThreadClick }));
                            } })) })] })] }));
};
exports.default = ThreadList;
