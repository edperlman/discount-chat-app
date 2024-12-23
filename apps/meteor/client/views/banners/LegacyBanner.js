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
const banners = __importStar(require("../../lib/banners"));
const LegacyBanner = ({ config }) => {
    const { closable = true, title, text, html, icon, modifiers } = config;
    const inline = !(modifiers === null || modifiers === void 0 ? void 0 : modifiers.includes('large'));
    const variant = (modifiers === null || modifiers === void 0 ? void 0 : modifiers.includes('danger')) ? 'danger' : 'info';
    (0, react_1.useEffect)(() => {
        if (!config.timer) {
            return;
        }
        const timer = setTimeout(() => {
            var _a;
            (_a = config.onClose) === null || _a === void 0 ? void 0 : _a.call(undefined);
            banners.close();
        }, config.timer);
        return () => {
            clearTimeout(timer);
        };
    }, [config.onClose, config.timer]);
    const handleAction = (0, react_1.useCallback)(() => {
        var _a;
        (_a = config.action) === null || _a === void 0 ? void 0 : _a.call(undefined);
    }, [config.action]);
    const handleClose = (0, react_1.useCallback)(() => {
        var _a;
        (_a = config.onClose) === null || _a === void 0 ? void 0 : _a.call(undefined);
        banners.close();
    }, [config.onClose]);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Banner, { inline: inline, actionable: !!config.action, closeable: closable, icon: icon ? (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: icon, size: 'x20' }) : undefined, title: typeof title === 'function' ? title() : title, variant: variant, onAction: handleAction, onClose: handleClose, children: [typeof text === 'function' ? text() : text, html && (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: typeof html === 'function' ? html() : html } })] }));
};
exports.default = LegacyBanner;
