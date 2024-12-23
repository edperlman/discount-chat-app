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
const rc_scrollbars_1 = require("rc-scrollbars");
const react_1 = __importStar(require("react"));
const styleDefault = {
    flexGrow: 1,
    overflowY: 'hidden',
};
const CustomScrollbars = (0, react_1.forwardRef)(function CustomScrollbars(_a, ref) {
    var { children, style, onScroll, overflowX, renderView } = _a, props = __rest(_a, ["children", "style", "onScroll", "overflowX", "renderView"]);
    const scrollbarsStyle = (0, react_1.useMemo)(() => (Object.assign(Object.assign({}, style), styleDefault)), [style]);
    const refSetter = (0, react_1.useCallback)((scrollbarRef) => {
        var _a;
        if (ref && scrollbarRef) {
            if (typeof ref === 'function') {
                ref((_a = scrollbarRef.view) !== null && _a !== void 0 ? _a : null);
                return;
            }
            ref.current = scrollbarRef.view;
        }
    }, [ref]);
    return ((0, jsx_runtime_1.jsx)(rc_scrollbars_1.Scrollbars, Object.assign({}, props, { autoHide: true, autoHideTimeout: 2000, autoHideDuration: 500, style: scrollbarsStyle, onScrollFrame: onScroll, renderView: renderView, renderTrackHorizontal: overflowX ? undefined : (props) => (0, jsx_runtime_1.jsx)("div", Object.assign({}, props, { className: 'track-horizontal', style: { display: 'none' } })), renderThumbVertical: (_a) => {
            var { style } = _a, props = __rest(_a, ["style"]);
            return ((0, jsx_runtime_1.jsx)("div", Object.assign({}, props, { style: Object.assign(Object.assign({}, style), { backgroundColor: fuselage_1.Palette.stroke['stroke-dark'].toString(), borderRadius: '4px' }) })));
        }, children: children, ref: refSetter })));
});
exports.default = (0, react_1.memo)(CustomScrollbars);
