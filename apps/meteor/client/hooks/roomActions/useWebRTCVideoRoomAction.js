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
exports.useWebRTCVideoRoomAction = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const SDKClient_1 = require("../../../app/utils/client/lib/SDKClient");
const RoomContext_1 = require("../../views/room/contexts/RoomContext");
const useWebRTCVideoRoomAction = () => {
    const enabled = (0, ui_contexts_1.useSetting)('WebRTC_Enabled', false);
    const room = (0, RoomContext_1.useRoom)();
    const federated = (0, core_typings_1.isRoomFederated)(room);
    const callProvider = (0, ui_contexts_1.useSetting)('Omnichannel_call_provider', 'default-provider');
    const allowed = enabled && callProvider === 'WebRTC' && room.servedBy;
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleClick = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!room.callStatus || room.callStatus === 'declined' || room.callStatus === 'ended') {
            yield SDKClient_1.sdk.rest.get('/v1/livechat/webrtc.call', { rid: room._id });
        }
        window.open(`/meet/${room._id}`, room._id);
    }), [room._id, room.callStatus]);
    return (0, react_1.useMemo)(() => {
        if (!allowed) {
            return undefined;
        }
        return Object.assign(Object.assign({ id: 'webRTCVideo', groups: ['live'], title: 'WebRTC_Call', icon: 'phone' }, (federated && {
            tooltip: t('core.Call_unavailable_for_federation'),
            disabled: true,
        })), { action: () => void handleClick(), full: true, order: 4 });
    }, [allowed, federated, handleClick, t]);
};
exports.useWebRTCVideoRoomAction = useWebRTCVideoRoomAction;
