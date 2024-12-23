"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipCallAction = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const ui_voip_1 = require("@rocket.chat/ui-voip");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useMediaPermissions_1 = require("../../../composer/messageBox/hooks/useMediaPermissions");
const UserCardContext_1 = require("../../../contexts/UserCardContext");
const useVoipCallAction = (user) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { closeUserCard } = (0, UserCardContext_1.useUserCard)();
    const ownUserId = (0, ui_contexts_1.useUserId)();
    const { isEnabled, isRegistered, isInCall } = (0, ui_voip_1.useVoipState)();
    const { makeCall } = (0, ui_voip_1.useVoipAPI)();
    const [isMicPermissionDenied] = (0, useMediaPermissions_1.useMediaPermissions)('microphone');
    const isRemoteRegistered = !!(user === null || user === void 0 ? void 0 : user.freeSwitchExtension);
    const isSameUser = ownUserId === user._id;
    const disabled = isSameUser || isMicPermissionDenied || !isRemoteRegistered || !isRegistered || isInCall;
    const voipCallOption = (0, react_1.useMemo)(() => {
        const handleClick = () => {
            makeCall(user === null || user === void 0 ? void 0 : user.freeSwitchExtension);
            closeUserCard();
        };
        return isEnabled && !isSameUser
            ? {
                type: 'communication',
                title: t('Voice_call'),
                icon: 'phone',
                disabled,
                onClick: handleClick,
            }
            : undefined;
    }, [closeUserCard, disabled, isEnabled, isSameUser, makeCall, t, user === null || user === void 0 ? void 0 : user.freeSwitchExtension]);
    return voipCallOption;
};
exports.useVoipCallAction = useVoipCallAction;
