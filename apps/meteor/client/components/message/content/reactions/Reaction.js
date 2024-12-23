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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const ReactionTooltip_1 = __importDefault(require("./ReactionTooltip"));
const renderEmoji_1 = require("../../../../lib/utils/renderEmoji");
const MessageListContext_1 = require("../../list/MessageListContext");
const Reaction = (_a) => {
    var { hasReacted, counter, name, names, messageId } = _a, props = __rest(_a, ["hasReacted", "counter", "name", "names", "messageId"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const ref = (0, react_1.useRef)(null);
    const openTooltip = (0, ui_contexts_1.useTooltipOpen)();
    const closeTooltip = (0, ui_contexts_1.useTooltipClose)();
    const { showRealName, username } = (0, react_1.useContext)(MessageListContext_1.MessageListContext);
    const mine = hasReacted(name);
    const emojiProps = (0, renderEmoji_1.getEmojiClassNameAndDataTitle)(name);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.MessageReaction, Object.assign({ ref: ref, mine: mine, "aria-label": t('React_with__reaction__', { reaction: name }), "data-tooltip": '', onMouseEnter: (e) => __awaiter(void 0, void 0, void 0, function* () {
            e.stopPropagation();
            e.preventDefault();
            ref.current &&
                openTooltip((0, jsx_runtime_1.jsx)(ReactionTooltip_1.default, { emojiName: name, usernames: names, mine: mine, messageId: messageId, showRealName: showRealName, username: username }), ref.current);
        }), onMouseLeave: () => {
            closeTooltip();
        } }, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.MessageReactionEmoji, Object.assign({}, emojiProps)), (0, jsx_runtime_1.jsx)(fuselage_1.MessageReactionCounter, { counter: counter })] }), name));
};
exports.default = Reaction;
