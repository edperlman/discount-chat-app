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
const AdminSidebarPages_1 = __importDefault(require("./AdminSidebarPages"));
const PlanTag_1 = __importDefault(require("../../../components/PlanTag"));
const Sidebar_1 = __importDefault(require("../../../components/Sidebar"));
const SettingsProvider_1 = __importDefault(require("../../../providers/SettingsProvider"));
const AdminSidebar = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const { sidebar } = (0, ui_contexts_1.useLayout)();
    const currentPath = (0, ui_contexts_1.useCurrentRoutePath)();
    // TODO: uplift this provider
    return ((0, jsx_runtime_1.jsx)(SettingsProvider_1.default, { privileged: true, children: (0, jsx_runtime_1.jsxs)(Sidebar_1.default, { children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default.Header, { onClose: sidebar.close, title: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [t('Administration'), " ", (0, jsx_runtime_1.jsx)(PlanTag_1.default, {})] }) }), (0, jsx_runtime_1.jsx)(Sidebar_1.default.Content, { children: (0, jsx_runtime_1.jsx)(AdminSidebarPages_1.default, { currentPath: currentPath || '' }) })] }) }));
};
exports.default = (0, react_1.memo)(AdminSidebar);
