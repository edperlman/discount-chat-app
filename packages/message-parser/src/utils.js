"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFirstResult = exports.timestamp = exports.phoneChecker = exports.inlineKatex = exports.katex = exports.lineBreak = exports.reducePlainTexts = exports.emoticon = exports.emojiUnicode = exports.emoji = exports.mentionUser = exports.listItem = exports.unorderedList = exports.orderedList = exports.mentionChannel = exports.quote = exports.image = exports.autoEmail = exports.autoLink = exports.link = exports.codeLine = exports.strike = exports.plain = exports.italic = exports.tasks = exports.inlineCode = exports.task = exports.bigEmoji = exports.code = exports.heading = exports.color = exports.bold = exports.paragraph = void 0;
const tldts_1 = require("tldts");
const generate = (type) => (value) => ({ type, value });
exports.paragraph = generate('PARAGRAPH');
exports.bold = generate('BOLD');
const color = (r, g, b, a = 255) => ({
    type: 'COLOR',
    value: { r, g, b, a },
});
exports.color = color;
const heading = (value, level = 1) => ({
    type: 'HEADING',
    level,
    value,
});
exports.heading = heading;
const code = (value, language) => ({
    type: 'CODE',
    language: language || 'none',
    value,
});
exports.code = code;
const bigEmoji = (value) => ({
    type: 'BIG_EMOJI',
    value,
});
exports.bigEmoji = bigEmoji;
const task = (value, status) => ({
    type: 'TASK',
    status,
    value,
});
exports.task = task;
exports.inlineCode = generate('INLINE_CODE');
exports.tasks = generate('TASKS');
exports.italic = generate('ITALIC');
exports.plain = generate('PLAIN_TEXT');
exports.strike = generate('STRIKE');
exports.codeLine = generate('CODE_LINE');
const isValidLink = (link) => {
    try {
        return Boolean(new URL(link));
    }
    catch (error) {
        return false;
    }
};
const link = (src, label) => ({
    type: 'LINK',
    value: { src: (0, exports.plain)(src), label: label !== null && label !== void 0 ? label : [(0, exports.plain)(src)] },
});
exports.link = link;
const autoLink = (src, customDomains) => {
    const validHosts = ['localhost', ...(customDomains !== null && customDomains !== void 0 ? customDomains : [])];
    const { isIcann, isIp, isPrivate, domain } = (0, tldts_1.parse)(src, {
        detectIp: false,
        allowPrivateDomains: true,
        validHosts,
    });
    if (!(isIcann || isIp || isPrivate || (domain && validHosts.includes(domain)))) {
        return (0, exports.plain)(src);
    }
    const href = isValidLink(src) || src.startsWith('//') ? src : `//${src}`;
    return (0, exports.link)(href, [(0, exports.plain)(src)]);
};
exports.autoLink = autoLink;
const autoEmail = (src) => {
    const href = `mailto:${src}`;
    const { isIcann, isIp, isPrivate } = (0, tldts_1.parse)(href, {
        detectIp: false,
        allowPrivateDomains: true,
    });
    if (!(isIcann || isIp || isPrivate)) {
        return (0, exports.plain)(src);
    }
    return (0, exports.link)(href, [(0, exports.plain)(src)]);
};
exports.autoEmail = autoEmail;
exports.image = (() => {
    const fn = generate('IMAGE');
    return (src, label) => fn({ src: (0, exports.plain)(src), label: label || (0, exports.plain)(src) });
})();
exports.quote = generate('QUOTE');
exports.mentionChannel = (() => {
    const fn = generate('MENTION_CHANNEL');
    return (value) => fn((0, exports.plain)(value));
})();
exports.orderedList = generate('ORDERED_LIST');
exports.unorderedList = generate('UNORDERED_LIST');
const listItem = (text, number) => (Object.assign({ type: 'LIST_ITEM', value: text }, (number && { number })));
exports.listItem = listItem;
exports.mentionUser = (() => {
    const fn = generate('MENTION_USER');
    return (value) => fn((0, exports.plain)(value));
})();
const emoji = (shortCode) => ({
    type: 'EMOJI',
    value: (0, exports.plain)(shortCode),
    shortCode,
});
exports.emoji = emoji;
const emojiUnicode = (unicode) => ({
    type: 'EMOJI',
    value: undefined,
    unicode,
});
exports.emojiUnicode = emojiUnicode;
const emoticon = (emoticon, shortCode) => ({
    type: 'EMOJI',
    value: (0, exports.plain)(emoticon),
    shortCode,
});
exports.emoticon = emoticon;
const joinEmoji = (current, previous, next) => {
    if (current.type !== 'EMOJI' || !current.value || (!previous && !next)) {
        return current;
    }
    const hasEmojiAsNeighbor = (previous === null || previous === void 0 ? void 0 : previous.type) === current.type || current.type === (next === null || next === void 0 ? void 0 : next.type);
    const hasPlainAsNeighbor = ((previous === null || previous === void 0 ? void 0 : previous.type) === 'PLAIN_TEXT' && previous.value.trim() !== '') ||
        ((next === null || next === void 0 ? void 0 : next.type) === 'PLAIN_TEXT' && next.value.trim() !== '');
    const isEmoticon = current.shortCode !== current.value.value;
    if (current.value && (hasEmojiAsNeighbor || hasPlainAsNeighbor)) {
        if (isEmoticon) {
            return current.value;
        }
        return Object.assign(Object.assign({}, current.value), { value: `:${current.value.value}:` });
    }
    return current;
};
const reducePlainTexts = (values) => values.flat().reduce((result, item, index, values) => {
    const next = values[index + 1];
    const current = joinEmoji(item, values[index - 1], next);
    const previous = result[result.length - 1];
    if (previous) {
        if (current.type === 'PLAIN_TEXT' && current.type === previous.type) {
            previous.value += current.value;
            return result;
        }
    }
    return [...result, current];
}, []);
exports.reducePlainTexts = reducePlainTexts;
const lineBreak = () => ({
    type: 'LINE_BREAK',
    value: undefined,
});
exports.lineBreak = lineBreak;
const katex = (content) => ({
    type: 'KATEX',
    value: content,
});
exports.katex = katex;
const inlineKatex = (content) => ({
    type: 'INLINE_KATEX',
    value: content,
});
exports.inlineKatex = inlineKatex;
const phoneChecker = (text, number) => {
    if (number.length < 5) {
        return (0, exports.plain)(text);
    }
    return (0, exports.link)(`tel:${number}`, [(0, exports.plain)(text)]);
};
exports.phoneChecker = phoneChecker;
const timestamp = (value, type) => {
    return {
        type: 'TIMESTAMP',
        value: {
            timestamp: value,
            format: type || 't',
        },
        fallback: (0, exports.plain)(`<t:${value}:${type || 't'}>`),
    };
};
exports.timestamp = timestamp;
const extractFirstResult = (value) => {
    if (typeof value !== 'object' || !Array.isArray(value)) {
        return value;
    }
    return value.filter((item) => item).shift();
};
exports.extractFirstResult = extractFirstResult;
