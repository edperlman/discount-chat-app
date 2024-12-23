"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emojiParser = void 0;
const lib_1 = require("./lib");
const isIE11_1 = require("../../../client/lib/utils/isIE11");
/**
 * emojiParser is a function that will replace emojis
 */
const emojiParser = (html) => {
    html = html.trim();
    // &#39; to apostrophe (') for emojis such as :')
    html = html.replace(/&#39;/g, "'");
    // '<br>' to ' <br> ' for emojis such at line breaks
    html = html.replace(/<br>/g, ' <br> ');
    html = Object.entries(lib_1.emoji.packages)
        .reverse()
        .reduce((value, [, emojiPackage]) => emojiPackage.render(value), html);
    const checkEmojiOnly = document.createElement('div');
    checkEmojiOnly.innerHTML = html;
    const emojis = Array.from(checkEmojiOnly.querySelectorAll('.emoji:not(:empty), .emojione:not(:empty)'));
    let hasText = false;
    if (!isIE11_1.isIE11) {
        const isElement = (node) => node.nodeType === Node.ELEMENT_NODE;
        const isTextNode = (node) => node.nodeType === Node.TEXT_NODE;
        const filter = (node) => {
            if (isElement(node) && (node.classList.contains('emojione') || node.classList.contains('emoji'))) {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        };
        const walker = document.createTreeWalker(checkEmojiOnly, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, filter);
        while (walker.nextNode()) {
            if (isTextNode(walker.currentNode) && walker.currentNode.nodeValue.trim() !== '') {
                hasText = true;
                break;
            }
        }
        const emojiOnly = emojis.length && !hasText;
        if (emojiOnly) {
            for (let i = 0, len = emojis.length; i < len; i++) {
                const { classList } = emojis[i];
                classList.add('big');
            }
            html = checkEmojiOnly.innerHTML;
        }
    }
    // apostrophe (') back to &#39;
    html = html.replace(/\'/g, '&#39;');
    // line breaks ' <br> ' back to '<br>'
    html = html.replace(/ <br> /g, '<br>');
    return html;
};
exports.emojiParser = emojiParser;
