"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const Emoji_1 = __importDefault(require("../../../components/Emoji"));
function ComposerBoxPopupEmoji({ _id }) {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.OptionColumn, { children: (0, jsx_runtime_1.jsx)(Emoji_1.default, { emojiHandle: _id }) }), (0, jsx_runtime_1.jsx)(fuselage_1.OptionContent, { children: _id })] }));
}
exports.default = ComposerBoxPopupEmoji;
