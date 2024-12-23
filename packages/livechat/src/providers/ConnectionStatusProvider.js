"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const hooks_1 = require("preact/hooks");
const shim_1 = require("use-sync-external-store/shim");
const SDKProvider_1 = require("./SDKProvider");
const ConnectionStatusProvider = ({ children }) => {
    const sdk = (0, SDKProvider_1.useSDK)();
    const status = (0, shim_1.useSyncExternalStore)((cb) => sdk.connection.on('connection', cb), () => {
        switch (sdk.connection.status) {
            case 'connecting':
                return 'connecting';
            case 'connected':
                return 'connected';
            case 'failed':
                return 'failed';
            case 'idle':
                return 'waiting';
            default:
                return 'offline';
        }
    });
    const value = (0, hooks_1.useMemo)(() => ({
        status,
        connected: status === 'connected',
        reconnect: () => sdk.connection.reconnect(),
    }), [status, sdk]);
    return (0, jsx_runtime_1.jsx)(ui_contexts_1.ConnectionStatusContext.Provider, { children: children, value: value });
};
exports.default = ConnectionStatusProvider;
