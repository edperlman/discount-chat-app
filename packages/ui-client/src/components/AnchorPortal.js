"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const anchors_1 = require("../helpers/anchors");
const AnchorPortal = ({ id, children }) => {
    const anchorElement = (0, anchors_1.ensureAnchorElement)(id);
    (0, react_1.useLayoutEffect)(() => {
        (0, anchors_1.refAnchorElement)(anchorElement);
        return () => {
            (0, anchors_1.unrefAnchorElement)(anchorElement);
        };
    }, [anchorElement]);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, react_dom_1.createPortal)(children, anchorElement) });
};
exports.default = AnchorPortal;
