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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const toolbar_1 = require("@react-aria/toolbar");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const MessageListContext_1 = require("../list/MessageListContext");
const Reaction_1 = __importDefault(require("./reactions/Reaction"));
const useToggleReactionMutation_1 = require("./reactions/useToggleReactionMutation");
const Reactions = (_a) => {
    var { message } = _a, props = __rest(_a, ["message"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const ref = (0, react_1.useRef)(null);
    const hasReacted = (0, MessageListContext_1.useUserHasReacted)(message);
    const openEmojiPicker = (0, MessageListContext_1.useOpenEmojiPicker)(message);
    const { username } = (0, react_1.useContext)(MessageListContext_1.MessageListContext);
    const toggleReactionMutation = (0, useToggleReactionMutation_1.useToggleReactionMutation)();
    const { toolbarProps } = (0, toolbar_1.useToolbar)(props, ref);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.MessageReactions, Object.assign({ ref: ref }, toolbarProps, props, { children: [message.reactions &&
                Object.entries(message.reactions).map(([name, reactions]) => ((0, jsx_runtime_1.jsx)(Reaction_1.default, { counter: reactions.usernames.length, hasReacted: hasReacted, name: name, names: reactions.usernames.filter((user) => user !== username).map((username) => `@${username}`), messageId: message._id, onKeyDown: (e) => (e.code === 'Space' || e.code === 'Enter') && toggleReactionMutation.mutate({ mid: message._id, reaction: name }), onClick: () => toggleReactionMutation.mutate({ mid: message._id, reaction: name }) }, name))), (0, jsx_runtime_1.jsx)(fuselage_1.MessageReactionAction, { title: t('Add_Reaction'), onKeyDown: (e) => (e.code === 'Space' || e.code === 'Enter') && openEmojiPicker(e), onClick: openEmojiPicker })] })));
};
exports.default = Reactions;
