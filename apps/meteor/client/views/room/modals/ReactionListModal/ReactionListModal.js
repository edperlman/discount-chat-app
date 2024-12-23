"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Reactions_1 = __importDefault(require("./Reactions"));
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const ReactionListModal = ({ reactions, onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'info', title: t('Users_reacted'), onClose: onClose, onConfirm: onClose, confirmText: t('Close'), children: (0, jsx_runtime_1.jsx)(Reactions_1.default, { reactions: reactions }) }));
};
exports.default = ReactionListModal;
