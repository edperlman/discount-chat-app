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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const GenericResourceUsage = (_a) => {
    var { title, value, max, percentage, threshold = 80, variant = percentage < threshold ? 'success' : 'danger', subTitle, tooltip } = _a, props = __rest(_a, ["title", "value", "max", "percentage", "threshold", "variant", "subTitle", "tooltip"]);
    const labelId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({ title: tooltip, w: 'x180', h: 'x40', mi: 8, fontScale: 'c1', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', justifyContent: 'space-between', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'default', id: labelId, children: title }), subTitle && (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'hint', children: subTitle }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'hint', children: [value, "/", max] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.ProgressBar, { percentage: percentage, variant: variant, role: 'progressbar', "aria-labelledby": labelId, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": percentage })] })));
};
exports.default = GenericResourceUsage;
