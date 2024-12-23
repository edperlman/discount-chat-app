"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ModalSurface = ({ children }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.ModalHeader, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.ModalThumb, { url: "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" }), (0, jsx_runtime_1.jsx)(fuselage_1.ModalTitle, { children: "Modal Header" }), (0, jsx_runtime_1.jsx)(fuselage_1.ModalClose, {})] }), (0, jsx_runtime_1.jsx)(fuselage_1.ModalContent, { className: (0, css_in_js_1.css) `
        overflow: visible;
      `, children: children }), (0, jsx_runtime_1.jsx)(fuselage_1.ModalFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { align: "end", children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { children: "Cancel" }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, children: "Submit" })] }) })] }));
exports.default = ModalSurface;
