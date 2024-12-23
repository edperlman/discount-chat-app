"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const ui_client_1 = require("@rocket.chat/ui-client");
const dompurify_1 = __importDefault(require("dompurify"));
const marked_1 = require("marked");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const renderMessageEmoji_1 = require("../lib/utils/renderMessageEmoji");
const documentRenderer = new marked_1.marked.Renderer();
const inlineRenderer = new marked_1.marked.Renderer();
const inlineWithoutBreaks = new marked_1.marked.Renderer();
const walkTokens = (token) => {
    const boldPattern = /^\*[^*]+\*$|^\*\*[^*]+\*\*$/;
    const italicPattern = /^__(?=\S)([\s\S]*?\S)__(?!_)|^_(?=\S)([\s\S]*?\S)_(?!_)/;
    if (boldPattern.test(token.raw) && token.type === 'em') {
        token.type = 'strong';
    }
    else if (italicPattern.test(token.raw) && token.type === 'strong') {
        token.type = 'em';
    }
};
marked_1.marked.use({ walkTokens });
const linkMarked = (href, _title, text) => `<a href="${href}" rel="nofollow noopener noreferrer">${text}</a> `;
const paragraphMarked = (text) => text;
const brMarked = () => ' ';
const listItemMarked = (text) => {
    const cleanText = text.replace(/<p.*?>|<\/p>/gi, '');
    return `<li>${cleanText}</li>`;
};
const horizontalRuleMarked = () => '';
documentRenderer.link = linkMarked;
documentRenderer.listitem = listItemMarked;
inlineRenderer.link = linkMarked;
inlineRenderer.paragraph = paragraphMarked;
inlineRenderer.listitem = listItemMarked;
inlineRenderer.hr = horizontalRuleMarked;
inlineWithoutBreaks.link = linkMarked;
inlineWithoutBreaks.paragraph = paragraphMarked;
inlineWithoutBreaks.br = brMarked;
inlineWithoutBreaks.image = brMarked;
inlineWithoutBreaks.code = paragraphMarked;
inlineWithoutBreaks.codespan = paragraphMarked;
inlineWithoutBreaks.listitem = listItemMarked;
inlineWithoutBreaks.hr = horizontalRuleMarked;
const defaultOptions = {
    gfm: true,
    headerIds: false,
};
const options = Object.assign(Object.assign({}, defaultOptions), { renderer: documentRenderer });
const inlineOptions = Object.assign(Object.assign({}, defaultOptions), { renderer: inlineRenderer });
const inlineWithoutBreaksOptions = Object.assign(Object.assign({}, defaultOptions), { renderer: inlineWithoutBreaks });
const getRegexp = (schemeSetting) => {
    const schemes = schemeSetting ? schemeSetting.split(',').join('|') : '';
    return new RegExp(`^(${schemes}):`, 'gim');
};
const MarkdownText = (_a) => {
    var { content, variant = 'document', withTruncatedText = false, preserveHtml = false, parseEmoji = false } = _a, props = __rest(_a, ["content", "variant", "withTruncatedText", "preserveHtml", "parseEmoji"]);
    const sanitizer = dompurify_1.default.sanitize;
    const { t } = (0, react_i18next_1.useTranslation)();
    let markedOptions;
    const schemes = 'http,https,notes,ftp,ftps,tel,mailto,sms,cid';
    switch (variant) {
        case 'inline':
            markedOptions = inlineOptions;
            break;
        case 'inlineWithoutBreaks':
            markedOptions = inlineWithoutBreaksOptions;
            break;
        case 'document':
        default:
            markedOptions = options;
    }
    const __html = (0, react_1.useMemo)(() => {
        const html = (() => {
            if (content && typeof content === 'string') {
                const markedHtml = /inline/.test(variant)
                    ? marked_1.marked.parseInline(new Option(content).innerHTML, markedOptions)
                    : marked_1.marked.parse(new Option(content).innerHTML, markedOptions);
                if (parseEmoji) {
                    // We are using the old emoji parser here. This could come
                    // with additional processing use, but is the workaround available right now.
                    // Should be replaced in the future with the new parser.
                    return (0, renderMessageEmoji_1.renderMessageEmoji)(markedHtml);
                }
                return markedHtml;
            }
        })();
        // Add a hook to make all external links open a new window
        dompurify_1.default.addHook('afterSanitizeAttributes', (node) => {
            if (isElement(node) && 'target' in node) {
                const href = node.getAttribute('href') || '';
                node.setAttribute('title', `${t('Go_to_href', { href: href.replace((0, ui_client_1.getBaseURI)(), '') })}`);
                node.setAttribute('rel', 'nofollow noopener noreferrer');
                if ((0, ui_client_1.isExternal)(node.getAttribute('href') || '')) {
                    node.setAttribute('target', '_blank');
                    node.setAttribute('title', href);
                }
            }
        });
        return preserveHtml ? html : html && sanitizer(html, { ADD_ATTR: ['target'], ALLOWED_URI_REGEXP: getRegexp(schemes) });
    }, [preserveHtml, sanitizer, content, variant, markedOptions, parseEmoji, t]);
    return __html ? ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ dangerouslySetInnerHTML: { __html }, withTruncatedText: withTruncatedText, withRichContent: variant === 'inlineWithoutBreaks' ? 'inlineWithoutBreaks' : true }, props))) : null;
};
const isElement = (node) => node.nodeType === Node.ELEMENT_NODE;
exports.default = MarkdownText;
