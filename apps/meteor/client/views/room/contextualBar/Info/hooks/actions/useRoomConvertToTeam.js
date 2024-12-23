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
exports.useRoomConvertToTeam = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const GenericModal_1 = __importDefault(require("../../../../../../components/GenericModal"));
const useCanEditRoom_1 = require("../useCanEditRoom");
const useRoomConvertToTeam = (room) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const canEdit = (0, useCanEditRoom_1.useCanEditRoom)(room);
    const hasPermissionToConvertRoomToTeam = (0, ui_contexts_1.usePermission)('create-team');
    const canConvertRoomToTeam = (0, core_typings_1.isRoomFederated)(room) ? false : hasPermissionToConvertRoomToTeam;
    const allowConvertToTeam = !room.teamId && !room.prid && canConvertRoomToTeam && canEdit;
    const convertRoomToTeam = (0, ui_contexts_1.useEndpoint)('POST', room.t === 'c' ? '/v1/channels.convertToTeam' : '/v1/groups.convertToTeam');
    const handleConvertToTeam = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        const onConfirm = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield convertRoomToTeam(room.t === 'c' ? { channelId: room._id } : { roomId: room._id });
                dispatchToastMessage({ type: 'success', message: t('Room_has_been_converted') });
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                setModal(null);
            }
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { title: t('Confirmation'), variant: 'warning', onClose: () => setModal(null), onCancel: () => setModal(null), onConfirm: onConfirm, confirmText: t('Convert'), children: t('Converting_channel_to_a_team') }));
    }));
    return allowConvertToTeam ? handleConvertToTeam : null;
};
exports.useRoomConvertToTeam = useRoomConvertToTeam;
