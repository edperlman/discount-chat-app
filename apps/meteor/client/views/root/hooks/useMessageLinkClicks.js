"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageLinkClicks = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const fireGlobalEvent_1 = require("../../../lib/utils/fireGlobalEvent");
const useMessageLinkClicks = () => {
    const absoluteUrl = (0, ui_contexts_1.useAbsoluteUrl)();
    const { isEmbedded: embeddedLayout } = (0, ui_contexts_1.useLayout)();
    (0, react_1.useEffect)(() => {
        if (!embeddedLayout) {
            return;
        }
        const handleMessageLinkClick = (event) => {
            const element = event.currentTarget;
            if (!element || !(element instanceof HTMLElement)) {
                return;
            }
            if (!(element instanceof HTMLAnchorElement)) {
                return;
            }
            if (element.origin !== absoluteUrl('').replace(/\/+$/, '') || !/msg=([a-zA-Z0-9]+)/.test(element.search)) {
                return;
            }
            (0, fireGlobalEvent_1.fireGlobalEvent)('click-message-link', { link: element.pathname + element.search });
        };
        document.body.addEventListener('click', handleMessageLinkClick);
        return () => {
            document.body.removeEventListener('click', handleMessageLinkClick);
        };
    }, [absoluteUrl, embeddedLayout]);
};
exports.useMessageLinkClicks = useMessageLinkClicks;
