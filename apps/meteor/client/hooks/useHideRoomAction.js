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
exports.useHideRoomAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useDontAskAgain_1 = require("./useDontAskAgain");
const IRoomTypeConfig_1 = require("../../definition/IRoomTypeConfig");
const GenericModal_1 = require("../components/GenericModal");
const updateSubscription_1 = require("../lib/mutationEffects/updateSubscription");
const roomCoordinator_1 = require("../lib/rooms/roomCoordinator");
const CLOSE_ENDPOINTS_BY_ROOM_TYPE = {
    p: '/v1/groups.close', // private
    c: '/v1/channels.close', // channel
    d: '/v1/im.close', // direct message
    v: '/v1/channels.close', // omnichannel voip
    l: '/v1/channels.close', // livechat
};
const useHideRoomAction = ({ rid: roomId, type, name }, { redirect = true } = {}) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const closeModal = (0, fuselage_hooks_1.useEffectEvent)(() => setModal());
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const dontAskHideRoom = (0, useDontAskAgain_1.useDontAskAgain)('hideRoom');
    const router = (0, ui_contexts_1.useRouter)();
    const userId = (0, ui_contexts_1.useUserId)();
    const hideRoomEndpoint = (0, ui_contexts_1.useEndpoint)('POST', CLOSE_ENDPOINTS_BY_ROOM_TYPE[type]);
    const hideRoom = (0, react_query_1.useMutation)({
        mutationFn: () => hideRoomEndpoint({ roomId }),
        onMutate: () => __awaiter(void 0, void 0, void 0, function* () {
            closeModal();
            if (userId) {
                return (0, updateSubscription_1.updateSubscription)(roomId, userId, { alert: false, open: false });
            }
        }),
        onSuccess: () => {
            if (redirect) {
                router.navigate('/home');
            }
        },
        onError: (error, _, rollbackDocument) => __awaiter(void 0, void 0, void 0, function* () {
            dispatchToastMessage({ type: 'error', message: error });
            if (userId && rollbackDocument) {
                const { alert, open } = rollbackDocument;
                (0, updateSubscription_1.updateSubscription)(roomId, userId, { alert, open });
            }
        }),
    });
    const handleHide = (0, fuselage_hooks_1.useEffectEvent)(() => __awaiter(void 0, void 0, void 0, function* () {
        const warnText = roomCoordinator_1.roomCoordinator.getRoomDirectives(type).getUiText(IRoomTypeConfig_1.UiTextContext.HIDE_WARNING);
        if (dontAskHideRoom) {
            hideRoom.mutate();
            return;
        }
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.GenericModalDoNotAskAgain, { variant: 'danger', confirmText: t('Yes_hide_it'), cancelText: t('Cancel'), onClose: closeModal, onCancel: closeModal, onConfirm: () => hideRoom.mutate(), dontAskAgain: {
                action: 'hideRoom',
                label: t('Hide_room'),
            }, children: t(warnText, { postProcess: 'sprintf', sprintf: [name] }) }));
    }));
    return handleHide;
};
exports.useHideRoomAction = useHideRoomAction;
