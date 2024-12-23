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
const PageFooter = (_a) => {
    var { children, isDirty } = _a, props = __rest(_a, ["children", "isDirty"]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.AnimatedVisibility, { visibility: isDirty ? fuselage_1.AnimatedVisibility.VISIBLE : fuselage_1.AnimatedVisibility.HIDDEN, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ elevation: '1', borderWidth: 0, borderColor: 'transparent', minHeight: 'x64', pb: 8 }, props, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ height: '100%', marginInline: 24, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'end', color: 'default' }, props, { children: children })) })) }));
};
exports.default = PageFooter;
