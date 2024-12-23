"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMediaActionTitle = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useMediaActionTitle = (media, isPermissionDenied, isFileUploadEnabled, isMediaEnabled, isAllowed) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const getMediaActionTitle = (0, react_1.useMemo)(() => {
        if (isPermissionDenied) {
            return media === 'audio' ? t('Microphone_access_not_allowed') : t('Camera_access_not_allowed');
        }
        if (!isFileUploadEnabled) {
            return t('File_Upload_Disabled');
        }
        if (!isMediaEnabled) {
            return media === 'audio' ? t('Message_Audio_Recording_Disabled') : t('Message_Video_Recording_Disabled');
        }
        if (!isAllowed) {
            return t('error-not-allowed');
        }
        return media === 'audio' ? t('Audio_message') : t('Video_message');
    }, [media, isPermissionDenied, isFileUploadEnabled, isMediaEnabled, isAllowed, t]);
    return getMediaActionTitle;
};
exports.useMediaActionTitle = useMediaActionTitle;
