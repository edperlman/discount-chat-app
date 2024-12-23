"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsSelfHosted = void 0;
const useStatistics_1 = require("../views/hooks/useStatistics");
const useIsSelfHosted = () => {
    var _a;
    const { data, isLoading } = (0, useStatistics_1.useStatistics)();
    const isSelfHosted = ((_a = data === null || data === void 0 ? void 0 : data.deploy) === null || _a === void 0 ? void 0 : _a.platform) !== 'rocket-cloud';
    return { isSelfHosted, isLoading };
};
exports.useIsSelfHosted = useIsSelfHosted;
