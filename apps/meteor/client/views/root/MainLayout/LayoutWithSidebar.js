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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const AccessibilityShortcut_1 = __importDefault(require("./AccessibilityShortcut"));
const MainLayoutStyleTags_1 = require("./MainLayoutStyleTags");
const sidebar_1 = __importDefault(require("../../../sidebar"));
const LayoutWithSidebar = ({ children }) => {
    const { isEmbedded: embeddedLayout } = (0, ui_contexts_1.useLayout)();
    const modal = (0, ui_contexts_1.useCurrentModal)();
    const currentRoutePath = (0, ui_contexts_1.useCurrentRoutePath)();
    const channelRoute = (0, ui_contexts_1.useRoute)('channel');
    const removeSidenav = embeddedLayout && !(currentRoutePath === null || currentRoutePath === void 0 ? void 0 : currentRoutePath.startsWith('/admin'));
    const readReceiptsEnabled = (0, ui_contexts_1.useSetting)('Message_Read_Receipt_Store_Users');
    const firstChannelAfterLogin = (0, ui_contexts_1.useSetting)('First_Channel_After_Login');
    const redirected = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        const needToBeRedirect = currentRoutePath && ['/', '/home'].includes(currentRoutePath);
        if (!needToBeRedirect) {
            return;
        }
        if (!firstChannelAfterLogin || typeof firstChannelAfterLogin !== 'string') {
            return;
        }
        if (redirected.current) {
            return;
        }
        redirected.current = true;
        channelRoute.push({ name: firstChannelAfterLogin });
    }, [channelRoute, currentRoutePath, firstChannelAfterLogin]);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { bg: 'surface-light', id: 'rocket-chat', className: [embeddedLayout ? 'embedded-view' : undefined, 'menu-nav'].filter(Boolean).join(' '), "aria-hidden": Boolean(modal), children: [(0, jsx_runtime_1.jsx)(AccessibilityShortcut_1.default, {}), (0, jsx_runtime_1.jsx)(MainLayoutStyleTags_1.MainLayoutStyleTags, {}), !removeSidenav && (0, jsx_runtime_1.jsx)(sidebar_1.default, {}), (0, jsx_runtime_1.jsx)("main", { id: 'main-content', className: ['main-content', readReceiptsEnabled ? 'read-receipts-enabled' : undefined].filter(Boolean).join(' '), children: children })] }));
};
exports.default = LayoutWithSidebar;
