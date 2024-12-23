"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSort = void 0;
const react_1 = require("react");
const useSort = (by, initialDirection = 'asc') => {
    const [sort, _setSort] = (0, react_1.useState)(() => [by, initialDirection]);
    const setSort = (0, react_1.useCallback)((id, direction) => {
        _setSort(([sortBy, sortDirection]) => {
            if (direction) {
                return [id, direction];
            }
            if (sortBy === id) {
                return [id, sortDirection === 'asc' ? 'desc' : 'asc'];
            }
            return [id, 'asc'];
        });
    }, []);
    return {
        sortBy: sort[0],
        sortDirection: sort[1],
        setSort,
    };
};
exports.useSort = useSort;
