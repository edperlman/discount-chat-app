"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKatex = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useKatex = () => {
    const katexEnabled = (0, ui_contexts_1.useSetting)('Katex_Enabled', true);
    const katexDollarSyntaxEnabled = (0, ui_contexts_1.useSetting)('Katex_Dollar_Syntax', false) && katexEnabled;
    const katexParenthesisSyntaxEnabled = (0, ui_contexts_1.useSetting)('Katex_Parenthesis_Syntax', true) && katexEnabled;
    return {
        katexEnabled,
        katexDollarSyntaxEnabled,
        katexParenthesisSyntaxEnabled,
    };
};
exports.useKatex = useKatex;
