"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInvalidateLicense = exports.useLicenseName = exports.useHasLicense = exports.useLicense = exports.useLicenseBase = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const invalidateQueryClientLicenses = (() => {
    let timeout;
    return (queryClient, milliseconds = 5000) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = undefined;
            queryClient.invalidateQueries(['licenses']);
        }, milliseconds);
    };
})();
const useLicenseBase = ({ params, select, }) => {
    const uid = (0, ui_contexts_1.useUserId)();
    const getLicenses = (0, ui_contexts_1.useEndpoint)('GET', '/v1/licenses.info');
    const invalidateQueries = (0, exports.useInvalidateLicense)();
    const notify = (0, ui_contexts_1.useStream)('notify-all');
    (0, react_1.useEffect)(() => notify('license', () => invalidateQueries()), [notify, invalidateQueries]);
    return (0, react_query_1.useQuery)(['licenses', 'getLicenses', params], () => getLicenses(Object.assign({}, params)), {
        staleTime: Infinity,
        keepPreviousData: true,
        select,
        enabled: !!uid,
    });
};
exports.useLicenseBase = useLicenseBase;
const useLicense = (params) => {
    return (0, exports.useLicenseBase)({ params, select: (data) => data.license });
};
exports.useLicense = useLicense;
const useHasLicense = () => {
    return (0, exports.useLicenseBase)({ select: (data) => Boolean(data.license) });
};
exports.useHasLicense = useHasLicense;
const useLicenseName = (params) => {
    return (0, exports.useLicenseBase)({ params, select: (data) => { var _a; return ((_a = data === null || data === void 0 ? void 0 : data.license.tags) === null || _a === void 0 ? void 0 : _a.map((tag) => tag.name).join(' ')) || 'Community'; } });
};
exports.useLicenseName = useLicenseName;
const useInvalidateLicense = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (milliseconds) => invalidateQueryClientLicenses(queryClient, milliseconds);
};
exports.useInvalidateLicense = useInvalidateLicense;
