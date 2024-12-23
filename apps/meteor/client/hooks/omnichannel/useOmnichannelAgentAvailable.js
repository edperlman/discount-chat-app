"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOmnichannelAgentAvailable = void 0;
const useOmnichannel_1 = require("./useOmnichannel");
const useOmnichannelAgentAvailable = () => (0, useOmnichannel_1.useOmnichannel)().agentAvailable;
exports.useOmnichannelAgentAvailable = useOmnichannelAgentAvailable;
