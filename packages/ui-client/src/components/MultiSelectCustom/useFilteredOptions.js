"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFilteredOptions = void 0;
const react_i18next_1 = require("react-i18next");
const useFilteredOptions = (optionSearch, options) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    if (!optionSearch)
        return options;
    let filtered = [];
    options.forEach((option) => {
        if (t(option.text)
            .toLowerCase()
            .includes(optionSearch.toLowerCase())) {
            filtered = [...filtered, option];
        }
    });
    return filtered;
};
exports.useFilteredOptions = useFilteredOptions;
