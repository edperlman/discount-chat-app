"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoipContext = exports.isVoipContextReady = void 0;
const react_1 = require("react");
const isVoipContextReady = (context) => context.isEnabled && context.voipClient !== null;
exports.isVoipContextReady = isVoipContextReady;
exports.VoipContext = (0, react_1.createContext)({
    isEnabled: false,
    voipClient: null,
});
