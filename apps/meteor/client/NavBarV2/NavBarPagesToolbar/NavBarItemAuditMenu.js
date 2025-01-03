"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useAuditMenu_1 = require("./hooks/useAuditMenu");
const NavBarItemAuditMenu = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const sections = (0, useAuditMenu_1.useAuditMenu)();
    const currentRoute = (0, ui_contexts_1.useCurrentRoutePath)();
    return ((0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, Object.assign({ sections: sections, title: t('Audit'), is: fuselage_1.NavBarItem, placement: 'bottom-start', icon: 'document-eye', pressed: currentRoute === null || currentRoute === void 0 ? void 0 : currentRoute.includes('/audit') }, props)));
};
exports.default = NavBarItemAuditMenu;