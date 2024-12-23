"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSortQueryOptions = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useSortQueryOptions = () => {
    const sortBy = (0, ui_contexts_1.useUserPreference)('sidebarSortby');
    const showRealName = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name');
    return (0, react_1.useMemo)(() => ({
        sort: Object.assign(Object.assign({}, (sortBy === 'activity' && { lm: -1 })), (sortBy !== 'activity' && Object.assign({}, (showRealName ? { lowerCaseFName: 1 } : { lowerCaseName: 1 })))),
    }), [sortBy, showRealName]);
};
exports.useSortQueryOptions = useSortQueryOptions;
