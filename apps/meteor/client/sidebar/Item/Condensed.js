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
const Condensed = (_a) => {
    var { icon, title = '', avatar, actions, href, unread, menu, badges } = _a, props = __rest(_a, ["icon", "title", "avatar", "actions", "href", "unread", "menu", "badges"]);
    const [menuVisibility, setMenuVisibility] = (0, react_1.useState)(!!window.DISABLE_ANIMATION);
    const isReduceMotionEnabled = (0, fuselage_hooks_1.usePrefersReducedMotion)();
    const handleMenu = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        setMenuVisibility(e.target.offsetWidth > 0 && Boolean(menu));
    });
    const handleMenuEvent = {
        [isReduceMotionEnabled ? 'onMouseEnter' : 'onTransitionEnd']: handleMenu,
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Sidebar.Item, Object.assign({}, props, { href }, { clickable: !!href, children: [avatar && (0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.Item.Avatar, { children: avatar }), (0, jsx_runtime_1.jsxs)(fuselage_1.Sidebar.Item.Content, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Sidebar.Item.Wrapper, { children: [icon, (0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.Item.Title, { "data-qa": 'sidebar-item-title', className: (unread && 'rcx-sidebar-item--highlighted'), children: title })] }), badges && (0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.Item.Badge, { children: badges }), menu && ((0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.Item.Menu, Object.assign({}, handleMenuEvent, { children: menuVisibility ? menu() : (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { tabIndex: -1, "aria-hidden": true, mini: true, "rcx-sidebar-item__menu": true, icon: 'kebab' }) })))] }), actions && ((0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.Item.Container, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.Item.Actions, { children: actions }) }))] })));
};
exports.default = (0, react_1.memo)(Condensed);
