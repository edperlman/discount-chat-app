"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const react_1 = __importStar(require("react"));
const Thumbnail = (_a) => {
    var { of } = _a, props = __rest(_a, ["of"]);
    const parentRef = (0, react_1.useRef)(null);
    const elementRef = (0, react_1.useRef)(null);
    const [scale, setScale] = (0, react_1.useState)(1);
    (0, react_1.useEffect)(() => {
        var _a, _b, _c;
        const pw = ((_b = (_a = parentRef.current) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.offsetWidth) || 0;
        const width = ((_c = elementRef.current) === null || _c === void 0 ? void 0 : _c.offsetWidth) || 0;
        setScale(pw / width);
    }, [of]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ overflow: "hidden", position: "relative", ref: parentRef }, props, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: 'max-content', className: (0, css_in_js_1.css) `
          transform: scale(${scale});
          transform-origin: 0% 0%;
          pointer-events: none;
        `, ref: elementRef, children: of }) })));
};
exports.default = Thumbnail;
