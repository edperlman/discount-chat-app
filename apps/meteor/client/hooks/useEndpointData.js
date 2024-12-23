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
exports.useEndpointData = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useAsyncState_1 = require("./useAsyncState");
const getConfig_1 = require("../lib/utils/getConfig");
const log = (name) => process.env.NODE_ENV !== 'production' || (0, getConfig_1.getConfig)('debug') === 'true'
    ? (...args) => console.warn(name, ...args)
    : () => undefined;
const deprecationWarning = log('useEndpointData is deprecated, use @tanstack/react-query instead');
/**
 * use @tanstack/react-query with useEndpoint instead
 * @deprecated
 */
const useEndpointData = (endpoint, options = {}) => {
    deprecationWarning(Object.assign({ endpoint }, options));
    const _a = (0, useAsyncState_1.useAsyncState)(options.initialValue), { resolve, reject, reset } = _a, state = __rest(_a, ["resolve", "reject", "reset"]);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const getData = (0, ui_contexts_1.useEndpoint)('GET', endpoint, options.keys);
    const fetchData = (0, react_1.useCallback)(() => {
        reset();
        getData(options.params)
            .then(resolve)
            .catch((error) => {
            console.error(error);
            dispatchToastMessage({
                type: 'error',
                message: error,
            });
            reject(error);
        });
    }, [reset, getData, options.params, resolve, dispatchToastMessage, reject]);
    (0, react_1.useEffect)(() => {
        fetchData();
    }, [fetchData]);
    return Object.assign(Object.assign({}, state), { reload: fetchData });
};
exports.useEndpointData = useEndpointData;
