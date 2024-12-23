"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOembedLayout = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
/**
 * Returns the layout parameters for oembeds
 */
const useOembedLayout = () => {
    /*
  Note: both `useSetting` and `useLayout` are hooks that don't force a re-render
  very often, so this hook is not going to be re-evaluated very often either;
  this is why we don't need to memoize the result or store it in a context
  */
    const enabled = (0, ui_contexts_1.useSetting)('API_Embed', false);
    const { isMobile } = (0, ui_contexts_1.useLayout)();
    const maxWidth = isMobile ? '100%' : 368;
    const maxHeight = 368;
    return { enabled, maxWidth, maxHeight };
};
exports.useOembedLayout = useOembedLayout;
