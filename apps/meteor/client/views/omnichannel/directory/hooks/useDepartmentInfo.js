"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDepartmentInfo = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useDepartmentInfo = (departmentId) => {
    const deptInfo = (0, ui_contexts_1.useEndpoint)('GET', `/v1/livechat/department/:_id`, { _id: departmentId });
    return (0, react_query_1.useQuery)(['livechat/department', departmentId], () => deptInfo({}));
};
exports.useDepartmentInfo = useDepartmentInfo;
