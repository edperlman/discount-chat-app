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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const CategoryDropDownList = ({ categories, onSelected }) => {
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Tile, { overflow: 'auto', pb: 12, pi: 0, elevation: '2', w: 'full', bg: 'light', borderRadius: 2, children: categories.map((category, index) => ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [category.label && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pi: 16, pbs: 8, pbe: 4, fontScale: 'micro', textTransform: 'uppercase', color: 'default', children: category.label })), category.items.map((item) => ((0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({}, { label: item.label }, { onClick: () => onSelected(item), children: (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: item.checked, onChange: () => onSelected(item) }) }), item.id)))] }, index))) }));
};
exports.default = CategoryDropDownList;
