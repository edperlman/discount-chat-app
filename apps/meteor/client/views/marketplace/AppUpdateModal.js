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
const AppUpdateModal = (_a) => {
    var { confirm, cancel } = _a, props = __rest(_a, ["confirm", "cancel"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleCloseButtonClick = () => {
        cancel();
    };
    const handleCancelButtonClick = () => {
        cancel();
    };
    const handleConfirmButtonClick = () => {
        confirm();
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Icon, { color: 'status-font-on-danger', name: 'info-circled' }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Apps_Manual_Update_Modal_Title') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: handleCloseButtonClick })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { fontScale: 'p2', children: t('Apps_Manual_Update_Modal_Body') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { secondary: true, onClick: handleCancelButtonClick, children: t('No') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: true, onClick: handleConfirmButtonClick, children: t('Yes') })] }) })] })));
};
exports.default = AppUpdateModal;