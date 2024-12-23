"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOmnichannelEnterpriseEnabled = void 0;
const useOmnichannel_1 = require("./useOmnichannel");
const useOmnichannelEnterpriseEnabled = () => {
    const { enabled: isEnabled, isEnterprise } = (0, useOmnichannel_1.useOmnichannel)();
    return isEnabled && isEnterprise;
};
exports.useOmnichannelEnterpriseEnabled = useOmnichannelEnterpriseEnabled;
