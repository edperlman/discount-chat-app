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
const SidebarNavigationItem_1 = __importDefault(require("./SidebarNavigationItem"));
const createSidebarItems_1 = require("../../lib/createSidebarItems");
const SidebarItemsAssembler = ({ items, currentPath }) => {
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: items.map((props) => {
            var _a, _b;
            return ((0, jsx_runtime_1.jsx)(react_1.Fragment, { children: (0, createSidebarItems_1.isSidebarItem)(props) ? ((0, jsx_runtime_1.jsx)(SidebarNavigationItem_1.default, { permissionGranted: props.permissionGranted, pathSection: (_b = (_a = props.href) !== null && _a !== void 0 ? _a : props.pathSection) !== null && _b !== void 0 ? _b : '', icon: props.icon, label: t((props.i18nLabel || props.name)), currentPath: currentPath, tag: props.tag && i18n.exists(props.tag) ? t(props.tag) : props.tag, externalUrl: props.externalUrl, badge: props.badge })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Divider, {})) }, props.i18nLabel));
        }) }));
};
exports.default = (0, react_1.memo)(SidebarItemsAssembler);
