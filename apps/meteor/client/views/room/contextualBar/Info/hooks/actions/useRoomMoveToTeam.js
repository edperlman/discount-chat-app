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
exports.useRoomMoveToTeam = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const ChannelToTeamModal_1 = __importDefault(require("../../ChannelToTeamModal"));
const useCanEditRoom_1 = require("../useCanEditRoom");
const useRoomMoveToTeam = (room) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const canEdit = (0, useCanEditRoom_1.useCanEditRoom)(room);
    const canMoveToTeam = !(0, core_typings_1.isRoomFederated)(room) && !room.teamId && !room.prid && canEdit;
    const moveChannelToTeam = (0, ui_contexts_1.useEndpoint)('POST', '/v1/teams.addRooms');
    const handleMoveToTeam = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        const onConfirm = (teamId) => __awaiter(void 0, void 0, void 0, function* () {
            if (!teamId) {
                throw new Error('teamId not provided');
            }
            try {
                yield moveChannelToTeam({ rooms: [room._id], teamId });
                dispatchToastMessage({ type: 'success', message: t('Rooms_added_successfully') });
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                setModal(null);
            }
        });
        setModal((0, jsx_runtime_1.jsx)(ChannelToTeamModal_1.default, { onCancel: () => setModal(null), onConfirm: onConfirm }));
    }));
    return canMoveToTeam ? handleMoveToTeam : null;
};
exports.useRoomMoveToTeam = useRoomMoveToTeam;
