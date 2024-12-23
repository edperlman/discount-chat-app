"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const emitter_1 = require("@rocket.chat/emitter");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const path_to_regexp_1 = require("path-to-regexp");
const hooks_1 = require("preact/hooks");
const App_1 = require("../components/App");
const store_1 = require("../store");
const SDKProvider_1 = require("./SDKProvider");
const ServerProvider = ({ children }) => {
    const sdk = (0, SDKProvider_1.useSDK)();
    const { token } = (0, store_1.useStore)();
    const contextValue = (0, hooks_1.useMemo)(() => {
        const absoluteUrl = (path) => {
            return `${App_1.host}${path}`;
        };
        const callMethod = (methodName, ...args) => sdk.client.callAsync(methodName, ...args);
        const callEndpoint = ({ method, pathPattern, keys, params, }) => {
            const compiledPath = (0, path_to_regexp_1.compile)(pathPattern, { encode: encodeURIComponent })(keys);
            switch (method) {
                case 'GET':
                    return sdk.rest.get(compiledPath, params);
                case 'POST':
                    return sdk.rest.post(compiledPath, params);
                case 'PUT':
                    return sdk.rest.put(compiledPath, params);
                case 'DELETE':
                    return sdk.rest.delete(compiledPath, params);
                default:
                    throw new Error('Invalid HTTP method');
            }
        };
        const uploadToEndpoint = (endpoint, formData) => sdk.rest.post(endpoint, formData);
        const getStream = (streamName, _options) => {
            return (eventName, callback) => {
                return sdk.stream(streamName, [eventName, { visitorToken: token, token }], callback).stop;
            };
        };
        const ee = new emitter_1.Emitter();
        const events = new Map();
        const getSingleStream = (streamName, _options) => {
            const stream = getStream(streamName);
            return (eventName, callback) => {
                ee.on(`${streamName}/${eventName}`, callback);
                const handler = (...args) => {
                    ee.emit(`${streamName}/${eventName}`, ...args);
                };
                const stop = () => {
                    // If someone is still listening, don't unsubscribe
                    ee.off(`${streamName}/${eventName}`, callback);
                    if (ee.has(`${streamName}/${eventName}`)) {
                        return;
                    }
                    const unsubscribe = events.get(`${streamName}/${eventName}`);
                    if (unsubscribe) {
                        unsubscribe();
                        events.delete(`${streamName}/${eventName}`);
                    }
                };
                if (!events.has(`${streamName}/${eventName}`)) {
                    events.set(`${streamName}/${eventName}`, stream(eventName, handler));
                }
                return stop;
            };
        };
        const contextValue = {
            // info,
            absoluteUrl,
            callMethod,
            callEndpoint,
            uploadToEndpoint,
            getStream,
            getSingleStream,
        };
        return contextValue;
    }, [sdk, token]);
    return (0, jsx_runtime_1.jsx)(ui_contexts_1.ServerContext.Provider, { children: children, value: contextValue });
};
exports.default = ServerProvider;
