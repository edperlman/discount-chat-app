"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const Navbar_1 = require("../../components/Navbar");
const UserAvatarWithStatusUnstable_1 = __importDefault(require("../../sidebar/header/UserAvatarWithStatusUnstable"));
const UserMenu_1 = __importDefault(require("../../sidebar/header/UserMenu"));
const NavbarUserAction = (props) => {
    const user = (0, ui_contexts_1.useUser)();
    return ((0, jsx_runtime_1.jsx)(Navbar_1.NavbarAction, Object.assign({}, props, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { blockEnd: 16, children: user ? (0, jsx_runtime_1.jsx)(UserMenu_1.default, { user: user }) : (0, jsx_runtime_1.jsx)(UserAvatarWithStatusUnstable_1.default, {}) }) })));
};
exports.default = NavbarUserAction;
