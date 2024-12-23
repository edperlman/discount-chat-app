"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHasLicenseModule = void 0;
const useLicense_1 = require("./useLicense");
const useHasLicenseModule = (licenseName) => {
    var _a;
    return ((_a = (0, useLicense_1.useLicenseBase)({
        select: (data) => !!licenseName && data.license.activeModules.includes(licenseName),
    }).data) !== null && _a !== void 0 ? _a : 'loading');
};
exports.useHasLicenseModule = useHasLicenseModule;
