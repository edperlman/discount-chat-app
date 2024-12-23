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
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_virtuoso_1 = require("react-virtuoso");
const FileItem_1 = __importDefault(require("./components/FileItem"));
const Contextualbar_1 = require("../../../../components/Contextualbar");
const CustomScrollbars_1 = require("../../../../components/CustomScrollbars");
const RoomFiles = ({ loading, type, text, filesItems = [], loadMoreItems, setType, setText, total, onClickClose, onClickDelete, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const options = (0, react_1.useMemo)(() => [
        ['all', t('All')],
        ['image', t('Images')],
        ['video', t('Videos')],
        ['audio', t('Audios')],
        ['text', t('Texts')],
        ['application', t('Files')],
    ], [t]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'attachment' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Files') }), onClickClose && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClickClose })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.ContextualbarSection, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { "data-qa-files-search": true, placeholder: t('Search_Files'), value: text, onChange: setText, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x20' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: 'x144', mis: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { onChange: setType, value: type, options: options }) })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarContent, { paddingInline: 0, children: [loading && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { p: 24, children: (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { size: 'x12' }) })), !loading && filesItems.length === 0 && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarEmptyContent, { title: t('No_files_found') }), !loading && filesItems.length > 0 && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: 'full', h: 'full', flexShrink: 1, overflow: 'hidden', children: (0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { style: {
                                height: '100%',
                                width: '100%',
                            }, totalCount: total, endReached: (start) => loadMoreItems(start, Math.min(50, total - start)), overscan: 50, data: filesItems, components: { Scroller: CustomScrollbars_1.VirtuosoScrollbars }, itemContent: (_, data) => (0, jsx_runtime_1.jsx)(FileItem_1.default, { fileData: data, onClickDelete: onClickDelete }) }) }))] })] }));
};
exports.default = RoomFiles;
