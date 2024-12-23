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
/* eslint-disable no-nested-ternary */
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const breakpoints_json_1 = __importDefault(require("@rocket.chat/fuselage-tokens/breakpoints.json"));
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const HeaderSkeleton_1 = __importDefault(require("../Header/HeaderSkeleton"));
const HeaderSkeleton_2 = __importDefault(require("../HeaderV2/HeaderSkeleton"));
const useBreakpointsElement = () => {
    const { ref, borderBoxSize } = (0, fuselage_hooks_1.useResizeObserver)({
        debounceDelay: 30,
    });
    const breakpoints = (0, react_1.useMemo)(() => breakpoints_json_1.default
        .filter(({ minViewportWidth }) => minViewportWidth && borderBoxSize.inlineSize && borderBoxSize.inlineSize >= minViewportWidth)
        .map(({ name }) => name), [borderBoxSize]);
    return {
        ref,
        breakpoints,
    };
};
const RoomLayout = (_a) => {
    var { header, body, footer, aside } = _a, props = __rest(_a, ["header", "body", "footer", "aside"]);
    const { ref, breakpoints } = useBreakpointsElement();
    const contextualbarPosition = breakpoints.includes('md') ? 'relative' : 'absolute';
    const contextualbarSize = breakpoints.includes('sm') ? (breakpoints.includes('xl') ? '38%' : '380px') : '100%';
    const layout = (0, ui_contexts_1.useLayout)();
    return ((0, jsx_runtime_1.jsx)(ui_contexts_1.LayoutContext.Provider, { value: (0, react_1.useMemo)(() => (Object.assign(Object.assign({}, layout), { contextualBarPosition: contextualbarPosition, size: Object.assign(Object.assign({}, layout.size), { contextualBar: contextualbarSize }) })), [layout, contextualbarPosition, contextualbarSize]), children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({ h: 'full', w: 'full', display: 'flex', flexDirection: 'column', bg: 'room' }, props, { ref: ref, children: [(0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreview, { feature: 'newNavigation', children: [(0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOff, { children: (0, jsx_runtime_1.jsx)(HeaderSkeleton_1.default, {}) }), (0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOn, { children: (0, jsx_runtime_1.jsx)(HeaderSkeleton_2.default, {}) })] }), children: header }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexGrow: 1, overflow: 'hidden', height: 'full', position: 'relative', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'div', display: 'flex', flexDirection: 'column', flexGrow: 1, children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: null, children: body }) }), footer && (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: null, children: footer })] }), aside && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarDialog, { position: contextualbarPosition, children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: null, children: aside }) }))] })] })) }));
};
exports.default = RoomLayout;
