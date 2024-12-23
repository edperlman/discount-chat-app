"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDisplayFilters = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const useFormatDate_1 = require("../../../../hooks/useFormatDate");
const statusTextMap = {
    all: 'All',
    closed: 'Closed',
    opened: 'Room_Status_Open',
    onhold: 'On_Hold_Chats',
    queued: 'Queued',
};
const useDisplayFilters = (filtersQuery) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatDate = (0, useFormatDate_1.useFormatDate)();
    const { guest, servedBy, status, department, from, to, tags } = filtersQuery, customFields = __rest(filtersQuery, ["guest", "servedBy", "status", "department", "from", "to", "tags"]);
    const getDepartment = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/department/:_id', { _id: department });
    const getAgent = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/users/agent/:_id', { _id: servedBy });
    const { data: departmentData } = (0, react_query_1.useQuery)(['getDepartmentDataForFilter', department], () => getDepartment({}));
    const { data: agentData } = (0, react_query_1.useQuery)(['getAgentDataForFilter', servedBy], () => getAgent());
    const displayCustomFields = Object.entries(customFields).reduce((acc, [key, value]) => {
        acc[key] = value ? `${key}: ${value}` : undefined;
        return acc;
    }, {});
    return Object.assign({ from: from !== '' ? `${t('From')}: ${formatDate(from)}` : undefined, to: to !== '' ? `${t('To')}: ${formatDate(to)}` : undefined, guest: guest !== '' ? `${t('Text')}: ${guest}` : undefined, servedBy: servedBy !== 'all' ? `${t('Served_By')}: ${agentData === null || agentData === void 0 ? void 0 : agentData.user.name}` : undefined, department: department !== 'all' ? `${t('Department')}: ${departmentData === null || departmentData === void 0 ? void 0 : departmentData.department.name}` : undefined, status: status !== 'all' ? `${t('Status')}: ${t(statusTextMap[status])}` : undefined, tags: tags.length > 0 ? `${t('Tags')}: ${tags.map((tag) => tag.label).join(', ')}` : undefined }, displayCustomFields);
};
exports.useDisplayFilters = useDisplayFilters;
