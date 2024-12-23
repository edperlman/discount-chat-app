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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypingIndicator = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const compat_1 = require("preact/compat");
const MessageAvatars_1 = require("../MessageAvatars");
const MessageBubble_1 = require("../MessageBubble");
const MessageContainer_1 = require("../MessageContainer");
const MessageContent_1 = require("../MessageContent");
const TypingDots_1 = require("../TypingDots");
exports.TypingIndicator = (0, compat_1.memo)((_a) => {
    var { avatarResolver, usernames = [], text } = _a, containerProps = __rest(_a, ["avatarResolver", "usernames", "text"]);
    return ((0, jsx_runtime_1.jsxs)(MessageContainer_1.MessageContainer, Object.assign({}, containerProps, { children: [(0, jsx_runtime_1.jsx)(MessageAvatars_1.MessageAvatars, { avatarResolver: avatarResolver, usernames: usernames }), (0, jsx_runtime_1.jsx)(MessageContent_1.MessageContent, { children: (0, jsx_runtime_1.jsx)(MessageBubble_1.MessageBubble, { children: (0, jsx_runtime_1.jsx)(TypingDots_1.TypingDots, { text: text }) }) })] })));
});
