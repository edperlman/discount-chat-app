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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const CreateNewScreenButton = (_a) => {
    var { size = '60px', name = 'plus' } = _a, props = __rest(_a, ["size", "name"]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { width: size, height: size, children: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, Object.assign({}, props, { size: size, name: name, className: (0, css_in_js_1.css) `
          cursor: pointer;
          transition: var(--animation-default);
          &:hover {
            scale: 1.1;
            transition: var(--animation-default);
          }
        ` })) }));
};
exports.default = CreateNewScreenButton;
