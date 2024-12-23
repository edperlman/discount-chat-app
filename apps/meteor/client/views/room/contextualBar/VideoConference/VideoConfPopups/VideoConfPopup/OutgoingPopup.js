"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_video_conf_1 = require("@rocket.chat/ui-video-conf");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const VideoConfPopupRoomInfo_1 = __importDefault(require("./VideoConfPopupRoomInfo"));
const VideoConfContext_1 = require("../../../../../../contexts/VideoConfContext");
const OutgoingPopup = ({ room, onClose, id }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const videoConfPreferences = (0, VideoConfContext_1.useVideoConfPreferences)();
    const { controllersConfig } = (0, ui_video_conf_1.useVideoConfControllers)(videoConfPreferences);
    const capabilities = (0, VideoConfContext_1.useVideoConfCapabilities)();
    const showCam = !!capabilities.cam;
    const showMic = !!capabilities.mic;
    return ((0, jsx_runtime_1.jsxs)(ui_video_conf_1.VideoConfPopup, { children: [(0, jsx_runtime_1.jsxs)(ui_video_conf_1.VideoConfPopupHeader, { children: [(0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfPopupTitle, { text: t('Calling'), counter: true }), (showCam || showMic) && ((0, jsx_runtime_1.jsxs)(ui_video_conf_1.VideoConfPopupControllers, { children: [showCam && ((0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfController, { active: controllersConfig.cam, title: controllersConfig.cam ? t('Cam_on') : t('Cam_off'), icon: controllersConfig.cam ? 'video' : 'video-off', disabled: true })), showMic && ((0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfController, { active: controllersConfig.mic, title: controllersConfig.mic ? t('Mic_on') : t('Mic_off'), icon: controllersConfig.mic ? 'mic' : 'mic-off', disabled: true }))] }))] }), (0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfPopupContent, { children: (0, jsx_runtime_1.jsx)(VideoConfPopupRoomInfo_1.default, { room: room }) }), (0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfPopupFooter, { children: (0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfPopupFooterButtons, { children: onClose && (0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfButton, { onClick: () => onClose(id), children: t('Cancel') }) }) })] }));
};
exports.default = OutgoingPopup;
