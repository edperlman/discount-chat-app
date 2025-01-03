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
const react_1 = __importDefault(require("react"));
const GenericResourceUsageSkeleton = (_a) => {
    var { title } = _a, props = __rest(_a, ["title"]);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({ w: 'x180', h: 'x40', mi: 8, fontScale: 'c1', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }, props, { children: [title ? (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'default', children: title }) : (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { w: 'full' }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { w: 'full' })] })));
};
exports.default = GenericResourceUsageSkeleton;