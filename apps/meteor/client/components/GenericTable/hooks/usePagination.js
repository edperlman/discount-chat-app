"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePagination = void 0;
const react_1 = require("react");
const useCurrent_1 = require("./useCurrent");
const useItemsPerPage_1 = require("./useItemsPerPage");
const useItemsPerPageLabel_1 = require("./useItemsPerPageLabel");
const useShowingResultsLabel_1 = require("./useShowingResultsLabel");
const usePagination = () => {
    const [itemsPerPage, setItemsPerPage] = (0, useItemsPerPage_1.useItemsPerPage)();
    const [current, setCurrent] = (0, useCurrent_1.useCurrent)();
    const itemsPerPageLabel = (0, useItemsPerPageLabel_1.useItemsPerPageLabel)();
    const showingResultsLabel = (0, useShowingResultsLabel_1.useShowingResultsLabel)();
    // Reset to first page when itemsPerPage changes
    (0, react_1.useEffect)(() => {
        setCurrent(0);
    }, [itemsPerPage, setCurrent]);
    return (0, react_1.useMemo)(() => ({
        itemsPerPage,
        setItemsPerPage,
        current,
        setCurrent,
        itemsPerPageLabel,
        showingResultsLabel,
    }), [itemsPerPage, setItemsPerPage, current, setCurrent, itemsPerPageLabel, showingResultsLabel]);
};
exports.usePagination = usePagination;
