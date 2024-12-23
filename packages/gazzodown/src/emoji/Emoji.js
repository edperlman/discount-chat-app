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
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const MarkupInteractionContext_1 = require("../MarkupInteractionContext");
const EmojiRenderer_1 = __importDefault(require("./EmojiRenderer"));
const PlainSpan_1 = __importDefault(require("../elements/PlainSpan"));
const Emoji = (_a) => {
    var { big = false, preview = false } = _a, emoji = __rest(_a, ["big", "preview"]);
    const { convertAsciiToEmoji, useEmoji } = (0, react_1.useContext)(MarkupInteractionContext_1.MarkupInteractionContext);
    const asciiEmoji = (0, react_1.useMemo)(() => ('shortCode' in emoji && emoji.value.value !== emoji.shortCode ? emoji.value.value : undefined), [emoji]);
    if (!useEmoji && 'shortCode' in emoji) {
        return (0, jsx_runtime_1.jsx)(PlainSpan_1.default, { text: emoji.shortCode === emoji.value.value ? `:${emoji.shortCode}:` : emoji.value.value });
    }
    if (!convertAsciiToEmoji && asciiEmoji) {
        return (0, jsx_runtime_1.jsx)(PlainSpan_1.default, { text: asciiEmoji });
    }
    return (0, jsx_runtime_1.jsx)(EmojiRenderer_1.default, Object.assign({ big: big, preview: preview }, emoji));
};
exports.default = (0, react_1.memo)(Emoji);
