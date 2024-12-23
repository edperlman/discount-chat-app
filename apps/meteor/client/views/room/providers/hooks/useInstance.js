"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInstance = useInstance;
const react_1 = require("react");
const useDepsMatch_1 = require("./useDepsMatch");
function useInstance(factory, deps) {
    var _a, _b;
    const ref = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => () => {
        var _a, _b;
        (_b = (_a = ref.current) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.call(_a);
    }, []);
    const depsMatch = (0, useDepsMatch_1.useDepsMatch)(deps);
    if (!ref.current || !depsMatch) {
        (_b = (_a = ref.current) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.call(_a);
        ref.current = factory();
    }
    return ref.current[0];
}
