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
const useAdministrationItems_1 = require("../../sidebar/header/actions/hooks/useAdministrationItems");
const NavbarAdministrationAction = (props) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const administrationItems = (0, useAdministrationItems_1.useAdministrationItems)();
    const handleAction = (0, ui_client_1.useHandleMenuAction)(administrationItems);
    const router = (0, ui_contexts_1.useRouter)();
    return ((0, jsx_runtime_1.jsx)(Navbar_1.NavbarAction, Object.assign({}, props, { children: (0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { pressed: router.getLocationPathname().startsWith('/admin'), medium: true, title: t('Administration'), icon: 'cog', onAction: handleAction, items: administrationItems, placement: 'right-start' }) })));
};
exports.default = NavbarAdministrationAction;
