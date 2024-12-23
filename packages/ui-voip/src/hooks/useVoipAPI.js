"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipAPI = void 0;
const react_1 = require("react");
const VoipContext_1 = require("../contexts/VoipContext");
const NOOP = (..._args) => undefined;
const useVoipAPI = () => {
    const context = (0, react_1.useContext)(VoipContext_1.VoipContext);
    return (0, react_1.useMemo)(() => {
        if (!(0, VoipContext_1.isVoipContextReady)(context)) {
            return {
                makeCall: NOOP,
                endCall: NOOP,
                register: NOOP,
                unregister: NOOP,
                openDialer: NOOP,
                closeDialer: NOOP,
                transferCall: NOOP,
                changeAudioInputDevice: NOOP,
                changeAudioOutputDevice: NOOP,
                onRegisteredOnce: NOOP,
                onUnregisteredOnce: NOOP,
            };
        }
        const { voipClient, changeAudioInputDevice, changeAudioOutputDevice } = context;
        return {
            makeCall: voipClient.call,
            endCall: voipClient.endCall,
            register: voipClient.register,
            unregister: voipClient.unregister,
            transferCall: voipClient.transfer,
            openDialer: () => voipClient.notifyDialer({ open: true }),
            closeDialer: () => voipClient.notifyDialer({ open: false }),
            changeAudioInputDevice,
            changeAudioOutputDevice,
            onRegisteredOnce: (cb) => voipClient.once('registered', cb),
            onUnregisteredOnce: (cb) => voipClient.once('unregistered', cb),
        };
    }, [context]);
};
exports.useVoipAPI = useVoipAPI;
