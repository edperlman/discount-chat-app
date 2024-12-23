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
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importStar(require("react"));
const ThreadListMetrics_1 = __importDefault(require("./ThreadListMetrics"));
const Emoji_1 = __importDefault(require("../../../../../components/Emoji"));
const ThreadMetricsFollow_1 = __importDefault(require("../../../../../components/message/content/ThreadMetricsFollow"));
const ThreadMetricsUnreadBadge_1 = __importDefault(require("../../../../../components/message/content/ThreadMetricsUnreadBadge"));
const useTimeAgo_1 = require("../../../../../hooks/useTimeAgo");
const ThreadListMessage = (_a) => {
    var { _id, msg, following, username, name = username, ts, replies, participants, unread, rid, mention, all, tlm, className = [], emoji } = _a, props = __rest(_a, ["_id", "msg", "following", "username", "name", "ts", "replies", "participants", "unread", "rid", "mention", "all", "tlm", "className", "emoji"]);
    const formatDate = (0, useTimeAgo_1.useTimeAgo)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: className, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({ pbs: 16, is: fuselage_1.Message }, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Message.LeftContainer, { children: (0, jsx_runtime_1.jsx)(ui_avatar_1.MessageAvatar, { emoji: emoji ? (0, jsx_runtime_1.jsx)(Emoji_1.default, { emojiHandle: emoji, fillContainer: true }) : undefined, username: username, size: 'x36' }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Message.Container, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Message.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Message.Name, { title: username, children: name }), (0, jsx_runtime_1.jsx)(fuselage_1.Message.Timestamp, { children: formatDate(ts) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Message.Body, { clamp: 2, children: msg }), (0, jsx_runtime_1.jsx)(ThreadListMetrics_1.default, { lm: tlm, participants: participants || [], counter: replies })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Message.ContainerFixed, { children: [(0, jsx_runtime_1.jsx)(ThreadMetricsFollow_1.default, { following: following, mid: _id, rid: rid, mention: false, unread: false, all: false }), unread && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 24, children: (0, jsx_runtime_1.jsx)(ThreadMetricsUnreadBadge_1.default, { unread: unread, mention: mention, all: all }) }))] })] })) }));
};
exports.default = (0, react_1.memo)(ThreadListMessage);
