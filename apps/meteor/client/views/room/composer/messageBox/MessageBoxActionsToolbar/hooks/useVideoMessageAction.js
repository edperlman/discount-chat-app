"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVideoMessageAction = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const videoRecorder_1 = require("../../../../../../../app/ui/client/lib/recorderjs/videoRecorder");
const ChatContext_1 = require("../../../../contexts/ChatContext");
const useMediaActionTitle_1 = require("../../hooks/useMediaActionTitle");
const useMediaPermissions_1 = require("../../hooks/useMediaPermissions");
const useVideoMessageAction = (disabled) => {
    const isFileUploadEnabled = (0, ui_contexts_1.useSetting)('FileUpload_Enabled', true);
    const isVideoRecorderEnabled = (0, ui_contexts_1.useSetting)('Message_VideoRecorderEnabled', true);
    const fileUploadMediaTypeBlackList = (0, ui_contexts_1.useSetting)('FileUpload_MediaTypeBlackList', 'image/svg+xml');
    const fileUploadMediaTypeWhiteList = (0, ui_contexts_1.useSetting)('FileUpload_MediaTypeWhiteList', '');
    const [isPermissionDenied, setIsPermissionDenied] = (0, useMediaPermissions_1.useMediaPermissions)('camera');
    const isAllowed = (0, react_1.useMemo)(() => Boolean(!isPermissionDenied &&
        navigator.mediaDevices &&
        window.MediaRecorder &&
        isFileUploadEnabled &&
        isVideoRecorderEnabled &&
        !(fileUploadMediaTypeBlackList === null || fileUploadMediaTypeBlackList === void 0 ? void 0 : fileUploadMediaTypeBlackList.match(/video\/webm|video\/\*/i)) &&
        (!fileUploadMediaTypeWhiteList || fileUploadMediaTypeWhiteList.match(/video\/webm|video\/\*/i)) &&
        Boolean(videoRecorder_1.VideoRecorder.getSupportedMimeTypes())), [fileUploadMediaTypeBlackList, fileUploadMediaTypeWhiteList, isFileUploadEnabled, isPermissionDenied, isVideoRecorderEnabled]);
    const getMediaActionTitle = (0, useMediaActionTitle_1.useMediaActionTitle)('video', isPermissionDenied, isFileUploadEnabled, isVideoRecorderEnabled, isAllowed);
    const chat = (0, ChatContext_1.useChat)();
    const handleOpenVideoMessage = () => {
        var _a, _b;
        if (!((_a = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _a === void 0 ? void 0 : _a.recordingVideo.get())) {
            (_b = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _b === void 0 ? void 0 : _b.setRecordingVideo(true);
        }
    };
    const handleDenyVideo = (0, fuselage_hooks_1.useMutableCallback)((isDenied) => {
        var _a;
        if (isDenied) {
            (_a = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _a === void 0 ? void 0 : _a.setRecordingVideo(false);
        }
        setIsPermissionDenied(isDenied);
    });
    (0, react_1.useEffect)(() => {
        handleDenyVideo(isPermissionDenied);
    }, [handleDenyVideo, isPermissionDenied]);
    return {
        id: 'video-message',
        content: getMediaActionTitle,
        icon: 'video',
        disabled: !isAllowed || Boolean(disabled),
        onClick: handleOpenVideoMessage,
    };
};
exports.useVideoMessageAction = useVideoMessageAction;
