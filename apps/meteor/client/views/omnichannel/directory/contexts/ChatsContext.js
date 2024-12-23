"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChatsContext = exports.ChatsContext = exports.initialValues = void 0;
const react_1 = require("react");
exports.initialValues = {
    guest: '',
    servedBy: 'all',
    status: 'all',
    department: 'all',
    from: '',
    to: '',
    tags: [],
};
exports.ChatsContext = (0, react_1.createContext)({
    filtersQuery: exports.initialValues,
    setFiltersQuery: () => undefined,
    resetFiltersQuery: () => undefined,
    displayFilters: {
        from: undefined,
        to: undefined,
        guest: undefined,
        servedBy: undefined,
        department: undefined,
        status: undefined,
        tags: undefined,
    },
    removeFilter: () => undefined,
    hasAppliedFilters: false,
    textInputRef: null,
});
const useChatsContext = () => {
    const context = (0, react_1.useContext)(exports.ChatsContext);
    if (!context) {
        throw new Error('Must be running in Chats Context');
    }
    return context;
};
exports.useChatsContext = useChatsContext;
