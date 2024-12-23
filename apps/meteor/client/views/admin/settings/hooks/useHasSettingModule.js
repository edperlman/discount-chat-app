"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHasSettingModule = void 0;
const react_1 = require("react");
const useLicense_1 = require("../../../../hooks/useLicense");
const useHasSettingModule = (setting) => {
    var _a;
    const { data } = (0, useLicense_1.useLicenseBase)({
        select: (data) => ({ isEnterprise: Boolean(data === null || data === void 0 ? void 0 : data.license.license), activeModules: data === null || data === void 0 ? void 0 : data.license.activeModules }),
    });
    const isEnterprise = (_a = data === null || data === void 0 ? void 0 : data.isEnterprise) !== null && _a !== void 0 ? _a : false;
    const hasSettingModule = (0, react_1.useMemo)(() => {
        if (!(setting === null || setting === void 0 ? void 0 : setting.modules) || (setting === null || setting === void 0 ? void 0 : setting.modules.length) === 0) {
            return false;
        }
        return setting.modules.every((module) => data === null || data === void 0 ? void 0 : data.activeModules.includes(module));
    }, [data === null || data === void 0 ? void 0 : data.activeModules, setting === null || setting === void 0 ? void 0 : setting.modules]);
    if (!setting) {
        throw new Error('No setting provided');
    }
    return isEnterprise && hasSettingModule;
};
exports.useHasSettingModule = useHasSettingModule;
