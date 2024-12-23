"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAutoLinkDomains = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useAutoLinkDomains = () => {
    const domains = (0, ui_contexts_1.useSetting)('Message_CustomDomain_AutoLink', '');
    const customDomains = (0, react_1.useMemo)(() => (domains ? domains.split(',').map((domain) => domain.trim()) : []), [domains]);
    return (0, react_1.useMemo)(() => {
        return customDomains;
    }, [customDomains]);
};
exports.useAutoLinkDomains = useAutoLinkDomains;
