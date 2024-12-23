"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const UrlPreviewResolver_1 = __importDefault(require("./UrlPreviewResolver"));
const useCollapse_1 = require("../../hooks/useCollapse");
const UrlPreview = (props) => {
    const autoLoadMedia = (0, ui_contexts_1.useAttachmentAutoLoadEmbedMedia)();
    const [collapsed, collapse] = (0, useCollapse_1.useCollapse)(!autoLoadMedia);
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', color: 'hint', fontScale: 'c1', alignItems: 'center', children: [t('Link_Preview'), " ", collapse] }), !collapsed && (0, jsx_runtime_1.jsx)(UrlPreviewResolver_1.default, Object.assign({}, props))] }));
};
exports.default = UrlPreview;
