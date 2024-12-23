"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateRoomModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const useCreateRoomModal = (Component) => {
    const setModal = (0, ui_contexts_1.useSetModal)();
    return (0, fuselage_hooks_1.useMutableCallback)(() => {
        const handleClose = () => {
            setModal(null);
        };
        setModal(() => (0, jsx_runtime_1.jsx)(Component, { onClose: handleClose }));
    });
};
exports.useCreateRoomModal = useCreateRoomModal;
