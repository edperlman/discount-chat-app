"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const VideoConfContext_1 = require("../contexts/VideoConfContext");
const VideoConfManager_1 = require("../lib/VideoConfManager");
const VideoConfPopups_1 = __importDefault(require("../views/room/contextualBar/VideoConference/VideoConfPopups"));
const useVideoConfOpenCall_1 = require("../views/room/contextualBar/VideoConference/hooks/useVideoConfOpenCall");
const VideoConfContextProvider = ({ children }) => {
    const [outgoing, setOutgoing] = (0, react_1.useState)();
    const handleOpenCall = (0, useVideoConfOpenCall_1.useVideoConfOpenCall)();
    (0, react_1.useEffect)(() => VideoConfManager_1.VideoConfManager.on('call/join', (props) => {
        handleOpenCall(props.url, props.providerName);
    }), [handleOpenCall]);
    (0, react_1.useEffect)(() => {
        VideoConfManager_1.VideoConfManager.on('direct/stopped', () => setOutgoing(undefined));
        VideoConfManager_1.VideoConfManager.on('calling/ended', () => setOutgoing(undefined));
    }, []);
    const contextValue = (0, react_1.useMemo)(() => ({
        manager: VideoConfManager_1.VideoConfManager,
        dispatchOutgoing: (option) => setOutgoing(Object.assign(Object.assign({}, option), { id: option.rid })),
        dismissOutgoing: () => setOutgoing(undefined),
        startCall: (rid, confTitle) => VideoConfManager_1.VideoConfManager.startCall(rid, confTitle),
        acceptCall: (callId) => VideoConfManager_1.VideoConfManager.acceptIncomingCall(callId),
        joinCall: (callId) => VideoConfManager_1.VideoConfManager.joinCall(callId),
        dismissCall: (callId) => {
            VideoConfManager_1.VideoConfManager.dismissIncomingCall(callId);
        },
        rejectIncomingCall: (callId) => VideoConfManager_1.VideoConfManager.rejectIncomingCall(callId),
        abortCall: () => VideoConfManager_1.VideoConfManager.abortCall(),
        setPreferences: (prefs) => VideoConfManager_1.VideoConfManager.setPreferences(prefs),
        queryIncomingCalls: {
            getSnapshot: () => VideoConfManager_1.VideoConfManager.getIncomingDirectCalls(),
            subscribe: (cb) => VideoConfManager_1.VideoConfManager.on('incoming/changed', cb),
        },
        queryRinging: {
            getSnapshot: () => VideoConfManager_1.VideoConfManager.isRinging(),
            subscribe: (cb) => VideoConfManager_1.VideoConfManager.on('ringing/changed', cb),
        },
        queryCalling: {
            getSnapshot: () => VideoConfManager_1.VideoConfManager.isCalling(),
            subscribe: (cb) => VideoConfManager_1.VideoConfManager.on('calling/changed', cb),
        },
        queryCapabilities: {
            getSnapshot: () => VideoConfManager_1.VideoConfManager.capabilities,
            subscribe: (cb) => VideoConfManager_1.VideoConfManager.on('capabilities/changed', cb),
        },
        queryPreferences: {
            getSnapshot: () => VideoConfManager_1.VideoConfManager.preferences,
            subscribe: (cb) => VideoConfManager_1.VideoConfManager.on('preference/changed', cb),
        },
    }), []);
    return ((0, jsx_runtime_1.jsxs)(VideoConfContext_1.VideoConfContext.Provider, { value: contextValue, children: [children, (0, jsx_runtime_1.jsx)(VideoConfPopups_1.default, { children: outgoing })] }));
};
exports.default = VideoConfContextProvider;
