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
exports.useVoipExtensionDetails = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useVoipExtensionDetails = ({ extension, enabled = true }) => {
    const isEnabled = !!extension && enabled;
    const getContactDetails = (0, ui_contexts_1.useEndpoint)('GET', '/v1/voip-freeswitch.extension.getDetails');
    const _a = (0, react_query_1.useQuery)(['voip', 'voip-extension-details', extension, getContactDetails], () => getContactDetails({ extension: extension }), { enabled: isEnabled }), { data } = _a, result = __rest(_a, ["data"]);
    return Object.assign({ data: isEnabled ? data : undefined }, result);
};
exports.useVoipExtensionDetails = useVoipExtensionDetails;
