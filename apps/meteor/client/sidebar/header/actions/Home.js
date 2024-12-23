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
const SidebarHeaderActionHome = (props) => {
    const router = (0, ui_contexts_1.useRouter)();
    const { sidebar } = (0, ui_contexts_1.useLayout)();
    const showHome = (0, ui_contexts_1.useSetting)('Layout_Show_Home_Button');
    const handleHome = (0, fuselage_hooks_1.useMutableCallback)(() => {
        sidebar.toggle();
        router.navigate('/home');
    });
    const currentRoute = (0, ui_contexts_1.useCurrentRoutePath)();
    return showHome ? (0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.TopBar.Action, Object.assign({}, props, { icon: 'home', onClick: handleHome, pressed: currentRoute === null || currentRoute === void 0 ? void 0 : currentRoute.includes('/home') })) : null;
};
exports.default = SidebarHeaderActionHome;
