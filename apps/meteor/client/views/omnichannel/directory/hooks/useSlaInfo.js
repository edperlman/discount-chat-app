"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSlaInfo = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useHasLicenseModule_1 = require("../../../../hooks/useHasLicenseModule");
const useSlaInfo = (slaId) => {
    const isEnterprise = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise') === true;
    const getSLA = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/sla/:slaId', { slaId });
    return (0, react_query_1.useQuery)(['/v1/livechat/sla/:slaId', slaId], () => getSLA(), {
        enabled: isEnterprise && !!slaId,
    });
};
exports.useSlaInfo = useSlaInfo;
