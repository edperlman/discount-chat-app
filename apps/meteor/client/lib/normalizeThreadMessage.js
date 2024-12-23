"use strict";
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
exports.normalizeThreadMessage = normalizeThreadMessage;
const jsx_runtime_1 = require("react/jsx-runtime");
const gazzodown_1 = require("@rocket.chat/gazzodown");
const message_parser_1 = require("@rocket.chat/message-parser");
const react_1 = __importDefault(require("react"));
const markdown_1 = require("../../app/markdown/lib/markdown");
const GazzodownText_1 = __importDefault(require("../components/GazzodownText"));
function normalizeThreadMessage(_a) {
    var message = __rest(_a, []);
    if (message.msg) {
        message.msg = (0, markdown_1.filterMarkdown)(message.msg);
        delete message.mentions;
        const tokens = message.msg ? (0, message_parser_1.parse)(message.msg, { emoticons: true }) : undefined;
        if (!tokens) {
            return null;
        }
        return ((0, jsx_runtime_1.jsx)(GazzodownText_1.default, { children: (0, jsx_runtime_1.jsx)(gazzodown_1.Markup, { tokens: tokens }) }));
    }
    if (message.attachments) {
        const attachment = message.attachments.find((attachment) => attachment.title || attachment.description);
        if (attachment === null || attachment === void 0 ? void 0 : attachment.description) {
            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: attachment.description });
        }
        if (attachment === null || attachment === void 0 ? void 0 : attachment.title) {
            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: attachment.title });
        }
    }
    return null;
}
