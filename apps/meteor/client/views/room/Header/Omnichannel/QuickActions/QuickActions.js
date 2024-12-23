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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const QuickActionOptions_1 = __importDefault(require("./QuickActionOptions"));
const useQuickActions_1 = require("./hooks/useQuickActions");
const Header_1 = require("../../../../../components/Header");
const RoomContext_1 = require("../../../contexts/RoomContext");
const QuickActions = ({ className }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const room = (0, RoomContext_1.useOmnichannelRoom)();
    const { quickActions, actionDefault } = (0, useQuickActions_1.useQuickActions)();
    return ((0, jsx_runtime_1.jsxs)(Header_1.HeaderToolbar, { "aria-label": t('Omnichannel_quick_actions'), children: [quickActions.map(({ id, color, icon, title, action = actionDefault, options }, index) => {
                const props = {
                    id,
                    icon,
                    color,
                    title: t(title),
                    className,
                    index,
                    primary: false,
                    action,
                    room,
                };
                if (options) {
                    return (0, jsx_runtime_1.jsx)(QuickActionOptions_1.default, Object.assign({ options: options }, props), id);
                }
                return (0, jsx_runtime_1.jsx)(Header_1.HeaderToolbarAction, Object.assign({}, props), id);
            }), quickActions.length > 0 && (0, jsx_runtime_1.jsx)(Header_1.HeaderToolbarDivider, {})] }));
};
exports.default = (0, react_1.memo)(QuickActions);
