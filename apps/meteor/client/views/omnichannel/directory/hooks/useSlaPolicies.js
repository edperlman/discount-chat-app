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
exports.useSlaPolicies = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const date_fns_1 = require("date-fns");
const useHasLicenseModule_1 = require("../../../../hooks/useHasLicenseModule");
const useSlaPolicies = () => {
    const isEnterprise = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise') === true;
    const getSlaPolicies = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/sla');
    const _a = (0, react_query_1.useQuery)(['/v1/livechat/sla'], () => getSlaPolicies({}), {
        staleTime: (0, date_fns_1.millisecondsToMinutes)(10),
        enabled: isEnterprise,
    }), { data: { sla } = {} } = _a, props = __rest(_a, ["data"]);
    return Object.assign({ data: sla }, props);
};
exports.useSlaPolicies = useSlaPolicies;
