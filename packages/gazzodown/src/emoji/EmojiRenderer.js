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
const fuselage_1 = require("@rocket.chat/fuselage");
const dompurify_1 = __importDefault(require("dompurify"));
const react_1 = require("react");
const MarkupInteractionContext_1 = require("../MarkupInteractionContext");
const EmojiRenderer = (_a) => {
    var _b;
    var { big = false, preview = false } = _a, emoji = __rest(_a, ["big", "preview"]);
    const { detectEmoji } = (0, react_1.useContext)(MarkupInteractionContext_1.MarkupInteractionContext);
    const fallback = (0, react_1.useMemo)(() => { var _a; return ('unicode' in emoji ? emoji.unicode : `:${(_a = emoji.shortCode) !== null && _a !== void 0 ? _a : emoji.value.value}:`); }, [emoji]);
    const sanitizedFallback = dompurify_1.default.sanitize(fallback);
    const descriptors = (0, react_1.useMemo)(() => {
        const detected = detectEmoji === null || detectEmoji === void 0 ? void 0 : detectEmoji(sanitizedFallback);
        return (detected === null || detected === void 0 ? void 0 : detected.length) !== 0 ? detected : undefined;
    }, [detectEmoji, sanitizedFallback]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (_b = descriptors === null || descriptors === void 0 ? void 0 : descriptors.map(({ name, className, image, content }, i) => ((0, jsx_runtime_1.jsx)("span", { title: name, children: preview ? ((0, jsx_runtime_1.jsx)(fuselage_1.ThreadMessageEmoji, { className: className, name: name, image: image, children: content })) : ((0, jsx_runtime_1.jsx)(fuselage_1.MessageEmoji, { big: big, className: className, name: name, image: image, children: content })) }, i)))) !== null && _b !== void 0 ? _b : ((0, jsx_runtime_1.jsx)("span", { role: 'img', "aria-label": sanitizedFallback.charAt(0) === ':' ? sanitizedFallback : undefined, children: sanitizedFallback })) }));
};
exports.default = (0, react_1.memo)(EmojiRenderer);
