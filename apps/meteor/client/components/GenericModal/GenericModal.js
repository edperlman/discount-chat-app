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
exports.GenericModalDoNotAskAgain = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const withDoNotAskAgain_1 = require("./withDoNotAskAgain");
const iconMap = {
    danger: 'modal-warning',
    warning: 'modal-warning',
    info: 'info',
    success: 'check',
};
const getButtonProps = (variant) => {
    switch (variant) {
        case 'danger':
            return { danger: true };
        case 'warning':
            return { primary: true };
        default:
            return {};
    }
};
const renderIcon = (icon, variant) => {
    if (icon === null) {
        return null;
    }
    if (icon === undefined) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Icon, { color: variant, name: iconMap[variant] });
    }
    if (typeof icon === 'string') {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Icon, { name: icon });
    }
    return icon;
};
const GenericModal = (_a) => {
    var { variant = 'info', children, cancelText, confirmText, title, icon, onCancel, onClose = onCancel, onDismiss = onClose, onConfirm, dontAskAgain, confirmDisabled, tagline, wrapperFunction, annotation } = _a, props = __rest(_a, ["variant", "children", "cancelText", "confirmText", "title", "icon", "onCancel", "onClose", "onDismiss", "onConfirm", "dontAskAgain", "confirmDisabled", "tagline", "wrapperFunction", "annotation"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const genericModalId = (0, fuselage_hooks_1.useUniqueId)();
    const dismissedRef = (0, react_1.useRef)(true);
    const handleConfirm = (0, fuselage_hooks_1.useEffectEvent)(() => {
        dismissedRef.current = false;
        onConfirm === null || onConfirm === void 0 ? void 0 : onConfirm();
    });
    const handleCancel = (0, fuselage_hooks_1.useEffectEvent)(() => {
        dismissedRef.current = false;
        onCancel === null || onCancel === void 0 ? void 0 : onCancel();
    });
    const handleCloseButtonClick = (0, fuselage_hooks_1.useEffectEvent)(() => {
        dismissedRef.current = true;
        onClose === null || onClose === void 0 ? void 0 : onClose();
    });
    (0, react_1.useEffect)(() => () => {
        if (!dismissedRef.current)
            return;
        onDismiss === null || onDismiss === void 0 ? void 0 : onDismiss();
    }, [onDismiss]);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, Object.assign({ "aria-labelledby": `${genericModalId}-title`, wrapperFunction: wrapperFunction }, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [renderIcon(icon, variant), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.HeaderText, { children: [tagline && (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Tagline, { children: tagline }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { id: `${genericModalId}-title`, children: title !== null && title !== void 0 ? title : t('Are_you_sure') })] }), onClose && (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { "aria-label": t('Close'), onClick: handleCloseButtonClick })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { fontScale: 'p2', children: children }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Footer, { justifyContent: dontAskAgain || annotation ? 'space-between' : 'end', children: [dontAskAgain, annotation && !dontAskAgain && (0, jsx_runtime_1.jsx)(fuselage_1.Modal.FooterAnnotation, { children: annotation }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [onCancel && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { secondary: true, onClick: handleCancel, children: cancelText !== null && cancelText !== void 0 ? cancelText : t('Cancel') })), wrapperFunction && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, Object.assign({}, getButtonProps(variant), { type: 'submit', disabled: confirmDisabled, children: confirmText !== null && confirmText !== void 0 ? confirmText : t('Ok') }))), !wrapperFunction && onConfirm && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, Object.assign({}, getButtonProps(variant), { onClick: handleConfirm, disabled: confirmDisabled, children: confirmText !== null && confirmText !== void 0 ? confirmText : t('Ok') })))] })] })] })));
};
exports.GenericModalDoNotAskAgain = (0, withDoNotAskAgain_1.withDoNotAskAgain)(GenericModal);
exports.default = GenericModal;
