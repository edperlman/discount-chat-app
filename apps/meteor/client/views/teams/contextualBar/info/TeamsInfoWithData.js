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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const LeaveTeam_1 = __importDefault(require("./LeaveTeam"));
const TeamsInfo_1 = __importDefault(require("./TeamsInfo"));
const useEndpointAction_1 = require("../../../../hooks/useEndpointAction");
const useHideRoomAction_1 = require("../../../../hooks/useHideRoomAction");
const useDeleteRoom_1 = require("../../../hooks/roomActions/useDeleteRoom");
const RoomContext_1 = require("../../../room/contexts/RoomContext");
const RoomToolboxContext_1 = require("../../../room/contexts/RoomToolboxContext");
const ConvertToChannelModal_1 = __importDefault(require("../../ConvertToChannelModal"));
const TeamsInfoWithLogic = ({ openEditing }) => {
    var _a;
    const room = (0, RoomContext_1.useRoom)();
    const { openTab, closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const userId = (0, ui_contexts_1.useUserId)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const closeModal = (0, fuselage_hooks_1.useMutableCallback)(() => setModal());
    const leaveTeam = (0, useEndpointAction_1.useEndpointAction)('POST', '/v1/teams.leave');
    const convertTeamToChannel = (0, useEndpointAction_1.useEndpointAction)('POST', '/v1/teams.convertToChannel');
    const hideTeam = (0, useHideRoomAction_1.useHideRoomAction)({ rid: room._id, type: room.t, name: (_a = room.name) !== null && _a !== void 0 ? _a : '' });
    const router = (0, ui_contexts_1.useRouter)();
    const canEdit = (0, ui_contexts_1.usePermission)('edit-team-channel', room._id);
    // const canLeave = usePermission('leave-team'); /* && room.cl !== false && joined */
    const { handleDelete, canDeleteRoom } = (0, useDeleteRoom_1.useDeleteRoom)(room);
    const onClickLeave = (0, fuselage_hooks_1.useMutableCallback)(() => {
        const onConfirm = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (selectedRooms = {}) {
            const roomsLeft = Object.keys(selectedRooms);
            const roomsToLeave = Array.isArray(roomsLeft) && roomsLeft.length > 0 ? roomsLeft : [];
            try {
                yield leaveTeam(Object.assign({ teamId: room.teamId }, (roomsToLeave.length && { rooms: roomsToLeave })));
                dispatchToastMessage({ type: 'success', message: t('Teams_left_team_successfully') });
                router.navigate('/home');
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                closeModal();
            }
        });
        setModal((0, jsx_runtime_1.jsx)(LeaveTeam_1.default, { onConfirm: onConfirm, onCancel: closeModal, teamId: room.teamId }));
    });
    const onClickViewChannels = (0, react_1.useCallback)(() => openTab('team-channels'), [openTab]);
    const onClickConvertToChannel = (0, fuselage_hooks_1.useMutableCallback)(() => {
        const onConfirm = (roomsToRemove) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield convertTeamToChannel({
                    teamId: room.teamId,
                    roomsToRemove: Object.keys(roomsToRemove),
                });
                dispatchToastMessage({ type: 'success', message: t('Success') });
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                closeModal();
            }
        });
        setModal((0, jsx_runtime_1.jsx)(ConvertToChannelModal_1.default, { onClose: closeModal, onCancel: closeModal, onConfirm: onConfirm, teamId: room.teamId, userId: userId }));
    });
    return ((0, jsx_runtime_1.jsx)(TeamsInfo_1.default, { room: room, onClickEdit: canEdit ? openEditing : undefined, onClickClose: closeTab, onClickDelete: canDeleteRoom ? handleDelete : undefined, onClickLeave: onClickLeave, onClickHide: hideTeam, onClickViewChannels: onClickViewChannels, onClickConvertToChannel: canEdit ? onClickConvertToChannel : undefined }));
};
exports.default = TeamsInfoWithLogic;
