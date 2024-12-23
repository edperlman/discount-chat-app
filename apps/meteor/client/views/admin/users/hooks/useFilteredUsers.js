"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const useFilteredUsers = ({ searchTerm, prevSearchTerm, sortData, paginationData, tab, selectedRoles }) => {
    const { setCurrent, itemsPerPage, current } = paginationData;
    const { sortBy, sortDirection } = sortData;
    const payload = (0, react_1.useMemo)(() => {
        if (searchTerm !== prevSearchTerm.current) {
            setCurrent(0);
        }
        const listUsersPayload = {
            all: {},
            pending: {
                hasLoggedIn: false,
                type: 'user',
            },
            active: {
                hasLoggedIn: true,
                status: 'active',
            },
            deactivated: {
                hasLoggedIn: true,
                status: 'deactivated',
            },
        };
        return Object.assign(Object.assign({}, listUsersPayload[tab]), { searchTerm, roles: selectedRoles, sort: `{ "${sortBy}": ${sortDirection === 'asc' ? 1 : -1} }`, count: itemsPerPage, offset: searchTerm === prevSearchTerm.current ? current : 0 });
    }, [current, itemsPerPage, prevSearchTerm, searchTerm, selectedRoles, setCurrent, sortBy, sortDirection, tab]);
    const getUsers = (0, ui_contexts_1.useEndpoint)('GET', '/v1/users.listByStatus');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const usersListQueryResult = (0, react_query_1.useQuery)(['users.list', payload, tab], () => __awaiter(void 0, void 0, void 0, function* () { return getUsers(payload); }), {
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    return usersListQueryResult;
};
exports.default = useFilteredUsers;
