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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_video_conf_1 = require("@rocket.chat/ui-video-conf");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const VideoConfPopupRoomInfo_1 = __importDefault(require("./VideoConfPopupRoomInfo"));
const VideoConfContext_1 = require("../../../../../../contexts/VideoConfContext");
const useVideoConfRoomName_1 = require("../../hooks/useVideoConfRoomName");
const StartCallPopup = ({ id, loading, room, onClose, onConfirm }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const ref = (0, react_1.useRef)(null);
    (0, fuselage_hooks_1.useOutsideClick)([ref], !loading ? onClose : () => undefined);
    const setPreferences = (0, VideoConfContext_1.useVideoConfSetPreferences)();
    const videoConfPreferences = (0, VideoConfContext_1.useVideoConfPreferences)();
    const { controllersConfig, handleToggleMic, handleToggleCam } = (0, ui_video_conf_1.useVideoConfControllers)(videoConfPreferences);
    const capabilities = (0, VideoConfContext_1.useVideoConfCapabilities)();
    const roomName = (0, useVideoConfRoomName_1.useVideoConfRoomName)(room);
    const dialogLabel = room.t === 'd' ? `${t('Start_a_call_with__roomName__', { roomName })}` : `${t('Start_a_call_in__roomName__', { roomName })}`;
    const showCam = !!capabilities.cam;
    const showMic = !!capabilities.mic;
    const handleStartCall = (0, fuselage_hooks_1.useEffectEvent)(() => {
        setPreferences(controllersConfig);
        onConfirm();
    });
    const callbackRef = (0, react_1.useCallback)((node) => {
        if (!node) {
            return;
        }
        ref.current = node;
        node.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        });
    }, [onClose]);
    return ((0, jsx_runtime_1.jsxs)(ui_video_conf_1.VideoConfPopup, { ref: callbackRef, id: id, "aria-label": dialogLabel, children: [(0, jsx_runtime_1.jsxs)(ui_video_conf_1.VideoConfPopupHeader, { children: [(0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfPopupTitle, { text: t('Start_a_call') }), (showCam || showMic) && ((0, jsx_runtime_1.jsxs)(ui_video_conf_1.VideoConfPopupControllers, { children: [showCam && ((0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfController, { active: controllersConfig.cam, title: controllersConfig.cam ? t('Cam_on') : t('Cam_off'), icon: controllersConfig.cam ? 'video' : 'video-off', onClick: handleToggleCam })), showMic && ((0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfController, { active: controllersConfig.mic, title: controllersConfig.mic ? t('Mic_on') : t('Mic_off'), icon: controllersConfig.mic ? 'mic' : 'mic-off', onClick: handleToggleMic }))] }))] }), (0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfPopupContent, { children: (0, jsx_runtime_1.jsx)(VideoConfPopupRoomInfo_1.default, { room: room }) }), (0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfPopupFooter, { children: (0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfPopupFooterButtons, { children: (0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfButton, { disabled: loading, primary: true, onClick: handleStartCall, children: t('Start_call') }) }) })] }));
};
exports.default = StartCallPopup;
