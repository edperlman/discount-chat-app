"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericUpsellModal = (_a) => {
    var { tagline, title, subtitle, img, cancelText, confirmText, icon, description, onClose, onCancel, onConfirm, annotation } = _a, props = __rest(_a, ["tagline", "title", "subtitle", "img", "cancelText", "confirmText", "icon", "description", "onClose", "onCancel", "onConfirm", "annotation"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [icon && (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Icon, { name: icon }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.HeaderText, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Tagline, { color: 'font-annotation', children: tagline !== null && tagline !== void 0 ? tagline : t('Premium_capability') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: title })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { "aria-label": t('Close'), onClick: onClose })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.HeroImage, { src: img, alt: '' }), subtitle && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h3', fontScale: 'h3', children: subtitle })), description && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: { whiteSpace: 'break-spaces' }, fontScale: 'p2', mbs: 16, children: description }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Footer, { justifyContent: annotation ? 'space-between' : 'flex-end', children: [annotation && (0, jsx_runtime_1.jsx)(fuselage_1.Modal.FooterAnnotation, { children: annotation }), (onCancel || onConfirm) && ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [onCancel && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { secondary: true, onClick: onCancel, children: cancelText !== null && cancelText !== void 0 ? cancelText : t('Cancel') })), onConfirm && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: onConfirm, children: confirmText !== null && confirmText !== void 0 ? confirmText : t('Upgrade') }))] }))] })] })));
};
exports.default = GenericUpsellModal;
