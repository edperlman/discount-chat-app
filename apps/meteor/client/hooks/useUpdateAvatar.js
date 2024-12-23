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
exports.useUpdateAvatar = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useEndpointAction_1 = require("./useEndpointAction");
const useEndpointUpload_1 = require("./useEndpointUpload");
const isAvatarReset = (avatarObj) => avatarObj === 'reset';
const isServiceObject = (avatarObj) => !isAvatarReset(avatarObj) && typeof avatarObj === 'object' && 'service' in avatarObj;
const isAvatarUrl = (avatarObj) => !isAvatarReset(avatarObj) && typeof avatarObj === 'object' && 'service' && 'avatarUrl' in avatarObj;
const useUpdateAvatar = (avatarObj, userId) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const avatarUrl = isAvatarUrl(avatarObj) ? avatarObj.avatarUrl : '';
    const successMessage = t('Avatar_changed_successfully');
    const setAvatarFromService = (0, ui_contexts_1.useMethod)('setAvatarFromService');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const saveAvatarAction = (0, useEndpointUpload_1.useEndpointUpload)('/v1/users.setAvatar', successMessage);
    const saveAvatarUrlAction = (0, useEndpointAction_1.useEndpointAction)('POST', '/v1/users.setAvatar', { successMessage });
    const resetAvatarAction = (0, useEndpointAction_1.useEndpointAction)('POST', '/v1/users.resetAvatar', { successMessage });
    const updateAvatar = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (isAvatarReset(avatarObj)) {
            return resetAvatarAction({
                userId,
            });
        }
        if (isAvatarUrl(avatarObj)) {
            return saveAvatarUrlAction(Object.assign({ userId }, (avatarUrl && { avatarUrl })));
        }
        if (isServiceObject(avatarObj)) {
            const { blob, contentType, service } = avatarObj;
            try {
                yield setAvatarFromService(blob, contentType, service);
                dispatchToastMessage({ type: 'success', message: successMessage });
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            return;
        }
        if (avatarObj instanceof FormData) {
            avatarObj.set('userId', userId);
            return saveAvatarAction(avatarObj);
        }
    }), [
        avatarObj,
        avatarUrl,
        dispatchToastMessage,
        resetAvatarAction,
        saveAvatarAction,
        saveAvatarUrlAction,
        setAvatarFromService,
        successMessage,
        userId,
    ]);
    return updateAvatar;
};
exports.useUpdateAvatar = useUpdateAvatar;
