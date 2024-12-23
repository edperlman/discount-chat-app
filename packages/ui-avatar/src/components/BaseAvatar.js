"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const BaseAvatar = (_a) => {
    var { url, onLoad, onError } = _a, props = __rest(_a, ["url", "onLoad", "onError"]);
    const [unloaded, setUnloaded] = (0, react_1.useState)(false);
    const prevUrl = (0, fuselage_hooks_1.usePrevious)(url);
    const handleLoad = (0, fuselage_hooks_1.useEffectEvent)((event) => {
        setUnloaded(false);
        onLoad === null || onLoad === void 0 ? void 0 : onLoad(event);
    });
    const handleError = (0, fuselage_hooks_1.useEffectEvent)((event) => {
        setUnloaded(true);
        onError === null || onError === void 0 ? void 0 : onError(event);
    });
    if (unloaded && url === prevUrl) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, Object.assign({ "aria-hidden": 'true', variant: 'rect' }, props));
    }
    return (0, jsx_runtime_1.jsx)(fuselage_1.Avatar, Object.assign({ "aria-hidden": 'true', onLoad: handleLoad, onError: handleError, url: url }, props));
};
exports.default = BaseAvatar;
