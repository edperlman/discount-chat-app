"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const SurfaceSelect_1 = __importDefault(require("../../SurfaceSelect"));
const MenuItem_1 = __importDefault(require("./MenuItem"));
const Wrapper_1 = __importDefault(require("./Wrapper"));
const Context_1 = require("../../../Context");
const fuselage_toastbar_1 = require("@rocket.chat/fuselage-toastbar");
const Menu = ({ isOpen }) => {
    const { state: { screens, activeScreen }, dispatch, } = (0, react_1.useContext)(Context_1.context);
    const toast = (0, fuselage_toastbar_1.useToastBarDispatch)();
    const basicStyle = (0, css_in_js_1.css) `
    right: max(-85%, -280px);
    transition: 0.3s ease;
    box-shadow: rgb(0 0 0 / 30%) 0px 0px 15px 1px;
  `;
    const toggleStyle = isOpen
        ? (0, css_in_js_1.css) `
        transform: translateX(-100%);
      `
        : (0, css_in_js_1.css) `
        transform: translateX(0);
      `;
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: "absolute", width: "min(85%, 280px)", height: "100%", bg: "default", className: [basicStyle, toggleStyle], onClick: (e) => {
            e.stopPropagation();
        }, children: (0, jsx_runtime_1.jsxs)(Wrapper_1.default, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { alignSelf: 'flex-start', children: (0, jsx_runtime_1.jsx)(SurfaceSelect_1.default, {}) }), (0, jsx_runtime_1.jsx)(MenuItem_1.default, { name: 'Templates', onClick: () => dispatch((0, Context_1.templatesToggleAction)(true)) }), (0, jsx_runtime_1.jsx)(MenuItem_1.default, { name: 'Clear Blocks', onClick: () => {
                        dispatch((0, Context_1.updatePayloadAction)({
                            blocks: [],
                            changedByEditor: false,
                        }));
                        toast({
                            type: 'success',
                            message: 'All Blocks Cleared',
                        });
                    } }), (0, jsx_runtime_1.jsx)(MenuItem_1.default, { name: 'Copy Payload', onClick: () => {
                        var _a;
                        navigator.clipboard.writeText(JSON.stringify((_a = screens[activeScreen]) === null || _a === void 0 ? void 0 : _a.payload));
                        toast({
                            type: 'success',
                            message: 'Payload Copied',
                        });
                    } }), (0, jsx_runtime_1.jsx)(MenuItem_1.default, { name: 'Send to RocketChat' })] }) }));
};
exports.default = Menu;
