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
const useEscapeKey = (onDismiss) => {
    (0, react_1.useEffect)(() => {
        const closeOnEsc = (e) => {
            if (e.key !== 'Escape') {
                return;
            }
            e.stopPropagation();
            onDismiss === null || onDismiss === void 0 ? void 0 : onDismiss();
        };
        window.addEventListener('keydown', closeOnEsc);
        return () => {
            window.removeEventListener('keydown', closeOnEsc);
        };
    }, [onDismiss]);
};
const isAtBackdropChildren = (e, ref) => {
    var _a;
    const backdrop = ref.current;
    const { parentElement } = e.target;
    return (_a = (Boolean(parentElement) && (backdrop === null || backdrop === void 0 ? void 0 : backdrop.contains(parentElement)))) !== null && _a !== void 0 ? _a : false;
};
const useOutsideClick = (ref, onDismiss) => {
    const hasClicked = (0, react_1.useRef)(false);
    const onMouseDown = (0, react_1.useCallback)((e) => {
        if (isAtBackdropChildren(e, ref)) {
            hasClicked.current = false;
            return;
        }
        hasClicked.current = true;
    }, [ref]);
    const onMouseUp = (0, react_1.useCallback)((e) => {
        if (isAtBackdropChildren(e, ref)) {
            hasClicked.current = false;
            return;
        }
        if (!hasClicked.current) {
            return;
        }
        hasClicked.current = false;
        e.stopPropagation();
        onDismiss === null || onDismiss === void 0 ? void 0 : onDismiss();
    }, [onDismiss, ref]);
    return {
        onMouseDown,
        onMouseUp,
    };
};
const ModalBackdrop = ({ children, onDismiss }) => {
    const ref = (0, react_1.useRef)(null);
    useEscapeKey(onDismiss);
    const { onMouseDown, onMouseUp } = useOutsideClick(ref, onDismiss);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { ref: ref, children: children, className: 'rcx-modal__backdrop', position: 'fixed', zIndex: 9999, inset: 0, display: 'flex', flexDirection: 'column', onMouseDown: onMouseDown, onMouseUp: onMouseUp }));
};
exports.default = ModalBackdrop;
