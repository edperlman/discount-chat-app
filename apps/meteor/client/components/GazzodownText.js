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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const gazzodown_1 = require("@rocket.chat/gazzodown");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const detectEmoji_1 = require("../lib/utils/detectEmoji");
const fireGlobalEvent_1 = require("../lib/utils/fireGlobalEvent");
const MessageListContext_1 = require("./message/list/MessageListContext");
const UserCardContext_1 = require("../views/room/contexts/UserCardContext");
const useGoToRoom_1 = require("../views/room/hooks/useGoToRoom");
const GazzodownText = ({ mentions, channels, searchText, children }) => {
    const enableTimestamp = (0, ui_client_1.useFeaturePreview)('enable-timestamp-message-parser');
    const [userLanguage] = (0, fuselage_hooks_1.useLocalStorage)('userLanguage', 'en');
    const highlights = (0, MessageListContext_1.useMessageListHighlights)();
    const { triggerProps, openUserCard } = (0, UserCardContext_1.useUserCard)();
    const highlightRegex = (0, react_1.useMemo)(() => {
        if (!(highlights === null || highlights === void 0 ? void 0 : highlights.length)) {
            return;
        }
        const alternatives = highlights.map(({ highlight }) => (0, string_helpers_1.escapeRegExp)(highlight)).join('|');
        const expression = `(?=^|\\b|[\\s\\n\\r\\t.,،'\\\"\\+!?:-])(${alternatives})(?=$|\\b|[\\s\\n\\r\\t.,،'\\\"\\+!?:-])`;
        return () => new RegExp(expression, 'gmi');
    }, [highlights]);
    const markRegex = (0, react_1.useMemo)(() => {
        if (!searchText) {
            return;
        }
        return () => new RegExp(`(${searchText})(?![^<]*>)`, 'gi');
    }, [searchText]);
    const convertAsciiToEmoji = (0, ui_contexts_1.useUserPreference)('convertAsciiEmoji', true);
    const useEmoji = Boolean((0, ui_contexts_1.useUserPreference)('useEmojis'));
    const useRealName = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name', false);
    const ownUserId = (0, ui_contexts_1.useUserId)();
    const showMentionSymbol = Boolean((0, ui_contexts_1.useUserPreference)('mentionsWithSymbol'));
    const resolveUserMention = (0, react_1.useCallback)((mention) => {
        if (mention === 'all' || mention === 'here') {
            return undefined;
        }
        const filterUser = ({ username, type }) => (!type || type === 'user') && username === mention;
        const filterTeam = ({ name, type }) => type === 'team' && name === mention;
        return mentions === null || mentions === void 0 ? void 0 : mentions.find((mention) => filterUser(mention) || filterTeam(mention));
    }, [mentions]);
    const onUserMentionClick = (0, react_1.useCallback)(({ username }) => {
        if (!username) {
            return;
        }
        return (event) => {
            event.stopPropagation();
            openUserCard(event, username);
        };
    }, [openUserCard]);
    const goToRoom = (0, useGoToRoom_1.useGoToRoom)();
    const { isEmbedded, isMobile } = (0, ui_contexts_1.useLayout)();
    const resolveChannelMention = (0, react_1.useCallback)((mention) => channels === null || channels === void 0 ? void 0 : channels.find(({ name }) => name === mention), [channels]);
    const router = (0, ui_contexts_1.useRouter)();
    const onChannelMentionClick = (0, react_1.useCallback)(({ _id: rid }) => (event) => {
        if (isEmbedded) {
            (0, fireGlobalEvent_1.fireGlobalEvent)('click-mention-link', {
                path: router.buildRoutePath({
                    pattern: '/channel/:name/:tab?/:context?',
                    params: { name: rid },
                }),
                channel: rid,
            });
        }
        event.stopPropagation();
        goToRoom(rid);
    }, [router, isEmbedded, goToRoom]);
    return ((0, jsx_runtime_1.jsx)(gazzodown_1.MarkupInteractionContext.Provider, { value: {
            detectEmoji: detectEmoji_1.detectEmoji,
            highlightRegex,
            markRegex,
            resolveUserMention,
            onUserMentionClick,
            resolveChannelMention,
            onChannelMentionClick,
            convertAsciiToEmoji,
            useEmoji,
            useRealName,
            isMobile,
            ownUserId,
            showMentionSymbol,
            triggerProps,
            enableTimestamp,
            language: userLanguage,
        }, children: children }));
};
exports.default = (0, react_1.memo)(GazzodownText);
