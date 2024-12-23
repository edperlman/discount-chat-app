"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const createModalRoot = () => {
    const id = 'modal-root';
    const existing = document.getElementById(id);
    if (existing)
        return existing;
    const newOne = document.createElement('div');
    newOne.id = id;
    document.body.append(newOne);
    return newOne;
};
let modalRoot = null;
const ModalPortal = ({ children }) => {
    if (!modalRoot) {
        modalRoot = createModalRoot();
    }
    return (0, react_dom_1.createPortal)(children, modalRoot);
};
exports.default = (0, react_1.memo)(ModalPortal);
