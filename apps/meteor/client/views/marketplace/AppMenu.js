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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useAppMenu_1 = require("./hooks/useAppMenu");
const AppMenu = ({ app, isAppDetailsPage }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { isLoading, isAdminUser, sections } = (0, useAppMenu_1.useAppMenu)(app, isAppDetailsPage);
    const itemsList = sections.reduce((acc, { items }) => [...acc, ...items], []);
    const onAction = (0, ui_client_1.useHandleMenuAction)(itemsList);
    const disabledKeys = itemsList.filter((item) => item.disabled).map((item) => item.id);
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 'x28', width: 'x28' });
    }
    if (!isAdminUser && (app === null || app === void 0 ? void 0 : app.installed) && sections.length === 0) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.MenuV2, { title: t('More_options'), onAction: onAction, disabledKeys: disabledKeys, detached: true, children: sections.map(({ items }, idx) => ((0, jsx_runtime_1.jsx)(fuselage_1.MenuSection, { items: items, children: items.map((option) => ((0, jsx_runtime_1.jsx)(fuselage_1.MenuItem, { children: (0, jsx_runtime_1.jsx)(fuselage_1.MenuItemContent, { children: option.content }) }, option.id))) }, idx))) }));
};
exports.default = (0, react_1.memo)(AppMenu);
