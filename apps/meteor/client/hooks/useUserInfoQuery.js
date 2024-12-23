"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserInfoQuery = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
// a hook using tanstack useQuery and useEndpoint that fetches user information from the `users.info` endpoint
const useUserInfoQuery = (params, options = { keepPreviousData: true }) => {
    const getUserInfo = (0, ui_contexts_1.useEndpoint)('GET', '/v1/users.info');
    return (0, react_query_1.useQuery)(['users.info', params], () => getUserInfo(Object.assign({}, params)), options);
};
exports.useUserInfoQuery = useUserInfoQuery;
