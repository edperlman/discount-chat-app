"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocalePercentage = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const getLocalePercentage_1 = require("../lib/getLocalePercentage");
const useLocalePercentage = (total, fraction, decimalCount) => {
    const locale = (0, ui_contexts_1.useLanguage)();
    return (0, getLocalePercentage_1.getLocalePercentage)(locale, total, fraction, decimalCount);
};
exports.useLocalePercentage = useLocalePercentage;
