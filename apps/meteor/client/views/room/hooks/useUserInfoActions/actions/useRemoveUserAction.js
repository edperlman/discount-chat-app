"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRemoveUserAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const GenericModal_1 = __importDefault(require("../../../../../components/GenericModal"));
const useEndpointAction_1 = require("../../../../../hooks/useEndpointAction");
const Federation = __importStar(require("../../../../../lib/federation/Federation"));
const roomCoordinator_1 = require("../../../../../lib/rooms/roomCoordinator");
const RemoveUsersModal_1 = __importDefault(require("../../../../teams/contextualBar/members/RemoveUsersModal"));
const getRoomDirectives_1 = require("../../../lib/getRoomDirectives");
const useRemoveUserAction = (user, rid, reload) => {
    const room = (0, ui_contexts_1.useUserRoom)(rid);
    if (!room) {
        throw Error('Room not provided');
    }
    const t = (0, ui_contexts_1.useTranslation)();
    const currentUser = (0, ui_contexts_1.useUser)();
    const subscription = (0, ui_contexts_1.useUserSubscription)(rid);
    const { _id: uid } = user;
    const hasPermissionToRemove = (0, ui_contexts_1.usePermission)('remove-user', rid);
    const userCanRemove = (0, core_typings_1.isRoomFederated)(room)
        ? Federation.isEditableByTheUser(currentUser || undefined, room, subscription)
        : hasPermissionToRemove;
    const setModal = (0, ui_contexts_1.useSetModal)();
    const closeModal = (0, fuselage_hooks_1.useMutableCallback)(() => setModal(null));
    const roomName = (room === null || room === void 0 ? void 0 : room.t) && (0, string_helpers_1.escapeHTML)(roomCoordinator_1.roomCoordinator.getRoomName(room.t, room));
    const { roomCanRemove } = (0, getRoomDirectives_1.getRoomDirectives)({ room, showingUserId: uid, userSubscription: subscription });
    const removeFromTeam = (0, useEndpointAction_1.useEndpointAction)('POST', '/v1/teams.removeMember', {
        successMessage: t('User_has_been_removed_from_team'),
    });
    const removeFromRoomEndpoint = room.t === 'p' ? '/v1/groups.kick' : '/v1/channels.kick';
    const removeFromRoom = (0, useEndpointAction_1.useEndpointAction)('POST', removeFromRoomEndpoint, {
        successMessage: t('User_has_been_removed_from_s', roomName),
    });
    const removeUserOptionAction = (0, fuselage_hooks_1.useMutableCallback)(() => {
        const handleRemoveFromTeam = (rooms) => __awaiter(void 0, void 0, void 0, function* () {
            if (room.teamId) {
                const roomKeys = Object.keys(rooms);
                yield removeFromTeam(Object.assign({ teamId: room.teamId, userId: uid }, (roomKeys.length && { rooms: roomKeys })));
                closeModal();
                reload === null || reload === void 0 ? void 0 : reload();
            }
        });
        const handleRemoveFromRoom = (rid, uid) => __awaiter(void 0, void 0, void 0, function* () {
            yield removeFromRoom({ roomId: rid, userId: uid });
            closeModal();
            reload === null || reload === void 0 ? void 0 : reload();
        });
        if (room.teamMain && room.teamId) {
            return setModal((0, jsx_runtime_1.jsx)(RemoveUsersModal_1.default, { teamId: room === null || room === void 0 ? void 0 : room.teamId, userId: uid, onClose: closeModal, onCancel: closeModal, onConfirm: handleRemoveFromTeam }));
        }
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', confirmText: t('Yes_remove_user'), onClose: closeModal, onCancel: closeModal, onConfirm: () => handleRemoveFromRoom(rid, uid), children: t('The_user_will_be_removed_from_s', roomName) }));
    });
    const removeUserOption = (0, react_1.useMemo)(() => roomCanRemove && userCanRemove
        ? {
            content: (room === null || room === void 0 ? void 0 : room.teamMain) ? t('Remove_from_team') : t('Remove_from_room'),
            icon: 'cross',
            onClick: removeUserOptionAction,
            type: 'moderation',
            variant: 'danger',
        }
        : undefined, [room, roomCanRemove, userCanRemove, removeUserOptionAction, t]);
    return removeUserOption;
};
exports.useRemoveUserAction = useRemoveUserAction;
