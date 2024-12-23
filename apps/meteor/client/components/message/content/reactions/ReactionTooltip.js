"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useGetMessageByID_1 = require("../../../../views/room/contextualBar/Threads/hooks/useGetMessageByID");
const MarkdownText_1 = __importDefault(require("../../../MarkdownText"));
const getTranslationKey = (users, mine) => {
    if (users.length === 0) {
        if (mine) {
            return 'You_reacted_with';
        }
    }
    if (users.length > 10) {
        if (mine) {
            return 'You_users_and_more_Reacted_with';
        }
        return 'Users_and_more_reacted_with';
    }
    if (mine) {
        return 'You_and_users_Reacted_with';
    }
    return 'Users_reacted_with';
};
const ReactionTooltip = ({ emojiName, usernames, mine, messageId, showRealName, username }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const key = getTranslationKey(usernames, mine);
    const getMessage = (0, useGetMessageByID_1.useGetMessageByID)();
    const { data: users, isLoading } = (0, react_query_1.useQuery)(['chat.getMessage', 'reactions', messageId, usernames], () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // This happens if the only reaction is from the current user
        if (!usernames.length) {
            return [];
        }
        if (!showRealName) {
            return usernames;
        }
        const data = yield getMessage(messageId);
        const { reactions } = data;
        if (!reactions) {
            return [];
        }
        if (username) {
            const index = reactions[emojiName].usernames.indexOf(username);
            index >= 0 && ((_a = reactions[emojiName].names) === null || _a === void 0 ? void 0 : _a.splice(index, 1));
            return (reactions[emojiName].names || usernames).filter(Boolean);
        }
        return reactions[emojiName].names || usernames;
    }), { staleTime: 1000 * 60 * 5 });
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: 'x200', variant: 'text', backgroundColor: 'surface-light' }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: 'x200', variant: 'text', backgroundColor: 'surface-light' }), usernames.length > 5 && (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: 'x200', variant: 'text', backgroundColor: 'surface-light' }), usernames.length > 8 && (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: 'x200', variant: 'text', backgroundColor: 'surface-light' })] }));
    }
    return ((0, jsx_runtime_1.jsx)(MarkdownText_1.default, { content: t(key, {
            counter: usernames.length > 10 ? usernames.length - 10 : usernames.length,
            users: (users === null || users === void 0 ? void 0 : users.slice(0, 10).join(', ')) || '',
            emoji: emojiName,
        }), variant: 'inline' }));
};
exports.default = ReactionTooltip;
