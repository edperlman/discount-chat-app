"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipEffect = void 0;
const react_1 = require("react");
const shim_1 = require("use-sync-external-store/shim");
const VoipContext_1 = require("../contexts/VoipContext");
const useVoipEffect = (transform, initialValue) => {
    const { voipClient } = (0, react_1.useContext)(VoipContext_1.VoipContext);
    const stateRef = (0, react_1.useRef)(initialValue);
    const transformFn = (0, react_1.useRef)(transform);
    const getSnapshot = (0, react_1.useCallback)(() => stateRef.current, []);
    const subscribe = (0, react_1.useCallback)((cb) => {
        if (!voipClient)
            return () => undefined;
        stateRef.current = transformFn.current(voipClient);
        return voipClient.on('stateChanged', () => {
            stateRef.current = transformFn.current(voipClient);
            cb();
        });
    }, [voipClient]);
    return (0, shim_1.useSyncExternalStore)(subscribe, getSnapshot);
};
exports.useVoipEffect = useVoipEffect;
