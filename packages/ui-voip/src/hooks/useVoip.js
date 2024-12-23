"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoip = void 0;
const react_1 = require("react");
const VoipContext_1 = require("../contexts/VoipContext");
const useVoipAPI_1 = require("./useVoipAPI");
const useVoipSession_1 = require("./useVoipSession");
const useVoipState_1 = require("./useVoipState");
const useVoip = () => {
    const { error } = (0, react_1.useContext)(VoipContext_1.VoipContext);
    const state = (0, useVoipState_1.useVoipState)();
    const session = (0, useVoipSession_1.useVoipSession)();
    const api = (0, useVoipAPI_1.useVoipAPI)();
    return (0, react_1.useMemo)(() => (Object.assign(Object.assign(Object.assign({}, state), api), { session,
        error })), [state, api, session, error]);
};
exports.useVoip = useVoip;
