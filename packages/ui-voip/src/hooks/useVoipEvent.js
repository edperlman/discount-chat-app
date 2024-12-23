"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipEvent = void 0;
const react_1 = require("react");
const shim_1 = require("use-sync-external-store/shim");
const VoipContext_1 = require("../contexts/VoipContext");
const useVoipEvent = (eventName, initialValue) => {
    const { voipClient } = (0, react_1.useContext)(VoipContext_1.VoipContext);
    const initValue = (0, react_1.useRef)(initialValue);
    const [subscribe, getSnapshot] = (0, react_1.useMemo)(() => {
        let state = initValue.current;
        const getSnapshot = () => state;
        const callback = (cb) => {
            if (!voipClient)
                return () => undefined;
            return voipClient.on(eventName, (event) => {
                state = event;
                cb();
            });
        };
        return [callback, getSnapshot];
    }, [eventName, voipClient]);
    return (0, shim_1.useSyncExternalStore)(subscribe, getSnapshot);
};
exports.useVoipEvent = useVoipEvent;
