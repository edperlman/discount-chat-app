"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLongPress = useLongPress;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
function useLongPress(onLongPress, options) {
    const isLongPress = (0, react_1.useRef)(false);
    const timerRef = (0, react_1.useRef)();
    const startPressTimer = (0, fuselage_hooks_1.useMutableCallback)(() => {
        var _a;
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            onLongPress();
        }, (_a = options === null || options === void 0 ? void 0 : options.threshold) !== null && _a !== void 0 ? _a : 700);
    });
    const handleOnClick = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        if (isLongPress.current || !(options === null || options === void 0 ? void 0 : options.onClick)) {
            return;
        }
        options.onClick(e);
    });
    const handleOnMouseDown = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        var _a;
        startPressTimer();
        (_a = options === null || options === void 0 ? void 0 : options.onMouseDown) === null || _a === void 0 ? void 0 : _a.call(options, e);
    });
    const handleOnMouseUp = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        var _a;
        clearTimeout(timerRef.current);
        (_a = options === null || options === void 0 ? void 0 : options.onMouseUp) === null || _a === void 0 ? void 0 : _a.call(options, e);
    });
    const handleOnTouchStart = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        var _a;
        startPressTimer();
        (_a = options === null || options === void 0 ? void 0 : options.onTouchStart) === null || _a === void 0 ? void 0 : _a.call(options, e);
    });
    const handleOnTouchEnd = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        clearTimeout(timerRef.current);
        if (options === null || options === void 0 ? void 0 : options.onTouchEnd) {
            options.onTouchEnd(e);
        }
    });
    return {
        onClick: handleOnClick,
        onMouseDown: handleOnMouseDown,
        onMouseUp: handleOnMouseUp,
        onTouchStart: handleOnTouchStart,
        onTouchEnd: handleOnTouchEnd,
    };
}
