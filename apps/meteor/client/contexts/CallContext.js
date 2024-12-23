"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipNetworkStatus = exports.useVoipOutboundStates = exports.useCallUnregisterClient = exports.useCallRegisterClient = exports.useChangeAudioInputDevice = exports.useChangeAudioOutputDevice = exports.useOpenedRoomInfo = exports.useQueueCounter = exports.useQueueName = exports.useCallClient = exports.useCallOpenRoom = exports.useCallCreateRoom = exports.useCallerInfo = exports.useCallActions = exports.useIsCallError = exports.useIsCallReady = exports.useIsCallEnabled = exports.useIsVoipEnterprise = exports.CallContext = void 0;
const react_1 = require("react");
const shim_1 = require("use-sync-external-store/shim");
const useHasLicenseModule_1 = require("../hooks/useHasLicenseModule");
const isCallContextReady = (context) => context.ready;
const isCallContextError = (context) => context.error !== undefined;
const CallContextValueDefault = {
    enabled: false,
    ready: false,
    outBoundCallsAllowed: undefined,
    outBoundCallsEnabled: undefined,
    outBoundCallsEnabledForUser: undefined,
};
exports.CallContext = (0, react_1.createContext)(CallContextValueDefault);
const useIsVoipEnterprise = () => (0, useHasLicenseModule_1.useHasLicenseModule)('voip-enterprise') === true;
exports.useIsVoipEnterprise = useIsVoipEnterprise;
const useIsCallEnabled = () => {
    const { enabled } = (0, react_1.useContext)(exports.CallContext);
    return enabled;
};
exports.useIsCallEnabled = useIsCallEnabled;
const useIsCallReady = () => {
    const { ready } = (0, react_1.useContext)(exports.CallContext);
    return Boolean(ready);
};
exports.useIsCallReady = useIsCallReady;
const useIsCallError = () => {
    const context = (0, react_1.useContext)(exports.CallContext);
    return Boolean(isCallContextError(context));
};
exports.useIsCallError = useIsCallError;
const useCallActions = () => {
    const context = (0, react_1.useContext)(exports.CallContext);
    if (!isCallContextReady(context)) {
        throw new Error('useCallActions only if Calls are enabled and ready');
    }
    return context.actions;
};
exports.useCallActions = useCallActions;
const useCallerInfo = () => {
    const context = (0, react_1.useContext)(exports.CallContext);
    if (!isCallContextReady(context)) {
        throw new Error('useCallerInfo only if Calls are enabled and ready');
    }
    const { voipClient } = context;
    const [subscribe, getSnapshot] = (0, react_1.useMemo)(() => {
        let caller = voipClient.callerInfo;
        const callback = (cb) => voipClient.on('stateChanged', () => {
            caller = voipClient.callerInfo;
            cb();
        });
        const getSnapshot = () => caller;
        return [callback, getSnapshot];
    }, [voipClient]);
    return (0, shim_1.useSyncExternalStore)(subscribe, getSnapshot);
};
exports.useCallerInfo = useCallerInfo;
const useCallCreateRoom = () => {
    const context = (0, react_1.useContext)(exports.CallContext);
    if (!isCallContextReady(context)) {
        throw new Error('useCallCreateRoom only if Calls are enabled and ready');
    }
    return context.createRoom;
};
exports.useCallCreateRoom = useCallCreateRoom;
const useCallOpenRoom = () => {
    const context = (0, react_1.useContext)(exports.CallContext);
    if (!isCallContextReady(context)) {
        throw new Error('useCallOpenRoom only if Calls are enabled and ready');
    }
    return context.openRoom;
};
exports.useCallOpenRoom = useCallOpenRoom;
const useCallClient = () => {
    const context = (0, react_1.useContext)(exports.CallContext);
    if (!isCallContextReady(context)) {
        throw new Error('useCallClient only if Calls are enabled and ready');
    }
    return context.voipClient;
};
exports.useCallClient = useCallClient;
const useQueueName = () => {
    const context = (0, react_1.useContext)(exports.CallContext);
    if (!isCallContextReady(context)) {
        throw new Error('useQueueName only if Calls are enabled and ready');
    }
    return context.queueName;
};
exports.useQueueName = useQueueName;
const useQueueCounter = () => {
    const context = (0, react_1.useContext)(exports.CallContext);
    if (!isCallContextReady(context)) {
        throw new Error('useQueueCounter only if Calls are enabled and ready');
    }
    return context.queueCounter;
};
exports.useQueueCounter = useQueueCounter;
const useOpenedRoomInfo = () => {
    const context = (0, react_1.useContext)(exports.CallContext);
    if (!isCallContextReady(context)) {
        throw new Error('useOpenedRoomInfo only if Calls are enabled and ready');
    }
    return context.openedRoomInfo;
};
exports.useOpenedRoomInfo = useOpenedRoomInfo;
const useChangeAudioOutputDevice = () => {
    const context = (0, react_1.useContext)(exports.CallContext);
    if (!isCallContextReady(context)) {
        throw new Error('useChangeAudioOutputDevice only if Calls are enabled and ready');
    }
    return context.changeAudioOutputDevice;
};
exports.useChangeAudioOutputDevice = useChangeAudioOutputDevice;
const useChangeAudioInputDevice = () => {
    const context = (0, react_1.useContext)(exports.CallContext);
    if (!isCallContextReady(context)) {
        throw new Error('useChangeAudioInputDevice only if Calls are enabled and ready');
    }
    return context.changeAudioInputDevice;
};
exports.useChangeAudioInputDevice = useChangeAudioInputDevice;
const useCallRegisterClient = () => {
    const context = (0, react_1.useContext)(exports.CallContext);
    if (!isCallContextReady(context)) {
        throw new Error('useCallRegisterClient only if Calls are enabled and ready');
    }
    return context.register;
};
exports.useCallRegisterClient = useCallRegisterClient;
const useCallUnregisterClient = () => {
    const context = (0, react_1.useContext)(exports.CallContext);
    if (!isCallContextReady(context)) {
        throw new Error('useCallUnregisterClient only if Calls are enabled and ready');
    }
    return context.unregister;
};
exports.useCallUnregisterClient = useCallUnregisterClient;
const useVoipOutboundStates = () => {
    const isEnterprise = (0, exports.useIsVoipEnterprise)();
    const callerInfo = (0, exports.useCallerInfo)();
    return {
        outBoundCallsAllowed: isEnterprise,
        outBoundCallsEnabled: isEnterprise,
        outBoundCallsEnabledForUser: isEnterprise && !['IN_CALL', 'ON_HOLD', 'UNREGISTERED', 'INITIAL'].includes(callerInfo.state),
    };
};
exports.useVoipOutboundStates = useVoipOutboundStates;
const useVoipNetworkStatus = () => {
    const context = (0, react_1.useContext)(exports.CallContext);
    if (!isCallContextReady(context)) {
        throw new Error('useVoipNetworkStatus only if Calls are enabled and ready');
    }
    return context.networkStatus;
};
exports.useVoipNetworkStatus = useVoipNetworkStatus;
