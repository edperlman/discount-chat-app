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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const hiddenActionsDefaultValue = {
    roomToolbox: [],
    messageToolbox: [],
    composerToolbox: [],
    userToolbox: [],
};
const LayoutProvider = ({ children }) => {
    const showTopNavbarEmbeddedLayout = (0, ui_contexts_1.useSetting)('UI_Show_top_navbar_embedded_layout', false);
    const [isCollapsed, setIsCollapsed] = (0, react_1.useState)(false);
    const breakpoints = (0, fuselage_hooks_1.useBreakpoints)(); // ["xs", "sm", "md", "lg", "xl", xxl"]
    const [hiddenActions, setHiddenActions] = (0, react_1.useState)(hiddenActionsDefaultValue);
    const router = (0, ui_contexts_1.useRouter)();
    // Once the layout is embedded, it can't be changed
    const [isEmbedded] = (0, react_1.useState)(() => router.getSearchParameters().layout === 'embedded');
    const isMobile = !breakpoints.includes('md');
    (0, react_1.useEffect)(() => {
        setIsCollapsed(isMobile);
    }, [isMobile]);
    (0, react_1.useEffect)(() => {
        const eventHandler = (event) => {
            var _a;
            if (((_a = event.data) === null || _a === void 0 ? void 0 : _a.event) !== 'overrideUi') {
                return;
            }
            setHiddenActions(Object.assign(Object.assign({}, hiddenActionsDefaultValue), event.data.hideActions));
        };
        window.addEventListener('message', eventHandler);
        return () => window.removeEventListener('message', eventHandler);
    }, []);
    return ((0, jsx_runtime_1.jsx)(ui_contexts_1.LayoutContext.Provider, { children: children, value: (0, react_1.useMemo)(() => ({
            isMobile,
            isEmbedded,
            showTopNavbarEmbeddedLayout,
            sidebar: {
                isCollapsed,
                toggle: () => setIsCollapsed((isCollapsed) => !isCollapsed),
                collapse: () => setIsCollapsed(true),
                expand: () => setIsCollapsed(false),
                close: () => (isEmbedded ? setIsCollapsed(true) : router.navigate('/home')),
            },
            size: {
                sidebar: '240px',
                // eslint-disable-next-line no-nested-ternary
                contextualBar: breakpoints.includes('sm') ? (breakpoints.includes('xl') ? '38%' : '380px') : '100%',
            },
            roomToolboxExpanded: breakpoints.includes('lg'),
            contextualBarExpanded: breakpoints.includes('sm'),
            // eslint-disable-next-line no-nested-ternary
            contextualBarPosition: breakpoints.includes('sm') ? (breakpoints.includes('lg') ? 'relative' : 'absolute') : 'fixed',
            hiddenActions,
        }), [isMobile, isEmbedded, showTopNavbarEmbeddedLayout, isCollapsed, breakpoints, router, hiddenActions]) }));
};
exports.default = LayoutProvider;
