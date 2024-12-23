"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDepsMatch = void 0;
const react_1 = require("react");
const depsMatch = (a, b) => a.every((value, index) => Object.is(value, b[index]));
const useDepsMatch = (deps) => {
    const prevDepsRef = (0, react_1.useRef)(deps);
    const { current: prevDeps } = prevDepsRef;
    const match = depsMatch(prevDeps, deps);
    prevDepsRef.current = deps;
    return match;
};
exports.useDepsMatch = useDepsMatch;
