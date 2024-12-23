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
require("./Thumbnail.scss");
const fuselage_1 = require("@rocket.chat/fuselage");
const ScreenThumbnailWrapper = (_a) => {
    var { children, onClick, width = '120px', height = '170px', padding = '20px' } = _a, props = __rest(_a, ["children", "onClick", "width", "height", "padding"]);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { w: width, h: height, className: 'screen-thumbnail-wrapper', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: width, h: height, position: "absolute", className: "screenThumbnailBackdrop", onClick: onClick }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ w: `calc(${width} - ${padding})`, h: `calc(${height} - ${padding})`, position: "relative", overflow: "hidden", onClick: onClick }, props, { children: children }))] }));
};
exports.default = ScreenThumbnailWrapper;
