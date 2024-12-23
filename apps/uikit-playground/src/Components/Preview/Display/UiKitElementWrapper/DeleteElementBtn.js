"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./UiKitElementWrapper.scss");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const Context_1 = require("../../../../Context");
const Display = ({ elementIndex }) => {
    const { state, dispatch } = (0, react_1.useContext)(Context_1.context);
    const deleteElement = () => {
        const { screens, activeScreen } = state;
        const blocks = [...screens[activeScreen].payload.blocks];
        blocks.splice(elementIndex, 1);
        dispatch((0, Context_1.updatePayloadAction)({ blocks: [...blocks], changedByEditor: false }));
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: 'uikit-element-delete-btn', onClick: deleteElement, children: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: "cross", size: "x20" }) }));
};
exports.default = Display;
