"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScrollableRecordList = void 0;
const react_1 = require("react");
const asyncState_1 = require("../../lib/asyncState");
const INITIAL_ITEM_COUNT = 25;
const useScrollableRecordList = (recordList, fetchBatchChanges, initialItemCount = INITIAL_ITEM_COUNT) => {
    const loadMoreItems = (0, react_1.useCallback)((start) => {
        if (recordList.phase === asyncState_1.AsyncStatePhase.LOADING || start + 1 < recordList.itemCount) {
            recordList.batchHandle(() => fetchBatchChanges(start, initialItemCount));
        }
    }, [recordList, fetchBatchChanges, initialItemCount]);
    (0, react_1.useEffect)(() => {
        loadMoreItems(0);
    }, [loadMoreItems]);
    return { loadMoreItems, initialItemCount };
};
exports.useScrollableRecordList = useScrollableRecordList;
