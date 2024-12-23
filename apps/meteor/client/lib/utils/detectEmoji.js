"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectEmoji = void 0;
const client_1 = require("../../../app/emoji/client");
const detectEmoji = (text) => {
    const html = Object.values(client_1.emoji.packages)
        .reverse()
        .reduce((html, { render }) => render(html), text);
    const div = document.createElement('div');
    div.innerHTML = html;
    return Array.from(div.querySelectorAll('span')).map((span) => ({
        name: span.title,
        className: span.className,
        image: span.style.backgroundImage || undefined,
        content: span.innerText,
    }));
};
exports.detectEmoji = detectEmoji;
