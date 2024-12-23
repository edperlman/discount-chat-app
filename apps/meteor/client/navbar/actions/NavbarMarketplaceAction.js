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
const Navbar_1 = require("../../components/Navbar");
const useAppsItems_1 = require("../../sidebar/header/actions/hooks/useAppsItems");
const NavbarMarketplaceAction = (props) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const routeName = router.getRouteName();
    const appItems = (0, useAppsItems_1.useAppsItems)();
    const handleAction = (0, ui_client_1.useHandleMenuAction)(appItems);
    const showApps = appItems.length > 0;
    if (!showApps) {
        return ((0, jsx_runtime_1.jsx)(Navbar_1.NavbarAction, Object.assign({}, props, { children: (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'store', disabled: true }) })));
    }
    return ((0, jsx_runtime_1.jsx)(Navbar_1.NavbarAction, Object.assign({}, props, { children: (0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { pressed: routeName === 'marketplace', medium: true, title: t('Marketplace'), icon: 'store', onAction: handleAction, items: appItems, placement: 'right-start' }) })));
};
exports.default = NavbarMarketplaceAction;
