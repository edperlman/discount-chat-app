"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const EditableLabel_1 = __importDefault(require("../EditableLabel/EditableLabel"));
const react_1 = require("react");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const formatDate_1 = require("../../../utils/formatDate");
const EditMenu = ({ name, date, onChange, onBlur, onDuplicate, onDelete, labelProps, }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const buttonRef = (0, react_1.useRef)(null);
    const containerRef = (0, react_1.useRef)(null);
    (0, fuselage_hooks_1.useOutsideClick)([containerRef], () => {
        setIsOpen(false);
        onBlur();
    });
    const duplicatehandler = (e) => {
        e.stopPropagation();
        setIsOpen(false);
        onDuplicate && onDuplicate();
    };
    const deleteHandler = (e) => {
        e.stopPropagation();
        setIsOpen(false);
        onDelete && onDelete();
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: "absolute", insetBlockStart: "10px", insetInlineEnd: "10px", zIndex: 100, ref: containerRef, className: "rc-edit-menu", onClick: (e) => {
            e.stopPropagation();
            setIsOpen(true);
        }, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { ref: buttonRef, square: true, mini: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: "cog", size: "x16" }) }), isOpen && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: "absolute", children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { elevation: "1", pb: "10px", bg: "white", children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mi: "10px", children: [(0, jsx_runtime_1.jsx)(EditableLabel_1.default, Object.assign({ value: name, onChange: onChange, onBlur: onBlur }, labelProps)), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, mbs: "2px", fontScale: "p2", children: (0, formatDate_1.formatDate)(date) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Divider, { mbs: "12px" }), (0, jsx_runtime_1.jsx)(fuselage_1.Option, { disabled: !onDuplicate, onClick: duplicatehandler, children: "Duplicate" }), (0, jsx_runtime_1.jsx)(fuselage_1.Option, { disabled: !onDelete, onClick: deleteHandler, children: "Delete" })] }) }))] }));
};
exports.default = EditMenu;
