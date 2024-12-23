"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useShouldPreventAction = void 0;
const useLicense_1 = require("./useLicense");
const useShouldPreventAction = (action) => {
    const { data: { preventedActions } = {} } = (0, useLicense_1.useLicense)();
    return Boolean(preventedActions === null || preventedActions === void 0 ? void 0 : preventedActions[action]);
};
exports.useShouldPreventAction = useShouldPreventAction;
