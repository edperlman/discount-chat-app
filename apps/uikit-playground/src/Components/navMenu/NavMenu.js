"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const Context_1 = require("../../Context");
const Menu_1 = __importDefault(require("./Menu"));
const NavMenu = () => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const { state: { navMenuToggle }, dispatch, } = (0, react_1.useContext)(Context_1.context);
    const toggleHandler = () => {
        setIsOpen(false);
        setTimeout(() => {
            dispatch((0, Context_1.navMenuToggleAction)(false));
        }, 300);
    };
    (0, react_1.useEffect)(() => {
        setIsOpen(navMenuToggle);
    }, [navMenuToggle]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: "absolute", width: "100%", height: "100%", zIndex: 3, bg: isOpen ? '#000000cc' : 'transparent', className: (0, css_in_js_1.css) `
        user-select: none;
        transition: var(--animation-fast);
      `, overflow: "hidden", onClick: toggleHandler, children: (0, jsx_runtime_1.jsx)(Menu_1.default, { isOpen: isOpen }) }));
};
exports.default = NavMenu;
