"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsEnterprise = void 0;
const useLicense_1 = require("./useLicense");
const useIsEnterprise = () => {
    return (0, useLicense_1.useLicenseBase)({ select: (data) => ({ isEnterprise: Boolean(data === null || data === void 0 ? void 0 : data.license.license) }) });
};
exports.useIsEnterprise = useIsEnterprise;
