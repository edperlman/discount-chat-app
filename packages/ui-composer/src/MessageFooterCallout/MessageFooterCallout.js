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
const react_1 = require("react");
const MessageFooterCallout = (0, react_1.forwardRef)(function MessageFooterCallout(_a, ref) {
    var { dashed } = _a, props = __rest(_a, ["dashed"]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ ref: ref }, (dashed && {
        borderStyle: 'dashed',
    }), { display: 'flex', borderWidth: 2, borderColor: 'light', borderRadius: 'x4', p: 8, mbe: 24, backgroundColor: 'surface-tint', alignItems: 'center', minHeight: 'x48', justifyContent: 'center', color: 'default' }, props)));
});
exports.default = MessageFooterCallout;
