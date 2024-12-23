"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResizeInlineBreakpoint = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const useResizeInlineBreakpoint = (sizes = [], debounceDelay = 0) => {
    const { ref, borderBoxSize } = (0, fuselage_hooks_1.useResizeObserver)({ debounceDelay });
    const inlineSize = borderBoxSize ? borderBoxSize.inlineSize : 0;
    const stableSizes = (0, fuselage_hooks_1.useStableArray)(sizes);
    const newSizes = (0, react_1.useMemo)(() => stableSizes.map((current) => (inlineSize ? inlineSize > current : true)), [inlineSize, stableSizes]);
    return [ref, ...newSizes];
};
exports.useResizeInlineBreakpoint = useResizeInlineBreakpoint;
