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
const VideoConfButton = (_a) => {
    var { primary, secondary, danger, disabled, icon, children } = _a, props = __rest(_a, ["primary", "secondary", "danger", "disabled", "icon", "children"]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Button, Object.assign({ icon: icon, width: '100%', primary: primary, danger: danger, secondary: secondary, disabled: disabled }, props, { children: children })));
};
exports.default = VideoConfButton;
