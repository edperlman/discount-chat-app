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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const FilterByText = (0, react_1.forwardRef)(function FilterByText(_a, ref) {
    var { placeholder, shouldAutoFocus = false, children } = _a, props = __rest(_a, ["placeholder", "shouldAutoFocus", "children"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const autoFocusRef = (0, fuselage_hooks_1.useAutoFocus)(shouldAutoFocus);
    const mergedRefs = (0, fuselage_hooks_1.useMergedRefs)(ref, autoFocusRef);
    const handleFormSubmit = (0, react_1.useCallback)((event) => {
        event.preventDefault();
    }, []);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mb: 16, mi: 'neg-x4', is: 'form', onSubmit: handleFormSubmit, display: 'flex', flexWrap: 'wrap', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 4, display: 'flex', flexGrow: 1, children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, props, { placeholder: placeholder !== null && placeholder !== void 0 ? placeholder : t('Search'), ref: mergedRefs, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x20' }), flexGrow: 2, minWidth: 'x220', "aria-label": placeholder !== null && placeholder !== void 0 ? placeholder : t('Search') })) }), children && (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inline: 4, children: children })] }));
});
exports.default = (0, react_1.memo)(FilterByText);
