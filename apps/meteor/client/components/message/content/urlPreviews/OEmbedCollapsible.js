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
const OEmbedPreviewContent_1 = __importDefault(require("./OEmbedPreviewContent"));
const MessageCollapsible_1 = __importDefault(require("../../MessageCollapsible"));
const OEmbedCollapsible = (_a) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(MessageCollapsible_1.default, { title: t('Link_Preview'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.MessageGenericPreview, { children: [children, (0, jsx_runtime_1.jsx)(OEmbedPreviewContent_1.default, Object.assign({}, props))] }) }));
};
exports.default = OEmbedCollapsible;
