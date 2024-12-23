"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipState = void 0;
const react_1 = require("react");
const VoipContext_1 = require("../contexts/VoipContext");
const useVoipEffect_1 = require("./useVoipEffect");
const DEFAULT_STATE = {
    isRegistered: false,
    isReady: false,
    isInCall: false,
    isOnline: false,
    isIncoming: false,
    isOngoing: false,
    isOutgoing: false,
    isError: false,
};
const useVoipState = () => {
    const { isEnabled, error: clientError } = (0, react_1.useContext)(VoipContext_1.VoipContext);
    const callState = (0, useVoipEffect_1.useVoipEffect)((client) => client.getState(), DEFAULT_STATE);
    return (0, react_1.useMemo)(() => (Object.assign(Object.assign({}, callState), { clientError,
        isEnabled, isError: !!clientError || callState.isError })), [clientError, isEnabled, callState]);
};
exports.useVoipState = useVoipState;
