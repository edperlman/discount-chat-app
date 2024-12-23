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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const getDropdownContainer = (descendant) => {
    var _a;
    for (let element = descendant !== null && descendant !== void 0 ? descendant : document.body; element !== document.body; element = (_a = element.parentElement) !== null && _a !== void 0 ? _a : document.body) {
        if (getComputedStyle(element).transform !== 'none' ||
            getComputedStyle(element).position === 'fixed' ||
            getComputedStyle(element).willChange === 'transform') {
            return element;
        }
    }
    return document.body;
};
const useDropdownPosition = (reference, target) => {
    var _a, _b, _c;
    const innerContainer = getDropdownContainer(reference.current);
    const viewHeight = document.body.getBoundingClientRect().height;
    const refTop = (_b = (_a = reference.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().top) !== null && _b !== void 0 ? _b : 0;
    const targetHeight = ((_c = target.current) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect().height) || 0;
    const placement = (0, react_1.useMemo)(() => {
        if (refTop >= viewHeight / 2) {
            return 'top-start';
        }
        return 'bottom-end';
    }, [targetHeight, refTop]);
    const maxHeight = (0, react_1.useMemo)(() => (placement === 'bottom-end' ? '482px' : `${refTop - 12}px`), [placement, refTop]);
    const { style } = (0, fuselage_hooks_1.usePosition)(reference, target, {
        placement,
        container: innerContainer,
    });
    return (0, react_1.useMemo)(() => {
        return Object.assign(Object.assign({}, style), { maxHeight });
    }, [style]);
};
/**
 * @reference is the trigger element target
 * @ref is the dropdown element target
 *  */
const EmojiPickerDesktopDropdown = (0, react_1.forwardRef)(function ToolboxDropdownDesktop({ reference, children }, ref) {
    const targetRef = (0, react_1.useRef)(null);
    const mergedRef = (0, fuselage_hooks_1.useMergedRefs)(ref, targetRef);
    const style = useDropdownPosition(reference, targetRef);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Tile, { style: style, ref: mergedRef, elevation: '2', pi: '0', pb: '0', display: 'flex', flexDirection: 'column', overflow: 'auto', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexShrink: 1, pb: 12, children: children }) }));
});
exports.default = EmojiPickerDesktopDropdown;
