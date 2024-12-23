"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLicenseLimitsByBehavior = void 0;
const validateLimit_1 = require("@rocket.chat/license/src/validation/validateLimit");
const useLicense_1 = require("./useLicense");
const useLicenseLimitsByBehavior = () => {
    const result = (0, useLicense_1.useLicense)({ loadValues: true });
    if (result.isLoading || result.isError) {
        return null;
    }
    const { license, limits } = result.data;
    if (!license || !limits) {
        return null;
    }
    const keyLimits = Object.keys(limits);
    // Get the rule with the highest limit that applies to this key
    const rules = keyLimits
        .map((key) => {
        var _a;
        const rule = (_a = license.limits[key]) === null || _a === void 0 ? void 0 : _a.filter((limit) => { var _a; return (0, validateLimit_1.validateWarnLimit)(limit.max, (_a = limits[key].value) !== null && _a !== void 0 ? _a : 0, limit.behavior); }).reduce((maxLimit, currentLimit) => (!maxLimit || currentLimit.max > maxLimit.max ? currentLimit : maxLimit), null);
        if (!rule) {
            return undefined;
        }
        if (rule.max === 0) {
            return undefined;
        }
        if (rule.max === -1) {
            return undefined;
        }
        return [key, rule.behavior];
    })
        .filter(Boolean);
    if (!rules.length) {
        return null;
    }
    // Group by behavior
    return rules.reduce((acc, [key, behavior]) => {
        if (!acc[behavior]) {
            acc[behavior] = [];
        }
        acc[behavior].push(key);
        return acc;
    }, {});
};
exports.useLicenseLimitsByBehavior = useLicenseLimitsByBehavior;
