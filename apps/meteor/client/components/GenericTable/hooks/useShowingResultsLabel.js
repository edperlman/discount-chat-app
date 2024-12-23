"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useShowingResultsLabel = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useShowingResultsLabel = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (0, react_1.useCallback)(({ count, current, itemsPerPage }) => t('Showing_results_of', { postProcess: 'sprintf', sprintf: [current + 1, Math.min(current + itemsPerPage, count), count] }), [t]);
};
exports.useShowingResultsLabel = useShowingResultsLabel;
