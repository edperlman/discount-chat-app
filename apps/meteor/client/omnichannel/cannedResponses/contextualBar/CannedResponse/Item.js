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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useScopeDict_1 = require("../../../hooks/useScopeDict");
const Item = ({ data, allowUse, onClickItem, onClickUse }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const scope = (0, useScopeDict_1.useScopeDict)(data.scope, data.departmentName);
    const clickable = (0, css_in_js_1.css) `
		cursor: pointer;
	`;
    const [visibility, setVisibility] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { pbs: 16, pbe: 12, pi: 24, color: 'default', borderBlockEndWidth: 1, borderBlockEndColor: 'light', borderBlockEndStyle: 'solid', onClick: onClickItem, className: clickable, onMouseEnter: () => setVisibility(true), onMouseLeave: () => setVisibility(false), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { w: 'full', minWidth: 0, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2m', withTruncatedText: true, children: ["!", data.shortcut] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'c1', color: 'hint', withTruncatedText: true, children: scope })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { display: visibility && allowUse ? 'block' : 'none', small: true, onClick: (e) => {
                                    onClickUse(e, data.text);
                                }, children: t('Use') }), (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'chevron-left', size: 'x24', color: 'hint' })] })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2', mbs: '8px', color: 'hint', withTruncatedText: true, children: ["\"", data.text, "\""] }), data.tags && data.tags.length > 0 && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', w: 'full', flexDirection: 'row', mbs: '8px', flexWrap: 'wrap', children: data.tags.map((tag, idx) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mie: '4px', mbe: '4px', children: (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { children: tag }) }, idx))) }))] }));
};
exports.default = (0, react_1.memo)(Item);
