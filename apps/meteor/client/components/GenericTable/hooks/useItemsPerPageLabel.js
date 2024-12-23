"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useItemsPerPageLabel = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useItemsPerPageLabel = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (0, react_1.useCallback)(() => t('Items_per_page:'), [t]);
};
exports.useItemsPerPageLabel = useItemsPerPageLabel;
