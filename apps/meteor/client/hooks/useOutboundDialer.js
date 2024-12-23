"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOutboundDialer = void 0;
const CallContext_1 = require("../contexts/CallContext");
const EEVoipClient_1 = require("../lib/voip/EEVoipClient");
const useOutboundDialer = () => {
    const voipClient = (0, CallContext_1.useCallClient)();
    const isEnterprise = (0, CallContext_1.useIsVoipEnterprise)();
    const isOutboundClient = voipClient instanceof EEVoipClient_1.EEVoipClient;
    return isEnterprise && isOutboundClient ? voipClient : null;
};
exports.useOutboundDialer = useOutboundDialer;
