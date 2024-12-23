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
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_aria_1 = require("react-aria");
const Contextualbar_1 = __importDefault(require("./Contextualbar"));
const ContextualbarResizable_1 = __importDefault(require("./ContextualbarResizable"));
const RoomToolboxContext_1 = require("../../views/room/contexts/RoomToolboxContext");
/**
 * TODO: inside administration it should have a mechanism to display the contextualbar programmatically
 * @prop closeTab only work inside a room
 * */
const ContextualbarDialog = (props) => {
    const ref = (0, react_1.useRef)(null);
    const { dialogProps } = (0, react_aria_1.useDialog)(Object.assign({ 'aria-labelledby': 'contextualbarTitle' }, props), ref);
    const { contextualBar } = (0, ui_contexts_1.useLayoutSizes)();
    const position = (0, ui_contexts_1.useLayoutContextualBarPosition)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const callbackRef = (0, react_1.useCallback)((node) => {
        if (!node) {
            return;
        }
        ref.current = node;
        node.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeTab();
            }
        });
    }, [closeTab]);
    return ((0, jsx_runtime_1.jsx)(react_aria_1.FocusScope, { autoFocus: true, restoreFocus: true, children: (0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreview, { feature: 'contextualbarResizable', children: [(0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOn, { children: (0, jsx_runtime_1.jsx)(ContextualbarResizable_1.default, { defaultWidth: contextualBar, children: (0, jsx_runtime_1.jsx)(Contextualbar_1.default, Object.assign({ ref: callbackRef, width: '100%', position: position }, dialogProps, props)) }) }), (0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOff, { children: (0, jsx_runtime_1.jsx)(Contextualbar_1.default, Object.assign({ ref: callbackRef, width: contextualBar, position: position }, dialogProps, props)) })] }) }));
};
exports.default = ContextualbarDialog;
