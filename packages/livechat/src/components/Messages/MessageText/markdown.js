"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMarkdown = void 0;
const markdown_it_1 = __importDefault(require("markdown-it"));
const md = new markdown_it_1.default({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
});
const defaultRender = md.renderer.rules.link_open || ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const targetAttrIndex = tokens[idx].attrIndex('target');
    const relAttrIndex = tokens[idx].attrIndex('rel');
    if (targetAttrIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']);
    }
    else {
        const { attrs } = tokens[idx];
        if (attrs) {
            attrs[targetAttrIndex][1] = '_blank';
        }
    }
    if (relAttrIndex < 0) {
        tokens[idx].attrPush(['rel', 'noopener noreferrer']);
    }
    else {
        const { attrs } = tokens[idx];
        if (attrs) {
            attrs[relAttrIndex][1] = 'noopener noreferrer';
        }
    }
    return defaultRender(tokens, idx, options, env, self);
};
md.use((md) => {
    const renderStrong = (tokens, idx, opts, _, slf) => {
        const token = tokens[idx];
        if (token.markup === '*') {
            token.tag = 'strong';
        }
        return slf.renderToken(tokens, idx, opts);
    };
    md.renderer.rules.em_open = renderStrong;
    md.renderer.rules.em_close = renderStrong;
});
md.use((md) => {
    md.inline.ruler.push('strikethrough', (state, silent) => {
        const marker = state.src.charCodeAt(state.pos);
        if (silent) {
            return false;
        }
        if (marker !== 0x7e /* ~ */) {
            return false;
        }
        const scanned = state.scanDelims(state.pos, true);
        const ch = String.fromCharCode(marker);
        const len = scanned.length;
        for (let i = 0; i < len; i += 1) {
            const token = state.push('text', '', 0);
            token.content = ch;
            state.delimiters.push({
                marker,
                length: 0,
                token: state.tokens.length - 1,
                end: -1,
                open: scanned.can_open,
                close: scanned.can_close,
            });
        }
        state.pos += scanned.length;
        return true;
    });
});
const renderMarkdown = (...args) => md.render(...args);
exports.renderMarkdown = renderMarkdown;
