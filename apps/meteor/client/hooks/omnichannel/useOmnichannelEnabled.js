"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOmnichannelEnabled = void 0;
const useOmnichannel_1 = require("./useOmnichannel");
const useOmnichannelEnabled = () => (0, useOmnichannel_1.useOmnichannel)().enabled;
exports.useOmnichannelEnabled = useOmnichannelEnabled;
