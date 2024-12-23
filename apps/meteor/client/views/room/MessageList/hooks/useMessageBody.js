"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageBody = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useAutoLinkDomains_1 = require("./useAutoLinkDomains");
const useAutoTranslate_1 = require("./useAutoTranslate");
const parseMessageTextToAstMarkdown_1 = require("../../../../lib/parseMessageTextToAstMarkdown");
const useMessageBody = (message, rid) => {
    const subscription = (0, ui_contexts_1.useUserSubscription)(rid);
    const autoTranslateOptions = (0, useAutoTranslate_1.useAutoTranslate)(subscription);
    const customDomains = (0, useAutoLinkDomains_1.useAutoLinkDomains)();
    return (0, react_1.useMemo)(() => {
        if (!message) {
            return '';
        }
        if (message.md) {
            const parseOptions = {
                customDomains,
                emoticons: true,
            };
            const messageWithMd = (0, parseMessageTextToAstMarkdown_1.parseMessageTextToAstMarkdown)(message, parseOptions, autoTranslateOptions);
            return messageWithMd.md;
        }
        if (message.msg) {
            return message.msg;
        }
        if (message.attachments) {
            const attachment = message.attachments.find((attachment) => attachment.title || attachment.description);
            if (attachment === null || attachment === void 0 ? void 0 : attachment.description) {
                return attachment.description;
            }
            if (attachment === null || attachment === void 0 ? void 0 : attachment.title) {
                return attachment.title;
            }
        }
        return '';
    }, [message, customDomains, autoTranslateOptions]);
};
exports.useMessageBody = useMessageBody;
