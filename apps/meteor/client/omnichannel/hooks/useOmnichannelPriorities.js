"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOmnichannelPriorities = void 0;
const useOmnichannel_1 = require("../../hooks/omnichannel/useOmnichannel");
const useOmnichannelPriorities = () => (0, useOmnichannel_1.useOmnichannel)().livechatPriorities;
exports.useOmnichannelPriorities = useOmnichannelPriorities;
