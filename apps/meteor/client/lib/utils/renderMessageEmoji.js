"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMessageEmoji = void 0;
const emojiParser_1 = require("../../../app/emoji/client/emojiParser");
const renderMessageEmoji = (html) => (0, emojiParser_1.emojiParser)(html);
exports.renderMessageEmoji = renderMessageEmoji;
