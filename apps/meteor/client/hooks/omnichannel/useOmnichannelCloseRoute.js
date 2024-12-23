"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOmnichannelCloseRoute = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useOmnichannelCloseRoute = () => {
    var _a;
    const hideConversationAfterClosing = (_a = (0, ui_contexts_1.useUserPreference)('omnichannelHideConversationAfterClosing')) !== null && _a !== void 0 ? _a : true;
    const router = (0, ui_contexts_1.useRouter)();
    const navigateHome = (0, react_1.useCallback)(() => {
        if (!hideConversationAfterClosing) {
            return;
        }
        const routeName = router.getRouteName();
        if (routeName === 'omnichannel-current-chats') {
            router.navigate({ name: 'omnichannel-current-chats' });
        }
        else {
            router.navigate({ name: 'home' });
        }
    }, [hideConversationAfterClosing, router]);
    return { navigateHome };
};
exports.useOmnichannelCloseRoute = useOmnichannelCloseRoute;
