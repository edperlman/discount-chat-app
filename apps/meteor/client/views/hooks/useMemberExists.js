"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMemberExists = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useMemberExists = ({ roomId, username }) => {
    const checkMember = (0, ui_contexts_1.useEndpoint)('GET', '/v1/rooms.isMember');
    return (0, react_query_1.useQuery)(['rooms/isMember', roomId, username], () => checkMember({ roomId, username }));
};
exports.useMemberExists = useMemberExists;
