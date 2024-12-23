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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToggleAutoJoin = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const i18next_1 = require("i18next");
const roomCoordinator_1 = require("../../../../../lib/rooms/roomCoordinator");
const useToggleAutoJoin = (room, { reload, mainRoom }) => {
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const updateRoomEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/teams.updateRoom');
    const canEditTeamChannel = (0, ui_contexts_1.usePermission)('edit-team-channel', room._id);
    const maxNumberOfAutoJoinMembers = (0, ui_contexts_1.useSetting)('API_User_Limit', 500);
    const handleToggleAutoJoin = () => __awaiter(void 0, void 0, void 0, function* () {
        // Sanity check, the setting has a default value, therefore it should always be defined
        if (!maxNumberOfAutoJoinMembers) {
            return;
        }
        try {
            const { room: updatedRoom } = yield updateRoomEndpoint({
                roomId: room._id,
                isDefault: !room.teamDefault,
            });
            if (updatedRoom.teamDefault) {
                // If the number of members in the mainRoom (the team) is greater than the limit, show an info message
                // informing that not all members will be auto-joined to the channel
                const messageType = mainRoom.usersCount > maxNumberOfAutoJoinMembers ? 'info' : 'success';
                const message = mainRoom.usersCount > maxNumberOfAutoJoinMembers ? 'Team_Auto-join_exceeded_user_limit' : 'Team_Auto-join_updated';
                dispatchToastMessage({
                    type: messageType,
                    message: (0, i18next_1.t)(message, {
                        channelName: roomCoordinator_1.roomCoordinator.getRoomName(room.t, room),
                        numberOfMembers: updatedRoom.usersCount,
                        limit: maxNumberOfAutoJoinMembers,
                    }),
                });
            }
            reload === null || reload === void 0 ? void 0 : reload();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
    return { handleToggleAutoJoin, canEditTeamChannel };
};
exports.useToggleAutoJoin = useToggleAutoJoin;
