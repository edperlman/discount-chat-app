"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQueuedInquiries = void 0;
const useOmnichannel_1 = require("./useOmnichannel");
const useQueuedInquiries = () => (0, useOmnichannel_1.useOmnichannel)().inquiries;
exports.useQueuedInquiries = useQueuedInquiries;
