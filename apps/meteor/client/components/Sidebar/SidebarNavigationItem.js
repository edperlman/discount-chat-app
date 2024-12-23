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
const SidebarGenericItem_1 = __importDefault(require("./SidebarGenericItem"));
const SidebarNavigationItem = ({ permissionGranted, pathSection, icon, label, currentPath, tag, externalUrl, 
// eslint-disable-next-line @typescript-eslint/naming-convention
badge: Badge, }) => {
    const path = pathSection;
    const isActive = !!path && (currentPath === null || currentPath === void 0 ? void 0 : currentPath.includes(path));
    if (permissionGranted === false || (typeof permissionGranted === 'function' && !permissionGranted())) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(SidebarGenericItem_1.default, { active: isActive, href: path, externalUrl: externalUrl, children: [icon && (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: icon, size: 'x20', mi: 4 }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { withTruncatedText: true, fontScale: 'p2', mi: 4, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', children: [label, " ", tag && (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { children: tag })] }), Badge ? (0, jsx_runtime_1.jsx)(Badge, {}) : null] }));
};
exports.default = (0, react_1.memo)(SidebarNavigationItem);
