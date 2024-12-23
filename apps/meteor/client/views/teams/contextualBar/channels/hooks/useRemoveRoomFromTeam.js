"use strict";
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
exports.useRemoveRoomFromTeam = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../../../components/GenericModal"));
const roomCoordinator_1 = require("../../../../../lib/rooms/roomCoordinator");
const useRemoveRoomFromTeam = (room, { reload }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const canRemoveTeamChannel = (0, ui_contexts_1.usePermission)('remove-team-channel', room._id);
    const removeRoomEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/teams.removeRoom');
    const handleRemoveRoom = () => {
        const onConfirmAction = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!room.teamId) {
                return;
            }
            try {
                yield removeRoomEndpoint({ teamId: room.teamId, roomId: room._id });
                dispatchToastMessage({ type: 'error', message: t('Room_has_been_removed') });
                reload === null || reload === void 0 ? void 0 : reload();
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                setModal(null);
            }
        });
        return setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', onCancel: () => setModal(null), onConfirm: onConfirmAction, confirmText: t('Remove'), children: t('Team_Remove_from_team_modal_content', {
                teamName: roomCoordinator_1.roomCoordinator.getRoomName(room.t, room),
            }) }));
    };
    return { handleRemoveRoom, canRemoveTeamChannel };
};
exports.useRemoveRoomFromTeam = useRemoveRoomFromTeam;
