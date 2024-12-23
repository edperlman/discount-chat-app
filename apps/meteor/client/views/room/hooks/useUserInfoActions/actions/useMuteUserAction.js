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
exports.useMuteUserAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const GenericModal_1 = __importDefault(require("../../../../../components/GenericModal"));
const roomCoordinator_1 = require("../../../../../lib/rooms/roomCoordinator");
const getRoomDirectives_1 = require("../../../lib/getRoomDirectives");
const getUserIsMuted = (user, room, userCanPostReadonly) => {
    var _a, _b, _c;
    if (room === null || room === void 0 ? void 0 : room.ro) {
        if (Array.isArray(room.unmuted) && room.unmuted.indexOf((_a = user.username) !== null && _a !== void 0 ? _a : '') !== -1) {
            return false;
        }
        if (userCanPostReadonly) {
            return Array.isArray(room.muted) && room.muted.indexOf((_b = user.username) !== null && _b !== void 0 ? _b : '') !== -1;
        }
        return true;
    }
    return room && Array.isArray(room.muted) && room.muted.indexOf((_c = user.username) !== null && _c !== void 0 ? _c : '') > -1;
};
const useMuteUserAction = (user, rid) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const room = (0, ui_contexts_1.useUserRoom)(rid);
    const userCanMute = (0, ui_contexts_1.usePermission)('mute-user', rid);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const closeModal = (0, fuselage_hooks_1.useMutableCallback)(() => setModal(null));
    const otherUserCanPostReadonly = (0, ui_contexts_1.useAllPermissions)((0, react_1.useMemo)(() => ['post-readonly'], []), rid);
    const userSubscription = (0, ui_contexts_1.useUserSubscription)(rid);
    const isMuted = getUserIsMuted(user, room, otherUserCanPostReadonly);
    const roomName = (room === null || room === void 0 ? void 0 : room.t) && (0, string_helpers_1.escapeHTML)(roomCoordinator_1.roomCoordinator.getRoomName(room.t, room));
    if (!room) {
        throw Error('Room not provided');
    }
    const { roomCanMute } = (0, getRoomDirectives_1.getRoomDirectives)({ room, showingUserId: user._id, userSubscription });
    const mutedMessage = isMuted ? 'User__username__unmuted_in_room__roomName__' : 'User__username__muted_in_room__roomName__';
    const muteUser = (0, ui_contexts_1.useEndpoint)('POST', isMuted ? '/v1/rooms.unmuteUser' : '/v1/rooms.muteUser');
    const muteUserOption = (0, react_1.useMemo)(() => {
        const action = () => {
            const onConfirm = () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    if (!user.username) {
                        throw new Error('User without username');
                    }
                    yield muteUser({ roomId: rid, username: user.username });
                    return dispatchToastMessage({
                        type: 'success',
                        message: t(mutedMessage, {
                            username: user.username,
                            roomName,
                        }),
                    });
                }
                catch (error) {
                    dispatchToastMessage({ type: 'error', message: error });
                }
                finally {
                    closeModal();
                }
            });
            if (isMuted) {
                return onConfirm();
            }
            return setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', confirmText: t('Yes_mute_user'), onClose: closeModal, onCancel: closeModal, onConfirm: onConfirm, children: t('The_user_wont_be_able_to_type_in_s', roomName) }));
        };
        return roomCanMute && userCanMute
            ? {
                content: t(isMuted ? 'Unmute_user' : 'Mute_user'),
                icon: isMuted ? 'mic' : 'mic-off',
                onClick: action,
                type: 'management',
            }
            : undefined;
    }, [
        closeModal,
        mutedMessage,
        dispatchToastMessage,
        isMuted,
        muteUser,
        rid,
        roomCanMute,
        roomName,
        setModal,
        t,
        user.username,
        userCanMute,
    ]);
    return muteUserOption;
};
exports.useMuteUserAction = useMuteUserAction;
