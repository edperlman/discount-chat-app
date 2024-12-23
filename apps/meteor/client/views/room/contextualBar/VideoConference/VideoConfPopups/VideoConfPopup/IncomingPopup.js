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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_video_conf_1 = require("@rocket.chat/ui-video-conf");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const VideoConfPopupRoomInfo_1 = __importDefault(require("./VideoConfPopupRoomInfo"));
const VideoConfContext_1 = require("../../../../../../contexts/VideoConfContext");
const useAsyncState_1 = require("../../../../../../hooks/useAsyncState");
const useEndpointData_1 = require("../../../../../../hooks/useEndpointData");
const IncomingPopup = ({ id, room, position, onClose, onMute, onConfirm }) => {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { controllersConfig, handleToggleMic, handleToggleCam } = (0, ui_video_conf_1.useVideoConfControllers)();
    const setPreferences = (0, VideoConfContext_1.useVideoConfSetPreferences)();
    const params = (0, react_1.useMemo)(() => ({ callId: id }), [id]);
    const { phase, value } = (0, useEndpointData_1.useEndpointData)('/v1/video-conference.info', { params });
    const showMic = Boolean((_a = value === null || value === void 0 ? void 0 : value.capabilities) === null || _a === void 0 ? void 0 : _a.mic);
    const showCam = Boolean((_b = value === null || value === void 0 ? void 0 : value.capabilities) === null || _b === void 0 ? void 0 : _b.cam);
    const handleJoinCall = (0, fuselage_hooks_1.useMutableCallback)(() => {
        setPreferences(controllersConfig);
        onConfirm();
    });
    return ((0, jsx_runtime_1.jsxs)(ui_video_conf_1.VideoConfPopup, { position: position, children: [(0, jsx_runtime_1.jsxs)(ui_video_conf_1.VideoConfPopupHeader, { children: [(0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfPopupTitle, { text: t('Incoming_call_from') }), phase === useAsyncState_1.AsyncStatePhase.LOADING && (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}), phase === useAsyncState_1.AsyncStatePhase.RESOLVED && (showMic || showCam) && ((0, jsx_runtime_1.jsxs)(ui_video_conf_1.VideoConfPopupControllers, { children: [showCam && ((0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfController, { active: controllersConfig.cam, title: controllersConfig.cam ? t('Cam_on') : t('Cam_off'), icon: controllersConfig.cam ? 'video' : 'video-off', onClick: handleToggleCam })), showMic && ((0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfController, { active: controllersConfig.mic, title: controllersConfig.mic ? t('Mic_on') : t('Mic_off'), icon: controllersConfig.mic ? 'mic' : 'mic-off', onClick: handleToggleMic }))] }))] }), (0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfPopupContent, { children: (0, jsx_runtime_1.jsx)(VideoConfPopupRoomInfo_1.default, { room: room }) }), (0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfPopupFooter, { children: (0, jsx_runtime_1.jsxs)(ui_video_conf_1.VideoConfPopupFooterButtons, { children: [(0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfButton, { primary: true, onClick: handleJoinCall, children: t('Accept') }), onClose && ((0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfButton, { danger: true, secondary: true, onClick: () => onClose(id), children: t('Decline') })), (0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfController, { small: false, secondary: true, title: t('Mute_and_dismiss'), icon: 'cross', onClick: () => onMute(id) })] }) })] }));
};
exports.default = IncomingPopup;
