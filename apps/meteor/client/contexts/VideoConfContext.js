"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVideoConfManager = exports.useVideoConfPreferences = exports.useVideoConfCapabilities = exports.useVideoConfIsCalling = exports.useVideoConfIsRinging = exports.useVideoConfSetPreferences = exports.useVideoConfIncomingCalls = exports.useVideoConfRejectIncomingCall = exports.useVideoConfAbortCall = exports.useVideoConfDismissCall = exports.useVideoConfJoinCall = exports.useVideoConfAcceptCall = exports.useVideoConfStartCall = exports.useVideoConfDismissOutgoing = exports.useVideoConfDispatchOutgoing = exports.VideoConfContext = void 0;
const react_1 = require("react");
const shim_1 = require("use-sync-external-store/shim");
exports.VideoConfContext = (0, react_1.createContext)(undefined);
const useVideoConfContext = () => {
    const context = (0, react_1.useContext)(exports.VideoConfContext);
    if (!context) {
        throw new Error('Must be running in VideoConf Context');
    }
    return context;
};
const useVideoConfDispatchOutgoing = () => useVideoConfContext().dispatchOutgoing;
exports.useVideoConfDispatchOutgoing = useVideoConfDispatchOutgoing;
const useVideoConfDismissOutgoing = () => useVideoConfContext().dismissOutgoing;
exports.useVideoConfDismissOutgoing = useVideoConfDismissOutgoing;
const useVideoConfStartCall = () => useVideoConfContext().startCall;
exports.useVideoConfStartCall = useVideoConfStartCall;
const useVideoConfAcceptCall = () => useVideoConfContext().acceptCall;
exports.useVideoConfAcceptCall = useVideoConfAcceptCall;
const useVideoConfJoinCall = () => useVideoConfContext().joinCall;
exports.useVideoConfJoinCall = useVideoConfJoinCall;
const useVideoConfDismissCall = () => useVideoConfContext().dismissCall;
exports.useVideoConfDismissCall = useVideoConfDismissCall;
const useVideoConfAbortCall = () => useVideoConfContext().abortCall;
exports.useVideoConfAbortCall = useVideoConfAbortCall;
const useVideoConfRejectIncomingCall = () => useVideoConfContext().rejectIncomingCall;
exports.useVideoConfRejectIncomingCall = useVideoConfRejectIncomingCall;
const useVideoConfIncomingCalls = () => {
    const { queryIncomingCalls } = useVideoConfContext();
    return (0, shim_1.useSyncExternalStore)(queryIncomingCalls.subscribe, queryIncomingCalls.getSnapshot);
};
exports.useVideoConfIncomingCalls = useVideoConfIncomingCalls;
const useVideoConfSetPreferences = () => useVideoConfContext().setPreferences;
exports.useVideoConfSetPreferences = useVideoConfSetPreferences;
const useVideoConfIsRinging = () => {
    const { queryRinging } = useVideoConfContext();
    return (0, shim_1.useSyncExternalStore)(queryRinging.subscribe, queryRinging.getSnapshot);
};
exports.useVideoConfIsRinging = useVideoConfIsRinging;
const useVideoConfIsCalling = () => {
    const { queryCalling } = useVideoConfContext();
    return (0, shim_1.useSyncExternalStore)(queryCalling.subscribe, queryCalling.getSnapshot);
};
exports.useVideoConfIsCalling = useVideoConfIsCalling;
const useVideoConfCapabilities = () => {
    const { queryCapabilities } = useVideoConfContext();
    return (0, shim_1.useSyncExternalStore)(queryCapabilities.subscribe, queryCapabilities.getSnapshot);
};
exports.useVideoConfCapabilities = useVideoConfCapabilities;
const useVideoConfPreferences = () => {
    const { queryPreferences } = useVideoConfContext();
    return (0, shim_1.useSyncExternalStore)(queryPreferences.subscribe, queryPreferences.getSnapshot);
};
exports.useVideoConfPreferences = useVideoConfPreferences;
const useVideoConfManager = () => { var _a; return (_a = (0, react_1.useContext)(exports.VideoConfContext)) === null || _a === void 0 ? void 0 : _a.manager; };
exports.useVideoConfManager = useVideoConfManager;
