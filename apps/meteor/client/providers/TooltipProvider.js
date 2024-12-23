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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const TooltipPortal_1 = __importDefault(require("../portals/TooltipPortal"));
const TooltipProvider = ({ children }) => {
    const lastAnchor = (0, react_1.useRef)();
    const hasHover = !(0, fuselage_hooks_1.useMediaQuery)('(hover: none)');
    const [tooltip, setTooltip] = (0, fuselage_hooks_1.useDebouncedState)(null, 300);
    const restoreTitle = (0, react_1.useCallback)((previousAnchor) => {
        setTimeout(() => {
            var _a;
            if (previousAnchor && !previousAnchor.getAttribute('title')) {
                previousAnchor.setAttribute('title', (_a = previousAnchor.getAttribute('data-title')) !== null && _a !== void 0 ? _a : '');
                previousAnchor.removeAttribute('data-title');
            }
        }, 0);
    }, []);
    const contextValue = (0, react_1.useMemo)(() => ({
        open: (tooltip, anchor) => {
            const previousAnchor = lastAnchor.current;
            setTooltip((0, jsx_runtime_1.jsx)(ui_client_1.TooltipComponent, { title: tooltip, anchor: anchor }, new Date().toISOString()));
            lastAnchor.current = anchor;
            previousAnchor && restoreTitle(previousAnchor);
        },
        close: () => {
            const previousAnchor = lastAnchor.current;
            setTooltip(null);
            setTooltip.flush();
            lastAnchor.current = undefined;
            previousAnchor && restoreTitle(previousAnchor);
        },
        dismiss: () => {
            setTooltip(null);
            setTooltip.flush();
        },
    }), [setTooltip, restoreTitle]);
    (0, react_1.useEffect)(() => {
        if (!hasHover) {
            return;
        }
        const handleMouseOver = (e) => {
            var _a, _b;
            const target = e.target;
            if (lastAnchor.current === target) {
                return;
            }
            const anchor = target.closest('[title], [data-tooltip]');
            if (lastAnchor.current === anchor) {
                return;
            }
            if (!anchor) {
                contextValue.close();
                return;
            }
            const title = (_b = (_a = anchor.getAttribute('title')) !== null && _a !== void 0 ? _a : anchor.getAttribute('data-tooltip')) !== null && _b !== void 0 ? _b : '';
            if (!title) {
                contextValue.close();
                return;
            }
            // eslint-disable-next-line react/no-multi-comp
            const Handler = () => {
                const [state, setState] = (0, react_1.useState)(title);
                (0, react_1.useEffect)(() => {
                    const close = () => contextValue.close();
                    // store the title in a data attribute
                    anchor.setAttribute('data-title', title);
                    // Removes the title attribute to prevent the browser's tooltip from showing
                    anchor.setAttribute('title', '');
                    anchor.addEventListener('mouseleave', close);
                    const observer = new MutationObserver(() => {
                        var _a, _b;
                        const title = (_b = (_a = anchor.getAttribute('title')) !== null && _a !== void 0 ? _a : anchor.getAttribute('data-tooltip')) !== null && _b !== void 0 ? _b : '';
                        if (title === '') {
                            return;
                        }
                        // store the title in a data attribute
                        anchor.setAttribute('data-title', title);
                        // Removes the title attribute to prevent the browser's tooltip from showing
                        anchor.setAttribute('title', '');
                        setState(title);
                    });
                    observer.observe(anchor, {
                        attributes: true,
                        attributeFilter: ['title', 'data-tooltip'],
                    });
                    return () => {
                        anchor.removeEventListener('mouseleave', close);
                        observer.disconnect();
                    };
                }, []);
                return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: state });
            };
            contextValue.open((0, jsx_runtime_1.jsx)(Handler, {}), anchor);
        };
        const dismissOnClick = () => {
            contextValue.dismiss();
        };
        document.body.addEventListener('mouseover', handleMouseOver, {
            passive: true,
        });
        document.body.addEventListener('click', dismissOnClick, { capture: true });
        return () => {
            contextValue.close();
            document.body.removeEventListener('mouseover', handleMouseOver);
            document.body.removeEventListener('click', dismissOnClick);
        };
    }, [contextValue, setTooltip, hasHover]);
    return ((0, jsx_runtime_1.jsxs)(ui_contexts_1.TooltipContext.Provider, { value: contextValue, children: [children, tooltip && (0, jsx_runtime_1.jsx)(TooltipPortal_1.default, { children: tooltip })] }));
};
exports.default = (0, react_1.memo)(TooltipProvider);
