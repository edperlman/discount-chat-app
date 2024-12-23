"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCheckoutUrl = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useCheckoutUrl = () => {
    const absoluteUrl = (0, ui_contexts_1.useAbsoluteUrl)()('/links/manage-subscription');
    return (query) => {
        const url = new URL(absoluteUrl);
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                url.searchParams.append(key, value.toString());
            });
        }
        return url.toString();
    };
};
exports.useCheckoutUrl = useCheckoutUrl;
