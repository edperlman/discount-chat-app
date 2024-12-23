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
const UiKit = __importStar(require("@rocket.chat/ui-kit"));
const useUiKitState_1 = require("../hooks/useUiKitState");
const ButtonElement = ({ block, context, surfaceRenderer, }) => {
    const [{ loading }, action] = (0, useUiKitState_1.useUiKitState)(block, context);
    const { style, url, text, value, secondary } = block;
    const handleClick = (e) => {
        action({ target: e.currentTarget });
    };
    if (url) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { is: 'a', target: '_blank', small: true, minWidth: '4ch', disabled: loading, href: url, primary: style === 'primary', danger: style === 'danger', success: style === 'success', warning: style === 'warning', secondary: secondary, onClick: handleClick, children: loading ? ((0, jsx_runtime_1.jsx)(fuselage_1.Throbber, {})) : (surfaceRenderer.renderTextObject(text, 0, UiKit.BlockContext.NONE)) }));
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, minWidth: '4ch', disabled: loading, primary: style === 'primary', danger: style === 'danger', success: style === 'success', warning: style === 'warning', secondary: secondary, value: value, onClick: handleClick, children: loading ? ((0, jsx_runtime_1.jsx)(fuselage_1.Throbber, {})) : (surfaceRenderer.renderTextObject(text, 0, UiKit.BlockContext.NONE)) }));
};
exports.default = ButtonElement;
