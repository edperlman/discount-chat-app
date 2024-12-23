"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./Editablelabel.scss");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const EditableLabel = (props) => {
    const [hover, setHover] = (0, react_1.useState)(false);
    const inputRef = (0, react_1.useRef)(null);
    const iconClickHandler = (e) => {
        var _a, _b;
        e.stopPropagation();
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        (_b = inputRef.current) === null || _b === void 0 ? void 0 : _b.select();
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: "relative", className: "rc-editableLabel", w: "100%", h: "max-content", display: "flex", alignItems: "center", onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), children: [(0, jsx_runtime_1.jsx)(fuselage_1.Input, Object.assign({ ref: inputRef }, props)), (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { invisible: !hover, className: 'editableLabel-icon', name: "pencil", onClick: iconClickHandler })] }));
};
exports.default = EditableLabel;
