"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNormalizedMessage = void 0;
const base64_1 = require("@rocket.chat/base64");
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useSubscriptionFromMessageQuery_1 = require("./useSubscriptionFromMessageQuery");
const parseMessageTextToAstMarkdown_1 = require("../../../lib/parseMessageTextToAstMarkdown");
const useAutoLinkDomains_1 = require("../../../views/room/MessageList/hooks/useAutoLinkDomains");
const useAutoTranslate_1 = require("../../../views/room/MessageList/hooks/useAutoTranslate");
const useKatex_1 = require("../../../views/room/MessageList/hooks/useKatex");
const normalizeAttachments = (attachments, name, type) => {
    if (name) {
        name = String.fromCharCode(...new TextEncoder().encode(name));
    }
    return attachments.map((attachment) => {
        if ((0, core_typings_1.isQuoteAttachment)(attachment) && attachment.attachments) {
            attachment.attachments = normalizeAttachments(attachment.attachments);
            return attachment;
        }
        if (!attachment.encryption) {
            return attachment;
        }
        const key = base64_1.Base64.encode(JSON.stringify(Object.assign(Object.assign({}, attachment.encryption), { name,
            type })));
        if ((0, core_typings_1.isFileAttachment)(attachment)) {
            if (attachment.title_link && !attachment.title_link.startsWith('/file-decrypt/')) {
                attachment.title_link = `/file-decrypt${attachment.title_link}?key=${key}`;
            }
            if ((0, core_typings_1.isFileImageAttachment)(attachment) && !attachment.image_url.startsWith('/file-decrypt/')) {
                attachment.image_url = `/file-decrypt${attachment.image_url}?key=${key}`;
            }
            if ((0, core_typings_1.isFileAudioAttachment)(attachment) && !attachment.audio_url.startsWith('/file-decrypt/')) {
                attachment.audio_url = `/file-decrypt${attachment.audio_url}?key=${key}`;
            }
            if ((0, core_typings_1.isFileVideoAttachment)(attachment) && !attachment.video_url.startsWith('/file-decrypt/')) {
                attachment.video_url = `/file-decrypt${attachment.video_url}?key=${key}`;
            }
        }
        return attachment;
    });
};
const useNormalizedMessage = (message) => {
    var _a;
    const { katexEnabled, katexDollarSyntaxEnabled, katexParenthesisSyntaxEnabled } = (0, useKatex_1.useKatex)();
    const customDomains = (0, useAutoLinkDomains_1.useAutoLinkDomains)();
    const subscription = (_a = (0, useSubscriptionFromMessageQuery_1.useSubscriptionFromMessageQuery)(message).data) !== null && _a !== void 0 ? _a : undefined;
    const autoTranslateOptions = (0, useAutoTranslate_1.useAutoTranslate)(subscription);
    const showColors = (0, ui_contexts_1.useSetting)('HexColorPreview_Enabled', true);
    return (0, react_1.useMemo)(() => {
        var _a, _b;
        const parseOptions = Object.assign({ colors: showColors, emoticons: true, customDomains }, (katexEnabled && {
            katex: {
                dollarSyntax: katexDollarSyntaxEnabled,
                parenthesisSyntax: katexParenthesisSyntaxEnabled,
            },
        }));
        const normalizedMessage = (0, parseMessageTextToAstMarkdown_1.parseMessageTextToAstMarkdown)(message, parseOptions, autoTranslateOptions);
        if (normalizedMessage.attachments) {
            normalizedMessage.attachments = normalizeAttachments(normalizedMessage.attachments, (_a = normalizedMessage.file) === null || _a === void 0 ? void 0 : _a.name, (_b = normalizedMessage.file) === null || _b === void 0 ? void 0 : _b.type);
        }
        return normalizedMessage;
    }, [showColors, customDomains, katexEnabled, katexDollarSyntaxEnabled, katexParenthesisSyntaxEnabled, message, autoTranslateOptions]);
};
exports.useNormalizedMessage = useNormalizedMessage;
