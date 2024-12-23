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
exports.useContactRoute = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useContactRoute = () => {
    const { navigate, getRouteParameters, getRouteName } = (0, ui_contexts_1.useRouter)();
    const currentRouteName = getRouteName();
    const currentParams = getRouteParameters();
    const handleNavigate = (0, react_1.useCallback)((_a) => {
        var { id } = _a, params = __rest(_a, ["id"]);
        if (!currentRouteName) {
            return;
        }
        if (currentRouteName === 'omnichannel-directory') {
            return navigate({
                name: currentRouteName,
                params: Object.assign(Object.assign(Object.assign({}, currentParams), { tab: 'contacts', id: id || currentParams.id }), params),
            });
        }
        navigate({
            name: currentRouteName,
            params: Object.assign(Object.assign(Object.assign({}, currentParams), { id: currentParams.id }), params),
        });
    }, [navigate, currentParams, currentRouteName]);
    (0, react_1.useEffect)(() => {
        if (!currentParams.context) {
            handleNavigate({ context: 'details' });
        }
    }, [currentParams.context, handleNavigate]);
    return handleNavigate;
};
exports.useContactRoute = useContactRoute;
