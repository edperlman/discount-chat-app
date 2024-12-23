"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Navbar_1 = require("../../components/Navbar");
const NavbarHomeAction = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const { sidebar } = (0, ui_contexts_1.useLayout)();
    const showHome = (0, ui_contexts_1.useSetting)('Layout_Show_Home_Button');
    const routeName = router.getLocationPathname();
    const handleHome = (0, fuselage_hooks_1.useMutableCallback)(() => {
        sidebar.toggle();
        router.navigate('/home');
    });
    return showHome ? ((0, jsx_runtime_1.jsx)(Navbar_1.NavbarAction, Object.assign({}, props, { children: (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { pressed: ['/home', '/live', '/direct', '/group', '/channel'].some((name) => routeName === null || routeName === void 0 ? void 0 : routeName.startsWith(name)), title: t('Home'), medium: true, icon: 'home', onClick: handleHome }) }))) : null;
};
exports.default = NavbarHomeAction;
