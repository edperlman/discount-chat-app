"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReactiveValue = void 0;
const react_1 = require("react");
const shim_1 = require("use-sync-external-store/shim");
const createReactiveSubscriptionFactory_1 = require("../lib/createReactiveSubscriptionFactory");
const useReactiveValue = (computeCurrentValue) => {
    const [subscribe, getSnapshot] = (0, react_1.useMemo)(() => (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)(computeCurrentValue)(), [computeCurrentValue]);
    return (0, shim_1.useSyncExternalStore)(subscribe, getSnapshot);
};
exports.useReactiveValue = useReactiveValue;
