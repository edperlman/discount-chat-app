"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGoToHomeOnRemoved = useGoToHomeOnRemoved;
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useOmnichannelCloseRoute_1 = require("../../../../hooks/omnichannel/useOmnichannelCloseRoute");
function useGoToHomeOnRemoved(room, userId) {
    const router = (0, ui_contexts_1.useRouter)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const subscribeToNotifyUser = (0, ui_contexts_1.useStream)('notify-user');
    const { t } = (0, react_i18next_1.useTranslation)();
    const { navigateHome } = (0, useOmnichannelCloseRoute_1.useOmnichannelCloseRoute)();
    (0, react_1.useEffect)(() => {
        if (!userId) {
            return;
        }
        return subscribeToNotifyUser(`${userId}/subscriptions-changed`, (event, subscription) => {
            if (event === 'removed' && subscription.rid === room._id) {
                queryClient.invalidateQueries(['rooms', room._id]);
                if ((0, core_typings_1.isOmnichannelRoom)({ t: room.t })) {
                    navigateHome();
                    return;
                }
                dispatchToastMessage({
                    type: 'info',
                    message: t('You_have_been_removed_from__roomName_', {
                        roomName: (room === null || room === void 0 ? void 0 : room.fname) || (room === null || room === void 0 ? void 0 : room.name) || '',
                    }),
                });
                router.navigate('/home');
            }
        });
    }, [
        userId,
        router,
        subscribeToNotifyUser,
        room._id,
        room.t,
        room === null || room === void 0 ? void 0 : room.fname,
        room === null || room === void 0 ? void 0 : room.name,
        t,
        dispatchToastMessage,
        queryClient,
        navigateHome,
    ]);
}
