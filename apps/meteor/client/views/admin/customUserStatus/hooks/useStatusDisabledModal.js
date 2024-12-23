"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStatusDisabledModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const CustomUserStatusDisabledModal_1 = __importDefault(require("../CustomUserStatusDisabledModal"));
const useStatusDisabledModal = () => {
    const userStatusRoute = (0, ui_contexts_1.useRoute)('user-status');
    const setModal = (0, ui_contexts_1.useSetModal)();
    const closeModal = (0, fuselage_hooks_1.useMutableCallback)(() => setModal());
    const handleGoToSettings = (0, fuselage_hooks_1.useMutableCallback)(() => {
        userStatusRoute.push({ context: 'presence-service' });
        closeModal();
    });
    const isAdmin = (0, ui_contexts_1.useRole)('admin');
    const handleSetModal = () => {
        setModal((0, jsx_runtime_1.jsx)(CustomUserStatusDisabledModal_1.default, { isAdmin: isAdmin, onConfirm: handleGoToSettings, onClose: closeModal }));
    };
    return handleSetModal;
};
exports.useStatusDisabledModal = useStatusDisabledModal;
