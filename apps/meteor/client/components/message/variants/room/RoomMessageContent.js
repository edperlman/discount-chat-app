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
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const useUserData_1 = require("../../../../hooks/useUserData");
const ChatContext_1 = require("../../../../views/room/contexts/ChatContext");
const MessageContentBody_1 = __importDefault(require("../../MessageContentBody"));
const ReadReceiptIndicator_1 = __importDefault(require("../../ReadReceiptIndicator"));
const Attachments_1 = __importDefault(require("../../content/Attachments"));
const BroadcastMetrics_1 = __importDefault(require("../../content/BroadcastMetrics"));
const DiscussionMetrics_1 = __importDefault(require("../../content/DiscussionMetrics"));
const Location_1 = __importDefault(require("../../content/Location"));
const MessageActions_1 = __importDefault(require("../../content/MessageActions"));
const Reactions_1 = __importDefault(require("../../content/Reactions"));
const ThreadMetrics_1 = __importDefault(require("../../content/ThreadMetrics"));
const UrlPreviews_1 = __importDefault(require("../../content/UrlPreviews"));
const useNormalizedMessage_1 = require("../../hooks/useNormalizedMessage");
const useOembedLayout_1 = require("../../hooks/useOembedLayout");
const useSubscriptionFromMessageQuery_1 = require("../../hooks/useSubscriptionFromMessageQuery");
const UiKitMessageBlock_1 = __importDefault(require("../../uikit/UiKitMessageBlock"));
const RoomMessageContent = ({ message, unread, all, mention, searchText }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const encrypted = (0, core_typings_1.isE2EEMessage)(message);
    const { enabled: oembedEnabled } = (0, useOembedLayout_1.useOembedLayout)();
    const subscription = (_a = (0, useSubscriptionFromMessageQuery_1.useSubscriptionFromMessageQuery)(message).data) !== null && _a !== void 0 ? _a : undefined;
    const broadcast = (_b = subscription === null || subscription === void 0 ? void 0 : subscription.broadcast) !== null && _b !== void 0 ? _b : false;
    const uid = (0, ui_contexts_1.useUserId)();
    const messageUser = Object.assign(Object.assign(Object.assign({}, message.u), { roles: [] }), (0, useUserData_1.useUserData)(message.u._id));
    const readReceiptEnabled = (0, ui_contexts_1.useSetting)('Message_Read_Receipt_Enabled', false);
    const chat = (0, ChatContext_1.useChat)();
    const t = (0, ui_contexts_1.useTranslation)();
    const normalizedMessage = (0, useNormalizedMessage_1.useNormalizedMessage)(message);
    const isMessageEncrypted = encrypted && (normalizedMessage === null || normalizedMessage === void 0 ? void 0 : normalizedMessage.e2e) === 'pending';
    const quotes = ((_c = normalizedMessage === null || normalizedMessage === void 0 ? void 0 : normalizedMessage.attachments) === null || _c === void 0 ? void 0 : _c.filter(core_typings_1.isQuoteAttachment)) || [];
    const attachments = ((_d = normalizedMessage === null || normalizedMessage === void 0 ? void 0 : normalizedMessage.attachments) === null || _d === void 0 ? void 0 : _d.filter((attachment) => !(0, core_typings_1.isQuoteAttachment)(attachment))) || [];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isMessageEncrypted && (0, jsx_runtime_1.jsx)(fuselage_1.MessageBody, { children: t('E2E_message_encrypted_placeholder') }), !!(quotes === null || quotes === void 0 ? void 0 : quotes.length) && (0, jsx_runtime_1.jsx)(Attachments_1.default, { attachments: quotes }), !((_e = normalizedMessage.blocks) === null || _e === void 0 ? void 0 : _e.length) && !!((_f = normalizedMessage.md) === null || _f === void 0 ? void 0 : _f.length) && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (!encrypted || normalizedMessage.e2e === 'done') && ((0, jsx_runtime_1.jsx)(MessageContentBody_1.default, { id: `${normalizedMessage._id}-content`, md: normalizedMessage.md, mentions: normalizedMessage.mentions, channels: normalizedMessage.channels, searchText: searchText })) })), !!attachments && (0, jsx_runtime_1.jsx)(Attachments_1.default, { id: (_h = (_g = message.files) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h._id, attachments: attachments }), normalizedMessage.blocks && ((0, jsx_runtime_1.jsx)(UiKitMessageBlock_1.default, { rid: normalizedMessage.rid, mid: normalizedMessage._id, blocks: normalizedMessage.blocks })), oembedEnabled && !!((_j = normalizedMessage.urls) === null || _j === void 0 ? void 0 : _j.length) && (0, jsx_runtime_1.jsx)(UrlPreviews_1.default, { urls: normalizedMessage.urls }), ((_k = normalizedMessage.actionLinks) === null || _k === void 0 ? void 0 : _k.length) && ((0, jsx_runtime_1.jsx)(MessageActions_1.default, { message: normalizedMessage, actions: normalizedMessage.actionLinks.map((_a) => {
                    var { method_id: methodId, i18nLabel } = _a, action = __rest(_a, ["method_id", "i18nLabel"]);
                    return (Object.assign({ methodId, i18nLabel: i18nLabel }, action));
                }) })), normalizedMessage.reactions && Object.keys(normalizedMessage.reactions).length && (0, jsx_runtime_1.jsx)(Reactions_1.default, { message: normalizedMessage }), chat && (0, core_typings_1.isThreadMainMessage)(normalizedMessage) && ((0, jsx_runtime_1.jsx)(ThreadMetrics_1.default, { counter: normalizedMessage.tcount, following: Boolean(uid && ((_l = normalizedMessage === null || normalizedMessage === void 0 ? void 0 : normalizedMessage.replies) === null || _l === void 0 ? void 0 : _l.indexOf(uid)) > -1), mid: normalizedMessage._id, rid: normalizedMessage.rid, lm: normalizedMessage.tlm, unread: unread, mention: mention, all: all, participants: normalizedMessage === null || normalizedMessage === void 0 ? void 0 : normalizedMessage.replies })), (0, core_typings_1.isDiscussionMessage)(normalizedMessage) && ((0, jsx_runtime_1.jsx)(DiscussionMetrics_1.default, { count: normalizedMessage.dcount, drid: normalizedMessage.drid, lm: normalizedMessage.dlm, rid: normalizedMessage.rid })), normalizedMessage.location && (0, jsx_runtime_1.jsx)(Location_1.default, { location: normalizedMessage.location }), broadcast && !!messageUser.username && normalizedMessage.u._id !== uid && ((0, jsx_runtime_1.jsx)(BroadcastMetrics_1.default, { username: messageUser.username, message: normalizedMessage })), readReceiptEnabled && (0, jsx_runtime_1.jsx)(ReadReceiptIndicator_1.default, { mid: normalizedMessage._id, unread: normalizedMessage.unread })] }));
};
exports.default = (0, react_1.memo)(RoomMessageContent);
