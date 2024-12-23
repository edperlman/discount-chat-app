"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInviteTokenMutation = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const useInviteTokenMutation = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const getInviteRoom = (0, ui_contexts_1.useEndpoint)('POST', '/v1/useInviteToken');
    const { mutate } = (0, react_query_1.useMutation)({
        mutationFn: (token) => getInviteRoom({ token }),
        onSuccess: (result) => {
            if (!result.room.name) {
                dispatchToastMessage({ type: 'error', message: t('Failed_to_activate_invite_token') });
                router.navigate('/home');
                return;
            }
            if (result.room.t === 'p') {
                router.navigate(`/group/${result.room.name}`);
                return;
            }
            router.navigate(`/channel/${result.room.name}`);
        },
        onError: () => {
            dispatchToastMessage({ type: 'error', message: t('Failed_to_activate_invite_token') });
            router.navigate('/home');
        },
    });
    return mutate;
};
exports.useInviteTokenMutation = useInviteTokenMutation;
