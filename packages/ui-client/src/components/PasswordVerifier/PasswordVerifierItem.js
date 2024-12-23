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
exports.PasswordVerifierItem = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const variants = {
    success: {
        icon: 'success-circle',
        color: 'status-font-on-success',
    },
    error: {
        icon: 'error-circle',
        color: 'status-font-on-danger',
    },
};
const PasswordVerifierItem = (_a) => {
    var { text, isValid, vertical } = _a, props = __rest(_a, ["text", "isValid", "vertical"]);
    const { icon, color } = variants[isValid ? 'success' : 'error'];
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({ display: 'flex', flexBasis: vertical ? '100%' : '50%', alignItems: 'center', mbe: 8, fontScale: 'c1', color: color, role: 'listitem', "aria-label": text }, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: icon, color: color, size: 'x16', mie: 4 }), (0, jsx_runtime_1.jsx)("span", { "aria-hidden": true, children: text })] })));
};
exports.PasswordVerifierItem = PasswordVerifierItem;
