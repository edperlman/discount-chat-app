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
exports.ExternalLink = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ExternalLink = (_a) => {
    var { children, to } = _a, props = __rest(_a, ["children", "to"]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'a', href: to, target: '_blank', rel: 'noopener noreferrer' }, props, { children: children || to })));
};
exports.ExternalLink = ExternalLink;
