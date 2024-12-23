"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSDK = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const preact_1 = require("preact");
const hooks_1 = require("preact/hooks");
const api_1 = require("../api");
const SDKContext = (0, preact_1.createContext)({});
const useSDK = () => {
    const context = (0, hooks_1.useContext)(SDKContext);
    if (!context.sdk) {
        throw new Error('useSDK must be used within a SDKProvider');
    }
    return context.sdk;
};
exports.useSDK = useSDK;
const SDKProvider = ({ children }) => {
    const sdk = (0, hooks_1.useMemo)(() => api_1.Livechat, []);
    return (0, jsx_runtime_1.jsx)(SDKContext.Provider, { value: { sdk }, children: children });
};
exports.default = SDKProvider;
