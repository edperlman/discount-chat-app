"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const react_i18next_1 = require("react-i18next");
const VoipPopup_1 = __importDefault(require("../components/VoipPopup"));
const VoipPopupPortal_1 = __importDefault(require("../components/VoipPopupPortal"));
const VoipContext_1 = require("../contexts/VoipContext");
const useVoipClient_1 = require("../hooks/useVoipClient");
const useVoipSounds_1 = require("../hooks/useVoipSounds");
const VoipProvider = ({ children }) => {
    // Settings
    const isVoipSettingEnabled = (0, ui_contexts_1.useSetting)('VoIP_TeamCollab_Enabled', false);
    const canViewVoipRegistrationInfo = (0, ui_contexts_1.usePermission)('view-user-voip-extension');
    const isVoipEnabled = isVoipSettingEnabled && canViewVoipRegistrationInfo;
    const [isLocalRegistered, setStorageRegistered] = (0, fuselage_hooks_1.useLocalStorage)('voip-registered', true);
    // Hooks
    const { t } = (0, react_i18next_1.useTranslation)();
    const voipSounds = (0, useVoipSounds_1.useVoipSounds)();
    const { voipClient, error } = (0, useVoipClient_1.useVoipClient)({
        enabled: isVoipEnabled,
        autoRegister: isLocalRegistered,
    });
    const setOutputMediaDevice = (0, ui_contexts_1.useSetOutputMediaDevice)();
    const setInputMediaDevice = (0, ui_contexts_1.useSetInputMediaDevice)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    // Refs
    const remoteAudioMediaRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!voipClient) {
            return;
        }
        const onBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = true;
        };
        const onCallEstablished = () => __awaiter(void 0, void 0, void 0, function* () {
            voipSounds.stopAll();
            window.addEventListener('beforeunload', onBeforeUnload);
            if (voipClient.isCallee() && remoteAudioMediaRef.current) {
                voipClient.switchMediaRenderer({ remoteMediaElement: remoteAudioMediaRef.current });
            }
        });
        const onNetworkDisconnected = () => {
            if (voipClient.isOngoing()) {
                voipClient.endCall();
            }
        };
        const onOutgoingCallRinging = () => {
            voipSounds.play('outbound-call-ringing');
        };
        const onIncomingCallRinging = () => {
            voipSounds.play('telephone');
        };
        const onCallTerminated = () => {
            voipSounds.play('call-ended', false);
            voipSounds.stopAll();
            window.removeEventListener('beforeunload', onBeforeUnload);
        };
        const onRegistrationError = () => {
            setStorageRegistered(false);
            dispatchToastMessage({ type: 'error', message: t('Voice_calling_registration_failed') });
        };
        const onRegistered = () => {
            setStorageRegistered(true);
        };
        const onUnregister = () => {
            setStorageRegistered(false);
        };
        voipClient.on('incomingcall', onIncomingCallRinging);
        voipClient.on('outgoingcall', onOutgoingCallRinging);
        voipClient.on('callestablished', onCallEstablished);
        voipClient.on('callterminated', onCallTerminated);
        voipClient.on('registrationerror', onRegistrationError);
        voipClient.on('registered', onRegistered);
        voipClient.on('unregistered', onUnregister);
        voipClient.networkEmitter.on('disconnected', onNetworkDisconnected);
        voipClient.networkEmitter.on('connectionerror', onNetworkDisconnected);
        voipClient.networkEmitter.on('localnetworkoffline', onNetworkDisconnected);
        return () => {
            voipClient.off('incomingcall', onIncomingCallRinging);
            voipClient.off('outgoingcall', onOutgoingCallRinging);
            voipClient.off('callestablished', onCallEstablished);
            voipClient.off('callterminated', onCallTerminated);
            voipClient.off('registrationerror', onRegistrationError);
            voipClient.off('registered', onRegistered);
            voipClient.off('unregistered', onUnregister);
            voipClient.networkEmitter.off('disconnected', onNetworkDisconnected);
            voipClient.networkEmitter.off('connectionerror', onNetworkDisconnected);
            voipClient.networkEmitter.off('localnetworkoffline', onNetworkDisconnected);
            window.removeEventListener('beforeunload', onBeforeUnload);
        };
    }, [dispatchToastMessage, setStorageRegistered, t, voipClient, voipSounds]);
    const changeAudioOutputDevice = (0, fuselage_hooks_1.useEffectEvent)((selectedAudioDevice) => __awaiter(void 0, void 0, void 0, function* () {
        if (!remoteAudioMediaRef.current) {
            return;
        }
        setOutputMediaDevice({ outputDevice: selectedAudioDevice, HTMLAudioElement: remoteAudioMediaRef.current });
    }));
    const changeAudioInputDevice = (0, fuselage_hooks_1.useEffectEvent)((selectedAudioDevice) => __awaiter(void 0, void 0, void 0, function* () {
        if (!voipClient) {
            return;
        }
        yield voipClient.changeAudioInputDevice({ audio: { deviceId: { exact: selectedAudioDevice.id } } });
        setInputMediaDevice(selectedAudioDevice);
    }));
    const contextValue = (0, react_1.useMemo)(() => {
        if (!isVoipEnabled) {
            return {
                isEnabled: false,
                voipClient: null,
                error: null,
                changeAudioInputDevice,
                changeAudioOutputDevice,
            };
        }
        if (!voipClient || error) {
            return {
                isEnabled: true,
                voipClient: null,
                error,
                changeAudioInputDevice,
                changeAudioOutputDevice,
            };
        }
        return {
            isEnabled: true,
            voipClient,
            changeAudioInputDevice,
            changeAudioOutputDevice,
        };
    }, [voipClient, isVoipEnabled, error, changeAudioInputDevice, changeAudioOutputDevice]);
    return ((0, jsx_runtime_1.jsxs)(VoipContext_1.VoipContext.Provider, { value: contextValue, children: [children, contextValue.isEnabled &&
                (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)("audio", { ref: remoteAudioMediaRef, children: (0, jsx_runtime_1.jsx)("track", { kind: 'captions' }) }), document.body), (0, jsx_runtime_1.jsx)(VoipPopupPortal_1.default, { children: (0, jsx_runtime_1.jsx)(VoipPopup_1.default, { position: { bottom: 132, right: 24 } }) })] }));
};
exports.default = VoipProvider;
