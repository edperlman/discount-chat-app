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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const shim_1 = require("use-sync-external-store/shim");
const sidebarItems_1 = require("./sidebarItems");
const Sidebar_1 = __importDefault(require("../../components/Sidebar"));
const SidebarItemsAssembler_1 = __importDefault(require("../../components/Sidebar/SidebarItemsAssembler"));
const SettingsProvider_1 = __importDefault(require("../../providers/SettingsProvider"));
const MarketplaceSidebar = () => {
    const items = (0, shim_1.useSyncExternalStore)(sidebarItems_1.subscribeToMarketplaceSidebarItems, sidebarItems_1.getMarketplaceSidebarItems);
    const t = (0, ui_contexts_1.useTranslation)();
    const { sidebar } = (0, ui_contexts_1.useLayout)();
    const currentPath = (0, ui_contexts_1.useCurrentRoutePath)();
    return ((0, jsx_runtime_1.jsx)(SettingsProvider_1.default, { privileged: true, children: (0, jsx_runtime_1.jsxs)(Sidebar_1.default, { children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default.Header, { onClose: sidebar.close, title: t('Marketplace') }), (0, jsx_runtime_1.jsx)(Sidebar_1.default.Content, { children: (0, jsx_runtime_1.jsx)(SidebarItemsAssembler_1.default, { items: items, currentPath: currentPath }) })] }) }));
};
exports.default = (0, react_1.memo)(MarketplaceSidebar);
