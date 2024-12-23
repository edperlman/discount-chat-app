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
const Medium = (_a) => {
    var { icon, title, avatar, actions, badges, unread, menu } = _a, props = __rest(_a, ["icon", "title", "avatar", "actions", "badges", "unread", "menu"]);
    const [menuVisibility, setMenuVisibility] = (0, react_1.useState)(!!window.DISABLE_ANIMATION);
    const isReduceMotionEnabled = (0, fuselage_hooks_1.usePrefersReducedMotion)();
    const handleMenu = (0, fuselage_hooks_1.useEffectEvent)((e) => {
        setMenuVisibility(e.target.offsetWidth > 0 && Boolean(menu));
    });
    const handleMenuEvent = {
        [isReduceMotionEnabled ? 'onMouseEnter' : 'onTransitionEnd']: handleMenu,
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.SidebarV2Item, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.SidebarV2ItemAvatarWrapper, { children: avatar }), icon && icon, (0, jsx_runtime_1.jsx)(fuselage_1.SidebarV2ItemTitle, { unread: unread, children: title }), badges && badges, actions && actions, menu && ((0, jsx_runtime_1.jsx)(fuselage_1.SidebarV2ItemMenu, Object.assign({}, handleMenuEvent, { children: menuVisibility ? menu() : (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { tabIndex: -1, "aria-hidden": true, mini: true, "rcx-sidebar-v2-item__menu": true, icon: 'kebab' }) })))] })));
};
exports.default = (0, react_1.memo)(Medium);
