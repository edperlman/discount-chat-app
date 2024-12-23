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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const colors_json_1 = __importDefault(require("@rocket.chat/fuselage-tokens/colors.json"));
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const CategoryDropDownAnchor = (0, react_1.forwardRef)(function CategoryDropDownAnchor(_a, ref) {
    var { onClick, selectedCategoriesCount } = _a, props = __rest(_a, ["onClick", "selectedCategoriesCount"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({ is: 'button', ref: ref, onClick: onClick, alignItems: 'center', bg: selectedCategoriesCount ? colors_json_1.default.b500 : 'light', borderColor: selectedCategoriesCount ? 'none' : 'light', borderRadius: 'x4', borderWidth: selectedCategoriesCount ? 'none' : 'x1', display: 'flex', flexGrow: 1, flexShrink: 1, justifyContent: 'space-between', minWidth: 'x144', height: 'x40', pie: 7, pis: 14, lineHeight: 'unset', "rcx-input-box": true }, props, { children: [selectedCategoriesCount > 0 && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', alignItems: 'center', bg: 'light', borderRadius: 'x32', color: 'info', display: 'flex', fontSize: 'micro', fontWeight: 700, h: 'fit-content', justifyContent: 'center', mie: 6, minWidth: 22, pb: 4, pi: 0, children: selectedCategoriesCount })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', display: 'flex', flexGrow: 1, fontScale: 'p2', color: selectedCategoriesCount ? 'white' : 'hint', children: selectedCategoriesCount > 0 ? t('Categories') : t('All_categories') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'chevron-down', size: 'x20', color: selectedCategoriesCount ? 'white' : 'hint' }) })] })));
});
exports.default = CategoryDropDownAnchor;
