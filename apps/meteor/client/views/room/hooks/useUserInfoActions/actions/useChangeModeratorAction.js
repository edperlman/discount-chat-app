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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChangeModeratorAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const GenericModal_1 = __importDefault(require("../../../../../components/GenericModal"));
const useEndpointAction_1 = require("../../../../../hooks/useEndpointAction");
const roomCoordinator_1 = require("../../../../../lib/rooms/roomCoordinator");
const getRoomDirectives_1 = require("../../../lib/getRoomDirectives");
const useUserHasRoomRole_1 = require("../../useUserHasRoomRole");
const getWarningModalForFederatedRooms = (closeModalFn, handleConfirmFn, title, confirmText, bodyText) => ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'warning', onClose: closeModalFn, onConfirm: handleConfirmFn, onCancel: closeModalFn, title: title, confirmText: confirmText, children: bodyText }));
const useChangeModeratorAction = (user, rid) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const room = (0, ui_contexts_1.useUserRoom)(rid);
    const { _id: uid } = user;
    const userCanSetModerator = (0, ui_contexts_1.usePermission)('set-moderator', rid);
    const isModerator = (0, useUserHasRoomRole_1.useUserHasRoomRole)(uid, rid, 'moderator');
    const userSubscription = (0, ui_contexts_1.useUserSubscription)(rid);
    const { _id: loggedUserId = '' } = (0, ui_contexts_1.useUser)() || {};
    const loggedUserIsModerator = (0, useUserHasRoomRole_1.useUserHasRoomRole)(loggedUserId, rid, 'moderator');
    const loggedUserIsOwner = (0, useUserHasRoomRole_1.useUserHasRoomRole)(loggedUserId, rid, 'owner');
    const setModal = (0, ui_contexts_1.useSetModal)();
    const closeModal = (0, react_1.useCallback)(() => setModal(null), [setModal]);
    if (!room) {
        throw Error('Room not provided');
    }
    const { roomCanSetModerator } = (0, getRoomDirectives_1.getRoomDirectives)({ room, showingUserId: uid, userSubscription });
    const roomName = (room === null || room === void 0 ? void 0 : room.t) && (0, string_helpers_1.escapeHTML)(roomCoordinator_1.roomCoordinator.getRoomName(room.t, room));
    const endpointPrefix = room.t === 'p' ? '/v1/groups' : '/v1/channels';
    const changeModeratorEndpoint = isModerator ? 'removeModerator' : 'addModerator';
    const changeModeratorMessage = isModerator
        ? 'User__username__removed_from__room_name__moderators'
        : 'User__username__is_now_a_moderator_of__room_name_';
    const changeModerator = (0, useEndpointAction_1.useEndpointAction)('POST', `${endpointPrefix}.${changeModeratorEndpoint}`, {
        successMessage: t(changeModeratorMessage, { username: user.username, room_name: roomName }),
    });
    const handleConfirm = (0, react_1.useCallback)(() => {
        changeModerator({ roomId: rid, userId: uid });
        closeModal();
    }, [changeModerator, rid, uid, closeModal]);
    const handleChangeModerator = (0, react_1.useCallback)(({ userId }) => {
        if (!(0, core_typings_1.isRoomFederated)(room)) {
            return changeModerator({ roomId: rid, userId: uid });
        }
        const changingOwnRole = userId === loggedUserId;
        if (changingOwnRole && loggedUserIsModerator) {
            return setModal(() => getWarningModalForFederatedRooms(closeModal, handleConfirm, t('Federation_Matrix_losing_privileges'), t('Yes_continue'), t('Federation_Matrix_losing_privileges_warning')));
        }
        if (changingOwnRole && loggedUserIsOwner) {
            return setModal(() => getWarningModalForFederatedRooms(closeModal, handleConfirm, t('Federation_Matrix_losing_privileges'), t('Yes_continue'), t('Federation_Matrix_losing_privileges_warning')));
        }
        if (!changingOwnRole && loggedUserIsModerator) {
            return setModal(() => getWarningModalForFederatedRooms(closeModal, handleConfirm, t('Warning'), t('Yes_continue'), t('Federation_Matrix_giving_same_permission_warning')));
        }
        changeModerator({ roomId: rid, userId: uid });
    }, [setModal, loggedUserId, loggedUserIsModerator, loggedUserIsOwner, t, rid, uid, changeModerator, closeModal, handleConfirm, room]);
    const changeModeratorAction = (0, fuselage_hooks_1.useMutableCallback)(() => handleChangeModerator({ roomId: rid, userId: uid }));
    const changeModeratorOption = (0, react_1.useMemo)(() => ((0, core_typings_1.isRoomFederated)(room) && roomCanSetModerator) || (!(0, core_typings_1.isRoomFederated)(room) && roomCanSetModerator && userCanSetModerator)
        ? {
            content: t(isModerator ? 'Remove_as_moderator' : 'Set_as_moderator'),
            icon: 'shield-blank',
            onClick: changeModeratorAction,
            type: 'privileges',
        }
        : undefined, [changeModeratorAction, isModerator, roomCanSetModerator, t, userCanSetModerator, room]);
    return changeModeratorOption;
};
exports.useChangeModeratorAction = useChangeModeratorAction;
