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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const VideoConfContext_1 = require("../../../contexts/VideoConfContext");
const VideoConfManager_1 = require("../../../lib/VideoConfManager");
const RoomContext_1 = require("../../../views/room/contexts/RoomContext");
const useVideoConfWarning_1 = require("../../../views/room/contextualBar/VideoConference/hooks/useVideoConfWarning");
const useVideoConfMenuOptions = () => {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const room = (0, RoomContext_1.useRoom)();
    const user = (0, ui_contexts_1.useUser)();
    const federated = (0, core_typings_1.isRoomFederated)(room);
    const ownUser = ((_a = room.uids) === null || _a === void 0 ? void 0 : _a.length) === 1 || false;
    const permittedToPostReadonly = (0, ui_contexts_1.usePermission)('post-readonly', room._id);
    const permittedToCallManagement = (0, ui_contexts_1.usePermission)('call-management', room._id);
    const dispatchWarning = (0, useVideoConfWarning_1.useVideoConfWarning)();
    const dispatchPopup = (0, VideoConfContext_1.useVideoConfDispatchOutgoing)();
    const isCalling = (0, VideoConfContext_1.useVideoConfIsCalling)();
    const isRinging = (0, VideoConfContext_1.useVideoConfIsRinging)();
    const enabledForDMs = (0, ui_contexts_1.useSetting)('VideoConf_Enable_DMs', true);
    const enabledForChannels = (0, ui_contexts_1.useSetting)('VideoConf_Enable_Channels', true);
    const enabledForTeams = (0, ui_contexts_1.useSetting)('VideoConf_Enable_Teams', true);
    const enabledForGroups = (0, ui_contexts_1.useSetting)('VideoConf_Enable_Groups', true);
    const enabledForLiveChat = (0, ui_contexts_1.useSetting)('Omnichannel_call_provider', 'default-provider') === 'default-provider';
    const groups = (0, fuselage_hooks_1.useStableArray)([
        enabledForDMs && 'direct',
        enabledForDMs && 'direct_multiple',
        enabledForGroups && 'group',
        enabledForLiveChat && 'live',
        enabledForTeams && 'team',
        enabledForChannels && 'channel',
    ].filter((group) => !!group));
    const visible = groups.length > 0;
    const allowed = visible && permittedToCallManagement && (!(user === null || user === void 0 ? void 0 : user.username) || !((_b = room.muted) === null || _b === void 0 ? void 0 : _b.includes(user.username))) && !ownUser;
    const disabled = federated || (!!room.ro && !permittedToPostReadonly);
    const tooltip = disabled ? t('core.Video_Call_unavailable_for_this_type_of_room') : '';
    const order = (0, core_typings_1.isOmnichannelRoom)(room) ? -1 : 4;
    const handleOpenVideoConf = (0, fuselage_hooks_1.useEffectEvent)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (isCalling || isRinging) {
            return;
        }
        try {
            yield VideoConfManager_1.VideoConfManager.loadCapabilities();
            dispatchPopup({ rid: room._id });
        }
        catch (error) {
            dispatchWarning(error.error);
        }
    }));
    return (0, react_1.useMemo)(() => {
        const items = [
            {
                id: 'start-video-call',
                icon: 'video',
                disabled,
                onClick: handleOpenVideoConf,
                content: ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', title: tooltip, children: t('Video_call') })),
            },
        ];
        return {
            items,
            disabled,
            allowed,
            order,
            groups,
        };
    }, [allowed, disabled, groups, handleOpenVideoConf, order, t, tooltip]);
};
exports.default = useVideoConfMenuOptions;
