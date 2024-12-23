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
exports.useChangeOwnerAction = void 0;
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
const useChangeOwnerAction = (user, rid) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const room = (0, ui_contexts_1.useUserRoom)(rid);
    const { _id: uid } = user;
    const userCanSetOwner = (0, ui_contexts_1.usePermission)('set-owner', rid);
    const isOwner = (0, useUserHasRoomRole_1.useUserHasRoomRole)(uid, rid, 'owner');
    const userSubscription = (0, ui_contexts_1.useUserSubscription)(rid);
    const setModal = (0, ui_contexts_1.useSetModal)();
    const { _id: loggedUserId = '' } = (0, ui_contexts_1.useUser)() || {};
    const loggedUserIsOwner = (0, useUserHasRoomRole_1.useUserHasRoomRole)(loggedUserId, rid, 'owner');
    const closeModal = (0, react_1.useCallback)(() => setModal(null), [setModal]);
    if (!room) {
        throw Error('Room not provided');
    }
    const { roomCanSetOwner } = (0, getRoomDirectives_1.getRoomDirectives)({ room, showingUserId: uid, userSubscription });
    const roomName = (room === null || room === void 0 ? void 0 : room.t) && (0, string_helpers_1.escapeHTML)(roomCoordinator_1.roomCoordinator.getRoomName(room.t, room));
    const endpointPrefix = room.t === 'p' ? '/v1/groups' : '/v1/channels';
    const changeOwnerEndpoint = isOwner ? 'removeOwner' : 'addOwner';
    const changeOwnerMessage = isOwner ? 'User__username__removed_from__room_name__owners' : 'User__username__is_now_an_owner_of__room_name_';
    const changeOwner = (0, useEndpointAction_1.useEndpointAction)('POST', `${endpointPrefix}.${changeOwnerEndpoint}`, {
        successMessage: t(changeOwnerMessage, { username: user.username, room_name: roomName }),
    });
    const handleConfirm = (0, react_1.useCallback)(() => {
        changeOwner({ roomId: rid, userId: uid });
        closeModal();
    }, [changeOwner, rid, uid, closeModal]);
    const handleChangeOwner = (0, react_1.useCallback)(({ userId }) => {
        if (!(0, core_typings_1.isRoomFederated)(room)) {
            return changeOwner({ roomId: rid, userId: uid });
        }
        const changingOwnRole = userId === loggedUserId;
        if (changingOwnRole && loggedUserIsOwner) {
            return setModal(() => getWarningModalForFederatedRooms(closeModal, handleConfirm, t('Federation_Matrix_losing_privileges'), t('Yes_continue'), t('Federation_Matrix_losing_privileges_warning')));
        }
        if (!changingOwnRole && loggedUserIsOwner) {
            return setModal(() => getWarningModalForFederatedRooms(closeModal, handleConfirm, t('Warning'), t('Yes_continue'), t('Federation_Matrix_giving_same_permission_warning')));
        }
        changeOwner({ roomId: rid, userId: uid });
    }, [setModal, loggedUserId, loggedUserIsOwner, t, rid, uid, changeOwner, closeModal, handleConfirm, room]);
    const changeOwnerAction = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () { return handleChangeOwner({ roomId: rid, userId: uid }); }));
    const changeOwnerOption = (0, react_1.useMemo)(() => ((0, core_typings_1.isRoomFederated)(room) && roomCanSetOwner) || (!(0, core_typings_1.isRoomFederated)(room) && roomCanSetOwner && userCanSetOwner)
        ? {
            content: t(isOwner ? 'Remove_as_owner' : 'Set_as_owner'),
            icon: 'shield-check',
            onClick: changeOwnerAction,
            type: 'privileges',
        }
        : undefined, [changeOwnerAction, roomCanSetOwner, userCanSetOwner, isOwner, t, room]);
    return changeOwnerOption;
};
exports.useChangeOwnerAction = useChangeOwnerAction;
