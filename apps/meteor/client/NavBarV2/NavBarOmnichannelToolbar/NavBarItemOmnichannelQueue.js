"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const NavBarItemOmnichannelQueue = (props) => {
    const router = (0, ui_contexts_1.useRouter)();
    const currentRoute = (0, ui_contexts_1.useCurrentRoutePath)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.NavBarItem, Object.assign({}, props, { icon: 'queue', onClick: () => router.navigate('/livechat-queue'), pressed: currentRoute === null || currentRoute === void 0 ? void 0 : currentRoute.includes('/livechat-queue') })));
};
exports.default = NavBarItemOmnichannelQueue;
