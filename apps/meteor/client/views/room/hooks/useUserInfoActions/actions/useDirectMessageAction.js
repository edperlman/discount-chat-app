"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDirectMessageAction = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const getShouldOpenDirectMessage = (currentSubscription, usernameSubscription, canOpenDirectMessage, username) => {
    var _a;
    const canOpenDm = canOpenDirectMessage || usernameSubscription;
    const directMessageIsNotAlreadyOpen = currentSubscription && currentSubscription.name !== username;
    return (_a = (canOpenDm && directMessageIsNotAlreadyOpen)) !== null && _a !== void 0 ? _a : false;
};
const useDirectMessageAction = (user, rid) => {
    var _a;
    const t = (0, ui_contexts_1.useTranslation)();
    const usernameSubscription = (0, ui_contexts_1.useUserSubscriptionByName)((_a = user.username) !== null && _a !== void 0 ? _a : '');
    const currentSubscription = (0, ui_contexts_1.useUserSubscription)(rid);
    const canOpenDirectMessage = (0, ui_contexts_1.usePermission)('create-d');
    const directRoute = (0, ui_contexts_1.useRoute)('direct');
    const shouldOpenDirectMessage = getShouldOpenDirectMessage(currentSubscription, usernameSubscription, canOpenDirectMessage, user.username);
    const openDirectMessage = (0, fuselage_hooks_1.useMutableCallback)(() => user.username &&
        directRoute.push({
            rid: user.username,
        }));
    const openDirectMessageOption = (0, react_1.useMemo)(() => shouldOpenDirectMessage
        ? {
            content: t('Direct_Message'),
            icon: 'balloon',
            onClick: openDirectMessage,
            type: 'communication',
        }
        : undefined, [openDirectMessage, shouldOpenDirectMessage, t]);
    return openDirectMessageOption;
};
exports.useDirectMessageAction = useDirectMessageAction;
