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
exports.VoipFooter = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const CallContext_1 = require("../../../contexts/CallContext");
const useVoipFooterMenu_1 = require("../../../hooks/useVoipFooterMenu");
const SidebarFooterDefault_1 = __importDefault(require("../SidebarFooterDefault"));
const VoipFooter_1 = __importDefault(require("./VoipFooter"));
const VoipFooter = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const callerInfo = (0, CallContext_1.useCallerInfo)();
    const callActions = (0, CallContext_1.useCallActions)();
    const dispatchEvent = (0, ui_contexts_1.useEndpoint)('POST', '/v1/voip/events');
    const createRoom = (0, CallContext_1.useCallCreateRoom)();
    const openRoom = (0, CallContext_1.useCallOpenRoom)();
    const queueCounter = (0, CallContext_1.useQueueCounter)();
    const queueName = (0, CallContext_1.useQueueName)();
    const openedRoomInfo = (0, CallContext_1.useOpenedRoomInfo)();
    const options = (0, useVoipFooterMenu_1.useVoipFooterMenu)();
    const [muted, setMuted] = (0, react_1.useState)(false);
    const [paused, setPaused] = (0, react_1.useState)(false);
    const isEnterprise = (0, CallContext_1.useIsVoipEnterprise)();
    const toggleMic = (0, react_1.useCallback)((state) => {
        state ? callActions.mute() : callActions.unmute();
        setMuted(state);
    }, [callActions]);
    const togglePause = (0, react_1.useCallback)((state) => {
        state ? callActions.pause() : callActions.resume();
        setMuted(false);
        setPaused(state);
    }, [callActions]);
    const getSubtitle = (state) => {
        const subtitles = {
            IN_CALL: t('In_progress'),
            OFFER_RECEIVED: t('Ringing'),
            OFFER_SENT: t('Calling'),
            ON_HOLD: t('On_Hold'),
        };
        return subtitles[state] || '';
    };
    if (!('caller' in callerInfo)) {
        return (0, jsx_runtime_1.jsx)(SidebarFooterDefault_1.default, {});
    }
    return ((0, jsx_runtime_1.jsx)(VoipFooter_1.default, { caller: callerInfo.caller, callerState: callerInfo.state, callActions: callActions, title: queueName || t('Phone_call'), subtitle: getSubtitle(callerInfo.state), muted: muted, paused: paused, toggleMic: toggleMic, togglePause: togglePause, createRoom: createRoom, openRoom: openRoom, callsInQueue: t('Calls_in_queue', { count: queueCounter }), dispatchEvent: dispatchEvent, openedRoomInfo: openedRoomInfo, isEnterprise: isEnterprise, options: options }));
};
exports.VoipFooter = VoipFooter;
