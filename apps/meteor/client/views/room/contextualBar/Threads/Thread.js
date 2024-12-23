"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const ThreadChat_1 = __importDefault(require("./components/ThreadChat"));
const ThreadSkeleton_1 = __importDefault(require("./components/ThreadSkeleton"));
const ThreadTitle_1 = __importDefault(require("./components/ThreadTitle"));
const useThreadMainMessageQuery_1 = require("./hooks/useThreadMainMessageQuery");
const useToggleFollowingThreadMutation_1 = require("./hooks/useToggleFollowingThreadMutation");
const Contextualbar_1 = require("../../../../components/Contextualbar");
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const useGoToThreadList_1 = require("../../hooks/useGoToThreadList");
const ChatProvider_1 = __importDefault(require("../../providers/ChatProvider"));
const Thread = ({ tmid }) => {
    var _a, _b, _c;
    const goToThreadList = (0, useGoToThreadList_1.useGoToThreadList)({ replace: true });
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const mainMessageQueryResult = (0, useThreadMainMessageQuery_1.useThreadMainMessageQuery)(tmid, {
        onDelete: () => {
            closeTab();
        },
    });
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const canExpand = (0, ui_contexts_1.useLayoutContextualBarExpanded)();
    const [expanded, setExpanded] = (0, fuselage_hooks_1.useLocalStorage)('expand-threads', false);
    const uid = (0, ui_contexts_1.useUserId)();
    const following = uid ? ((_c = (_b = (_a = mainMessageQueryResult.data) === null || _a === void 0 ? void 0 : _a.replies) === null || _b === void 0 ? void 0 : _b.includes(uid)) !== null && _c !== void 0 ? _c : false) : false;
    const toggleFollowingMutation = (0, useToggleFollowingThreadMutation_1.useToggleFollowingThreadMutation)({
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    const handleBackdropClick = () => {
        closeTab();
    };
    const handleGoBack = () => {
        goToThreadList();
    };
    const handleToggleExpand = () => {
        setExpanded((expanded) => !expanded);
    };
    const handleToggleFollowing = () => {
        var _a;
        const rid = (_a = mainMessageQueryResult.data) === null || _a === void 0 ? void 0 : _a.rid;
        if (!rid) {
            return;
        }
        toggleFollowingMutation.mutate({ rid, tmid, follow: !following });
    };
    const handleClose = () => {
        closeTab();
    };
    return ((0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarInnerContent, { children: [canExpand && expanded && (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Backdrop, { onClick: handleBackdropClick }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 1, position: expanded ? 'static' : 'relative', children: (0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { "rcx-thread-view": true, className: canExpand && expanded
                        ? (0, css_in_js_1.css) `
									max-width: 855px !important;
									@media (min-width: 780px) and (max-width: 1135px) {
										max-width: calc(100% - var(--sidebar-width)) !important;
									}
								`
                        : undefined, position: expanded ? 'fixed' : 'absolute', display: 'flex', flexDirection: 'column', width: 'full', overflow: 'hidden', zIndex: 100, insetBlock: 0, border: 'none', children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { expanded: expanded, children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarBack, { onClick: handleGoBack }), (mainMessageQueryResult.isLoading && (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' })) ||
                                    (mainMessageQueryResult.isSuccess && (0, jsx_runtime_1.jsx)(ThreadTitle_1.default, { mainMessage: mainMessageQueryResult.data })) ||
                                    null, (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarActions, { children: [canExpand && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarAction, { name: expanded ? 'arrow-collapse' : 'arrow-expand', title: expanded ? t('Collapse') : t('Expand'), onClick: handleToggleExpand })), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarAction, { name: following ? 'bell' : 'bell-off', title: following ? t('Following') : t('Not_Following'), disabled: !mainMessageQueryResult.isSuccess || toggleFollowingMutation.isLoading, onClick: handleToggleFollowing }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: handleClose })] })] }), (mainMessageQueryResult.isLoading && (0, jsx_runtime_1.jsx)(ThreadSkeleton_1.default, {})) ||
                            (mainMessageQueryResult.isSuccess && ((0, jsx_runtime_1.jsx)(ChatProvider_1.default, { tmid: tmid, children: (0, jsx_runtime_1.jsx)(ThreadChat_1.default, { mainMessage: mainMessageQueryResult.data }) }))) ||
                            null] }) })] }));
};
exports.default = Thread;
