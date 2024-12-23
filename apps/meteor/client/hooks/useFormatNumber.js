"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormatNumber = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useFormatNumber = (options) => {
    const language = (0, ui_contexts_1.useLanguage)();
    return (0, react_1.useCallback)((value) => {
        try {
            return new Intl.NumberFormat(language, options).format(value);
        }
        catch (_error) {
            return value;
        }
    }, [language, options]);
};
exports.useFormatNumber = useFormatNumber;
