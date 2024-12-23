"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePreventPropagation = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const usePreventPropagation = (fn) => {
    const preventClickPropagation = (0, fuselage_hooks_1.useEffectEvent)((e) => {
        e.stopPropagation();
        fn === null || fn === void 0 ? void 0 : fn(e);
    });
    return preventClickPropagation;
};
exports.usePreventPropagation = usePreventPropagation;
