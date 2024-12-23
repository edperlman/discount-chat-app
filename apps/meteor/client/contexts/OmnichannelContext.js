"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelContext = void 0;
const react_1 = require("react");
exports.OmnichannelContext = (0, react_1.createContext)({
    inquiries: { enabled: false },
    enabled: false,
    isEnterprise: false,
    agentAvailable: false,
    showOmnichannelQueueLink: false,
    isOverMacLimit: false,
    livechatPriorities: {
        data: [],
        isLoading: false,
        isError: false,
        enabled: false,
    },
});
