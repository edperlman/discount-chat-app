"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const Context_1 = require("../../Context");
const action_1 = require("../../Context/action");
const useHorizontalScroll_1 = require("../../hooks/useHorizontalScroll");
const ScreenThumbnail_1 = __importDefault(require("./ScreenThumbnail"));
const CreateNewScreenContainer = () => {
    var _a;
    const { state: { projects, screens, activeProject, openCreateNewScreen }, dispatch, } = (0, react_1.useContext)(Context_1.context);
    const ref = (0, react_1.useRef)(null);
    const onClosehandler = () => {
        dispatch((0, action_1.openCreateNewScreenAction)(false));
    };
    (0, fuselage_hooks_1.useOutsideClick)([ref], onClosehandler);
    const scrollRef = (0, useHorizontalScroll_1.useHorizontalScroll)();
    const mergedRef = (0, fuselage_hooks_1.useMergedRefs)(scrollRef, ref);
    const createNewScreenhandler = () => {
        dispatch((0, action_1.createNewScreenAction)());
    };
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Scrollable, { horizontal: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { ref: mergedRef, w: "100%", height: "250px", borderBlockEnd: "var(--default-border)", position: "fixed", pi: "40px", className: (0, css_in_js_1.css) `
          top: -255px;
          left: 0;
          z-index: 10;
          align-items: center;
          display: flex;
          justify-content: center;
          background-color: var(--primaryBackgroundColor);
          box-shadow: var(--elements-box-shadow);
          transform: translateY(${openCreateNewScreen ? '255px' : '0px'});
          transition: var(--animation-default);
        `, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { position: "fixed", square: true, tiny: true, className: (0, css_in_js_1.css) `
            top: 20px;
            right: 20px;
          `, onClick: onClosehandler, children: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: "cross", size: "x15" }) }), openCreateNewScreen && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { width: "max-content", display: "flex", className: (0, css_in_js_1.css) `
              gap: 50px;
              align-items: center;
            `, children: [(_a = projects[activeProject]) === null || _a === void 0 ? void 0 : _a.screens.map((id) => screens[id]).map((screen, i) => {
                            var _a;
                            return ((0, jsx_runtime_1.jsx)(ScreenThumbnail_1.default, { screen: screen, disableDelete: ((_a = projects[activeProject]) === null || _a === void 0 ? void 0 : _a.screens.map((id) => screens[id]).length) <= 1 }, i));
                        }), (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { onClick: createNewScreenhandler, size: "60px", height: '60px', name: 'plus', className: (0, css_in_js_1.css) `
                cursor: pointer;
                transition: var(--animation-default);
                &:hover {
                  scale: 1.1;
                  transition: var(--animation-default);
                }
              ` })] }))] }) }));
};
exports.default = CreateNewScreenContainer;
