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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const HorizontalTemplate_1 = __importDefault(require("./template/HorizontalTemplate"));
const VerticalTemplate_1 = __importDefault(require("./template/VerticalTemplate"));
const RegisterTemplate = (_a) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    const template = (0, ui_contexts_1.useSetting)('Layout_Login_Template', 'horizontal-template');
    return ((0, jsx_runtime_1.jsxs)("main", { children: [template === 'vertical-template' && (0, jsx_runtime_1.jsx)(VerticalTemplate_1.default, Object.assign({}, props, { children: children })), template === 'horizontal-template' && (0, jsx_runtime_1.jsx)(HorizontalTemplate_1.default, Object.assign({}, props, { children: children }))] }));
};
exports.default = RegisterTemplate;
