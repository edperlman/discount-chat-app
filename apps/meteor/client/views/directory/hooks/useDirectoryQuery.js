"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDirectoryQuery = useDirectoryQuery;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
function useDirectoryQuery({ text, itemsPerPage, current }, [column, direction], type, workspace = 'local') {
    return (0, fuselage_hooks_1.useDebouncedValue)((0, react_1.useMemo)(() => (Object.assign(Object.assign({ text,
        type,
        workspace, sort: JSON.stringify({ [column]: direction === 'asc' ? 1 : -1 }) }, (itemsPerPage && { count: itemsPerPage })), (current && { offset: current }))), [itemsPerPage, current, column, direction, type, workspace, text]), 500);
}
