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
exports.useRoomLeave = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const client_1 = require("../../../../../../../app/ui-utils/client");
const IRoomTypeConfig_1 = require("../../../../../../../definition/IRoomTypeConfig");
const WarningModal_1 = __importDefault(require("../../../../../../components/WarningModal"));
const roomCoordinator_1 = require("../../../../../../lib/rooms/roomCoordinator");
// TODO implement joined
const useRoomLeave = (room, joined = true) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const leaveRoom = (0, ui_contexts_1.useMethod)('leaveRoom');
    const router = (0, ui_contexts_1.useRouter)();
    const canLeave = (0, ui_contexts_1.usePermission)(room.t === 'c' ? 'leave-c' : 'leave-p') && room.cl !== false && joined;
    const handleLeave = (0, fuselage_hooks_1.useMutableCallback)(() => {
        const leaveAction = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield leaveRoom(room._id);
                router.navigate('/home');
                client_1.LegacyRoomManager.close(room._id);
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            setModal(null);
        });
        const warnText = roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t).getUiText(IRoomTypeConfig_1.UiTextContext.LEAVE_WARNING);
        setModal((0, jsx_runtime_1.jsx)(WarningModal_1.default, { text: t(warnText, room.fname || room.name), confirmText: t('Leave_room'), close: () => setModal(null), cancelText: t('Cancel'), confirm: leaveAction }));
    });
    return canLeave ? handleLeave : null;
};
exports.useRoomLeave = useRoomLeave;
