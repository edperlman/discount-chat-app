"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOmnichannel = void 0;
const react_1 = require("react");
const OmnichannelContext_1 = require("../../contexts/OmnichannelContext");
const useOmnichannel = () => (0, react_1.useContext)(OmnichannelContext_1.OmnichannelContext);
exports.useOmnichannel = useOmnichannel;
