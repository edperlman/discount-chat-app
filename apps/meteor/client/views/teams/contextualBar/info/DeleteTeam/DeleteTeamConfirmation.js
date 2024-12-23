"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const RoomLinkList_1 = __importDefault(require("./RoomLinkList"));
const GenericModal_1 = __importDefault(require("../../../../../components/GenericModal"));
const DeleteTeamConfirmation = ({ deletedRooms, keptRooms, onConfirm, onReturn, onCancel }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const roomIds = Object.values(deletedRooms).map(({ _id }) => _id);
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { variant: 'danger', title: t('Delete_roomType', { roomType: 'team' }), onConfirm: () => onConfirm(roomIds), onCancel: onReturn, confirmText: t('Yes_delete_it'), cancelText: t('Back'), onClose: onCancel, children: [(0, jsx_runtime_1.jsx)("p", { children: t('Delete_roomType_description', { roomType: 'team' }) }), !!Object.values(deletedRooms).length && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)("p", { children: [t('Teams_deleted_channels'), " ", (0, jsx_runtime_1.jsx)(RoomLinkList_1.default, { rooms: deletedRooms })] })] })), !!Object.values(keptRooms).length && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)("p", { children: [t('Teams_kept_channels'), " ", (0, jsx_runtime_1.jsx)(RoomLinkList_1.default, { rooms: keptRooms })] })] }))] }));
};
exports.default = DeleteTeamConfirmation;
