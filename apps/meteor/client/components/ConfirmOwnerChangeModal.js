"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("./GenericModal"));
const RawText_1 = __importDefault(require("./RawText"));
const ConfirmOwnerChangeModal = ({ shouldChangeOwner, shouldBeRemoved, contentTitle, confirmText, onConfirm, onCancel, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    let changeOwnerRooms = '';
    if (shouldChangeOwner.length > 0) {
        if (shouldChangeOwner.length === 1) {
            changeOwnerRooms = t('A_new_owner_will_be_assigned_automatically_to_the__roomName__room', {
                roomName: shouldChangeOwner.pop(),
            });
        }
        else if (shouldChangeOwner.length <= 5) {
            changeOwnerRooms = t('A_new_owner_will_be_assigned_automatically_to_those__count__rooms__rooms__', {
                count: shouldChangeOwner.length,
                rooms: shouldChangeOwner.join(', '),
            });
        }
        else {
            changeOwnerRooms = t('A_new_owner_will_be_assigned_automatically_to__count__rooms', {
                count: shouldChangeOwner.length,
            });
        }
    }
    let removedRooms = '';
    if (shouldBeRemoved.length > 0) {
        if (shouldBeRemoved.length === 1) {
            removedRooms = t('The_empty_room__roomName__will_be_removed_automatically', {
                roomName: shouldBeRemoved.pop(),
            });
        }
        else if (shouldBeRemoved.length <= 5) {
            removedRooms = t('__count__empty_rooms_will_be_removed_automatically__rooms__', {
                count: shouldBeRemoved.length,
                rooms: shouldBeRemoved.join(', '),
            });
        }
        else {
            removedRooms = t('__count__empty_rooms_will_be_removed_automatically', {
                count: shouldBeRemoved.length,
            });
        }
    }
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { variant: 'danger', onClose: onCancel, onCancel: onCancel, confirmText: confirmText, onConfirm: onConfirm, children: [contentTitle, changeOwnerRooms && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { marginBlock: 16, children: (0, jsx_runtime_1.jsx)(RawText_1.default, { children: changeOwnerRooms }) })), removedRooms && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { marginBlock: 16, children: (0, jsx_runtime_1.jsx)(RawText_1.default, { children: removedRooms }) }))] }));
};
exports.default = ConfirmOwnerChangeModal;
