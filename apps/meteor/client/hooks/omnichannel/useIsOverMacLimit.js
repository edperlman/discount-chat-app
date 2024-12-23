"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsOverMacLimit = void 0;
const useOmnichannel_1 = require("./useOmnichannel");
const useIsOverMacLimit = () => {
    const { isOverMacLimit } = (0, useOmnichannel_1.useOmnichannel)();
    return isOverMacLimit;
};
exports.useIsOverMacLimit = useIsOverMacLimit;
