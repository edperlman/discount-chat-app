"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const Navbar_1 = require("../../components/Navbar");
const useAuditItems_1 = require("../../sidebar/header/actions/hooks/useAuditItems");
const NavbarAuditAction = (props) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const routerName = router.getRouteName();
    const auditItems = (0, useAuditItems_1.useAuditItems)();
    const handleAction = (0, ui_client_1.useHandleMenuAction)(auditItems);
    return ((0, jsx_runtime_1.jsx)(Navbar_1.NavbarAction, Object.assign({}, props, { children: (0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { pressed: routerName === 'audit-home' || routerName === 'audit-log', medium: true, title: t('Audit'), icon: 'document-eye', placement: 'right-start', onAction: handleAction, items: auditItems }) })));
};
exports.default = NavbarAuditAction;
