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
exports.useE2EERoomAction = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const E2EEState_1 = require("../../../app/e2e/client/E2EEState");
const E2ERoomState_1 = require("../../../app/e2e/client/E2ERoomState");
const OtrRoomState_1 = require("../../../app/otr/lib/OtrRoomState");
const getRoomTypeTranslation_1 = require("../../lib/getRoomTypeTranslation");
const imperativeModal_1 = require("../../lib/imperativeModal");
const toast_1 = require("../../lib/toast");
const RoomContext_1 = require("../../views/room/contexts/RoomContext");
const useE2EERoomState_1 = require("../../views/room/hooks/useE2EERoomState");
const useE2EEState_1 = require("../../views/room/hooks/useE2EEState");
const BaseDisableE2EEModal_1 = __importDefault(require("../../views/room/modals/E2EEModals/BaseDisableE2EEModal"));
const EnableE2EEModal_1 = __importDefault(require("../../views/room/modals/E2EEModals/EnableE2EEModal"));
const useOTR_1 = require("../useOTR");
const useE2EERoomAction = () => {
    const enabled = (0, ui_contexts_1.useSetting)('E2E_Enable', false);
    const room = (0, RoomContext_1.useRoom)();
    const subscription = (0, RoomContext_1.useRoomSubscription)();
    const e2eeState = (0, useE2EEState_1.useE2EEState)();
    const e2eeRoomState = (0, useE2EERoomState_1.useE2EERoomState)(room._id);
    const isE2EEReady = e2eeState === E2EEState_1.E2EEState.READY || e2eeState === E2EEState_1.E2EEState.SAVE_PASSWORD;
    const readyToEncrypt = isE2EEReady || room.encrypted;
    const permittedToToggleEncryption = (0, ui_contexts_1.usePermission)('toggle-room-e2e-encryption', room._id);
    const permittedToEditRoom = (0, ui_contexts_1.usePermission)('edit-room', room._id);
    const permitted = (room.t === 'd' || (permittedToEditRoom && permittedToToggleEncryption)) && readyToEncrypt;
    const federated = (0, core_typings_1.isRoomFederated)(room);
    const { t } = (0, react_i18next_1.useTranslation)();
    const { otrState } = (0, useOTR_1.useOTR)();
    const isE2EERoomNotReady = () => {
        if (e2eeRoomState === E2ERoomState_1.E2ERoomState.NO_PASSWORD_SET ||
            e2eeRoomState === E2ERoomState_1.E2ERoomState.NOT_STARTED ||
            e2eeRoomState === E2ERoomState_1.E2ERoomState.DISABLED ||
            e2eeRoomState === E2ERoomState_1.E2ERoomState.ERROR ||
            e2eeRoomState === E2ERoomState_1.E2ERoomState.WAITING_KEYS) {
            return true;
        }
        return false;
    };
    const enabledOnRoom = !!room.encrypted;
    const roomType = (0, react_1.useMemo)(() => { var _a; return (_a = (0, getRoomTypeTranslation_1.getRoomTypeTranslation)(room)) === null || _a === void 0 ? void 0 : _a.toLowerCase(); }, [room]);
    const roomId = room._id;
    const toggleE2E = (0, ui_contexts_1.useEndpoint)('POST', '/v1/rooms.saveRoomSettings');
    const canResetRoomKey = enabled && isE2EEReady && (room.t === 'd' || permittedToToggleEncryption) && isE2EERoomNotReady();
    const action = (0, fuselage_hooks_1.useEffectEvent)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (otrState === OtrRoomState_1.OtrRoomState.ESTABLISHED || otrState === OtrRoomState_1.OtrRoomState.ESTABLISHING || otrState === OtrRoomState_1.OtrRoomState.REQUESTED) {
            (0, toast_1.dispatchToastMessage)({ type: 'error', message: t('E2EE_not_available_OTR') });
            return;
        }
        if (enabledOnRoom) {
            imperativeModal_1.imperativeModal.open({
                component: BaseDisableE2EEModal_1.default,
                props: {
                    onClose: imperativeModal_1.imperativeModal.close,
                    onConfirm: handleToogleE2E,
                    roomType,
                    roomId,
                    canResetRoomKey,
                },
            });
        }
        else {
            imperativeModal_1.imperativeModal.open({
                component: EnableE2EEModal_1.default,
                props: {
                    onClose: imperativeModal_1.imperativeModal.close,
                    onConfirm: handleToogleE2E,
                    roomType,
                },
            });
        }
    }));
    const handleToogleE2E = () => __awaiter(void 0, void 0, void 0, function* () {
        const { success } = yield toggleE2E({ rid: room._id, encrypted: !room.encrypted });
        if (!success) {
            return;
        }
        imperativeModal_1.imperativeModal.close();
        (0, toast_1.dispatchToastMessage)({
            type: 'success',
            message: room.encrypted
                ? t('E2E_Encryption_disabled_for_room', { roomName: room.name })
                : t('E2E_Encryption_enabled_for_room', { roomName: room.name }),
        });
        if (subscription === null || subscription === void 0 ? void 0 : subscription.autoTranslate) {
            (0, toast_1.dispatchToastMessage)({ type: 'success', message: t('AutoTranslate_Disabled_for_room', { roomName: room.name }) });
        }
    });
    return (0, react_1.useMemo)(() => {
        if (!enabled || !permitted) {
            return undefined;
        }
        return Object.assign({ id: 'e2e', groups: ['direct', 'direct_multiple', 'group', 'team'], title: enabledOnRoom ? 'E2E_disable' : 'E2E_enable', icon: 'key', order: 13, action, type: 'organization' }, (federated && {
            tooltip: t('core.E2E_unavailable_for_federation'),
            disabled: true,
        }));
    }, [enabled, permitted, federated, t, enabledOnRoom, action]);
};
exports.useE2EERoomAction = useE2EERoomAction;
