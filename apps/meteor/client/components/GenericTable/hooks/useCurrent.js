"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCurrent = void 0;
const react_1 = require("react");
const useCurrent = (currentInitialValue = 0) => {
    const [current, setCurrent] = (0, react_1.useState)(currentInitialValue);
    return [current, setCurrent];
};
exports.useCurrent = useCurrent;
