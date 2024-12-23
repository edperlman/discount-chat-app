"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAudioMessageAction = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const AudioRecorder_1 = require("../../../../../../../app/ui/client/lib/recorderjs/AudioRecorder");
const ChatContext_1 = require("../../../../contexts/ChatContext");
const useMediaActionTitle_1 = require("../../hooks/useMediaActionTitle");
const useMediaPermissions_1 = require("../../hooks/useMediaPermissions");
const audioRecorder = new AudioRecorder_1.AudioRecorder();
const useAudioMessageAction = (disabled, isMicrophoneDenied) => {
    const isFileUploadEnabled = (0, ui_contexts_1.useSetting)('FileUpload_Enabled', true);
    const isAudioRecorderEnabled = (0, ui_contexts_1.useSetting)('Message_AudioRecorderEnabled', true);
    const fileUploadMediaTypeBlackList = (0, ui_contexts_1.useSetting)('FileUpload_MediaTypeBlackList', '');
    const fileUploadMediaTypeWhiteList = (0, ui_contexts_1.useSetting)('FileUpload_MediaTypeWhiteList', '');
    const [isPermissionDenied] = (0, useMediaPermissions_1.useMediaPermissions)('microphone');
    const isAllowed = (0, react_1.useMemo)(() => Boolean(audioRecorder.isSupported() &&
        !isMicrophoneDenied &&
        isFileUploadEnabled &&
        isAudioRecorderEnabled &&
        !(fileUploadMediaTypeBlackList === null || fileUploadMediaTypeBlackList === void 0 ? void 0 : fileUploadMediaTypeBlackList.match(/audio\/mp3|audio\/\*/i)) &&
        (!fileUploadMediaTypeWhiteList || fileUploadMediaTypeWhiteList.match(/audio\/mp3|audio\/\*/i))), [fileUploadMediaTypeBlackList, fileUploadMediaTypeWhiteList, isAudioRecorderEnabled, isFileUploadEnabled, isMicrophoneDenied]);
    const getMediaActionTitle = (0, useMediaActionTitle_1.useMediaActionTitle)('audio', isPermissionDenied, isFileUploadEnabled, isAudioRecorderEnabled, isAllowed);
    const chat = (0, ChatContext_1.useChat)();
    const stopRecording = (0, fuselage_hooks_1.useMutableCallback)(() => {
        var _a;
        chat === null || chat === void 0 ? void 0 : chat.action.stop('recording');
        (_a = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _a === void 0 ? void 0 : _a.setRecordingMode(false);
    });
    const setMicrophoneDenied = (0, fuselage_hooks_1.useMutableCallback)((isDenied) => {
        var _a;
        if (isDenied) {
            stopRecording();
        }
        (_a = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _a === void 0 ? void 0 : _a.setIsMicrophoneDenied(isDenied);
    });
    (0, react_1.useEffect)(() => {
        setMicrophoneDenied(isPermissionDenied);
    }, [setMicrophoneDenied, isPermissionDenied]);
    const handleRecordButtonClick = () => { var _a; return (_a = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _a === void 0 ? void 0 : _a.setRecordingMode(true); };
    return {
        id: 'audio-message',
        content: getMediaActionTitle,
        icon: 'mic',
        disabled: !isAllowed || Boolean(disabled),
        onClick: handleRecordButtonClick,
    };
};
exports.useAudioMessageAction = useAudioMessageAction;
