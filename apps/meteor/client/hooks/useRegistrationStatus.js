"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRegistrationStatus = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useRegistrationStatus = () => {
    var _a, _b;
    const getRegistrationStatus = (0, ui_contexts_1.useEndpoint)('GET', '/v1/cloud.registrationStatus');
    const canViewregistrationStatus = (0, ui_contexts_1.usePermission)('manage-cloud');
    const queryResult = (0, react_query_1.useQuery)(['getRegistrationStatus'], () => {
        if (!canViewregistrationStatus) {
            throw new Error('unauthorized api call');
        }
        return getRegistrationStatus();
    }, {
        keepPreviousData: true,
        staleTime: Infinity,
    });
    return Object.assign({ isRegistered: !queryResult.isLoading && ((_b = (_a = queryResult.data) === null || _a === void 0 ? void 0 : _a.registrationStatus) === null || _b === void 0 ? void 0 : _b.workspaceRegistered) }, queryResult);
};
exports.useRegistrationStatus = useRegistrationStatus;
