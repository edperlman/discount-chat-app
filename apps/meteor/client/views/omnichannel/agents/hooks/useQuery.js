"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQuery = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const sortDir = (sortDir) => (sortDir === 'asc' ? 1 : -1);
const useQuery = ({ text, itemsPerPage, current, }, [column, direction]) => (0, fuselage_hooks_1.useDebouncedValue)((0, react_1.useMemo)(() => (Object.assign(Object.assign({ text, sort: JSON.stringify({
        [column]: sortDir(direction),
        usernames: column === 'name' ? sortDir(direction) : undefined,
    }) }, (itemsPerPage && { count: itemsPerPage })), (current && { offset: current }))), [text, itemsPerPage, current, column, direction]), 500);
exports.useQuery = useQuery;
