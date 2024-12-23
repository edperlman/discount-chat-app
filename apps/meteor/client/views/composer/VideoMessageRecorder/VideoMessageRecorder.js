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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const UserAction_1 = require("../../../../app/ui/client/lib/UserAction");
const videoRecorder_1 = require("../../../../app/ui/client/lib/recorderjs/videoRecorder");
const ChatContext_1 = require("../../room/contexts/ChatContext");
const videoContainerClass = (0, css_in_js_1.css) `
	transform: scaleX(-1);
	filter: FlipH;

	@media (max-width: 500px) {
		& > video {
			width: 100%;
			height: 100%;
		}
	}
`;
const getVideoRecordingExtension = () => {
    const supported = videoRecorder_1.VideoRecorder.getSupportedMimeTypes();
    if (supported.match(/video\/webm/)) {
        return 'webm';
    }
    return 'mp4';
};
const VideoMessageRecorder = ({ rid, tmid, chatContext, reference }) => {
    var _a;
    const t = (0, ui_contexts_1.useTranslation)();
    const videoRef = (0, react_1.useRef)(null);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const [time, setTime] = (0, react_1.useState)();
    const [recordingState, setRecordingState] = (0, react_1.useState)('idle');
    const [recordingInterval, setRecordingInterval] = (0, react_1.useState)(null);
    const isRecording = recordingState === 'recording';
    const sendButtonDisabled = !(videoRecorder_1.VideoRecorder.cameraStarted.get() && !(recordingState === 'recording'));
    const chat = (_a = (0, ChatContext_1.useChat)()) !== null && _a !== void 0 ? _a : chatContext;
    const stopVideoRecording = (rid, tmid) => __awaiter(void 0, void 0, void 0, function* () {
        if (recordingInterval) {
            clearInterval(recordingInterval);
        }
        setRecordingInterval(null);
        videoRecorder_1.VideoRecorder.stopRecording();
        UserAction_1.UserAction.stop(rid, UserAction_1.USER_ACTIVITIES.USER_RECORDING, { tmid });
        setRecordingState('idle');
    });
    const handleRecord = () => __awaiter(void 0, void 0, void 0, function* () {
        if (recordingState === 'recording') {
            stopVideoRecording(rid, tmid);
        }
        else {
            videoRecorder_1.VideoRecorder.record();
            setRecordingState('recording');
            UserAction_1.UserAction.performContinuously(rid, UserAction_1.USER_ACTIVITIES.USER_RECORDING, { tmid });
            setTime('00:00');
            const startTime = new Date();
            setRecordingInterval(setInterval(() => {
                const now = new Date();
                const distance = (now.getTime() - startTime.getTime()) / 1000;
                const minutes = Math.floor(distance / 60);
                const seconds = Math.floor(distance % 60);
                setTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            }, 1000));
        }
    });
    const handleSendRecord = () => __awaiter(void 0, void 0, void 0, function* () {
        const cb = (blob) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const fileName = `${t('Video_record')}.${getVideoRecordingExtension()}`;
            const file = new File([blob], fileName, { type: videoRecorder_1.VideoRecorder.getSupportedMimeTypes().split(';')[0] });
            yield (chat === null || chat === void 0 ? void 0 : chat.flows.uploadFiles([file]));
            (_a = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _a === void 0 ? void 0 : _a.setRecordingVideo(false);
        });
        videoRecorder_1.VideoRecorder.stop(cb);
        setTime(undefined);
        stopVideoRecording(rid, tmid);
    });
    const handleCancel = (0, fuselage_hooks_1.useMutableCallback)(() => {
        var _a;
        videoRecorder_1.VideoRecorder.stop();
        (_a = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _a === void 0 ? void 0 : _a.setRecordingVideo(false);
        setTime(undefined);
        stopVideoRecording(rid, tmid);
    });
    (0, react_1.useEffect)(() => {
        var _a;
        if (!videoRecorder_1.VideoRecorder.getSupportedMimeTypes()) {
            return dispatchToastMessage({ type: 'error', message: t('Browser_does_not_support_recording_video') });
        }
        videoRecorder_1.VideoRecorder.start((_a = videoRef.current) !== null && _a !== void 0 ? _a : undefined, (success) => (!success ? handleCancel() : undefined));
        return () => {
            videoRecorder_1.VideoRecorder.stop();
        };
    }, [dispatchToastMessage, handleCancel, t]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.PositionAnimated, { visible: 'visible', anchor: reference, placement: 'top-end', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { bg: 'light', padding: 4, borderRadius: 4, elevation: '2', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: videoContainerClass, overflow: 'hidden', height: 240, borderRadius: 4, children: (0, jsx_runtime_1.jsx)("video", { muted: true, autoPlay: true, playsInline: true, ref: videoRef, width: 320, height: 240 }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbs: 4, display: 'flex', justifyContent: 'space-between', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, onClick: handleRecord, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'span', display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { size: 'x16', mie: time ? 4 : undefined, name: isRecording ? 'stop-unfilled' : 'rec' }), time && (0, jsx_runtime_1.jsx)("span", { children: time })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, onClick: handleCancel, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, small: true, disabled: sendButtonDisabled, onClick: handleSendRecord, children: t('Send') })] })] })] }) }));
};
exports.default = VideoMessageRecorder;
