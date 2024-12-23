"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCustomStatusModalHandler = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const EditStatusModal_1 = __importDefault(require("../EditStatusModal"));
const useCustomStatusModalHandler = () => {
    const user = (0, ui_contexts_1.useUser)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    return () => {
        const handleModalClose = () => setModal(null);
        setModal((0, jsx_runtime_1.jsx)(EditStatusModal_1.default, { userStatus: user === null || user === void 0 ? void 0 : user.status, userStatusText: user === null || user === void 0 ? void 0 : user.statusText, onClose: handleModalClose }));
    };
};
exports.useCustomStatusModalHandler = useCustomStatusModalHandler;
