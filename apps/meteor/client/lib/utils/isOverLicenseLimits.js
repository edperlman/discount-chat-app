"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOverLicenseLimits = void 0;
const isOverLicenseLimits = (limits) => Object.values(limits).some((limit) => limit.value !== undefined && limit.max > 0 && limit.value > limit.max);
exports.isOverLicenseLimits = isOverLicenseLimits;
