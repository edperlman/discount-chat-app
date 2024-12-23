"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReactiveVar = void 0;
const react_1 = require("react");
const useReactiveValue_1 = require("./useReactiveValue");
/** @deprecated */
const useReactiveVar = (variable) => (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => variable.get(), [variable]));
exports.useReactiveVar = useReactiveVar;
