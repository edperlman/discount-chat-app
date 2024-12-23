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
exports.useVisitorInfo = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useVisitorInfo = (visitorId, { enabled = true, cacheTime = 0 } = {}) => {
    const getVisitorInfo = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/visitors.info');
    const _a = (0, react_query_1.useQuery)(['/v1/livechat/visitors.info', visitorId], () => getVisitorInfo({ visitorId }), {
        enabled,
        cacheTime,
    }), { data: { visitor } = {} } = _a, props = __rest(_a, ["data"]);
    return Object.assign({ data: visitor }, props);
};
exports.useVisitorInfo = useVisitorInfo;
