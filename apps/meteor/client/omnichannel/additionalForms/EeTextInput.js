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
exports.EeTextInput = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const useHasLicenseModule_1 = require("../../hooks/useHasLicenseModule");
const EeTextInput = (_a) => {
    var { label } = _a, props = __rest(_a, ["label"]);
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    if (!hasLicense) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: label }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, props)) })] }));
};
exports.EeTextInput = EeTextInput;
exports.default = exports.EeTextInput;