"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUrl = void 0;
const message_parser_1 = require("@rocket.chat/message-parser");
const normalizeUrl = (url) => {
    if (url.startsWith('http')) {
        return url;
    }
    if (url.startsWith('//')) {
        return `https:${url}`;
    }
    const parsedUrl = (0, message_parser_1.parse)(url);
    if (parsedUrl[0].type === 'PARAGRAPH') {
        if (parsedUrl[0].value[0].type === 'LINK') {
            if (parsedUrl[0].value[0].value.src.value.startsWith('//')) {
                return `https:${parsedUrl[0].value[0].value.src.value}`;
            }
            return parsedUrl[0].value[0].value.src.value;
        }
    }
    return undefined;
};
exports.normalizeUrl = normalizeUrl;
