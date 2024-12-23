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
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const Header_1 = require("../../../../../components/Header");
const useDropdownVisibility_1 = require("../../../../../sidebar/header/hooks/useDropdownVisibility");
const QuickActionOptions = (_a) => {
    var { options, room, action } = _a, props = __rest(_a, ["options", "room", "action"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const reference = (0, react_1.useRef)(null);
    const target = (0, react_1.useRef)(null);
    const { isVisible, toggle } = (0, useDropdownVisibility_1.useDropdownVisibility)({ reference, target });
    const handleClick = (id) => () => {
        toggle();
        action(id);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.HeaderToolbarAction, Object.assign({ ref: reference, onClick: () => toggle(), secondary: isVisible }, props)), isVisible && ((0, jsx_runtime_1.jsx)(fuselage_1.Dropdown, { reference: reference, ref: target, children: options.map(({ id, label, validate }) => {
                    const { value: valid = true, tooltip } = (validate === null || validate === void 0 ? void 0 : validate(room)) || {};
                    return ((0, jsx_runtime_1.jsx)(fuselage_1.Option, { onClick: handleClick(id), disabled: !valid, title: !valid && tooltip ? t(tooltip) : undefined, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2m', minWidth: '180px', children: t(label) }) }, id));
                }) }))] }));
};
exports.default = (0, react_1.memo)(QuickActionOptions);
