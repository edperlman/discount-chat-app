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
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Action_1 = __importDefault(require("../../Action"));
const AttachmentDownloadBase = (_a) => {
    var { title, href, disabled } = _a, props = __rest(_a, ["title", "href", "disabled"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(Action_1.default, Object.assign({ icon: 'cloud-arrow-down', href: `${href}?download`, title: disabled ? t('Download_Disabled') : t('Download'), is: 'a', target: '_blank', rel: 'noopener noreferrer', download: title, disabled: disabled }, props)));
};
exports.default = AttachmentDownloadBase;
