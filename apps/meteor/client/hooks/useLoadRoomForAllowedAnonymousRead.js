"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLoadRoomForAllowedAnonymousRead = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const client_1 = require("../../app/models/client");
const useLoadRoomForAllowedAnonymousRead = () => {
    const userId = (0, ui_contexts_1.useUserId)();
    const accountsAllowAnonymousRead = (0, ui_contexts_1.useSetting)('Accounts_AllowAnonymousRead');
    (0, react_1.useEffect)(() => {
        if (!userId && accountsAllowAnonymousRead === true) {
            client_1.CachedChatRoom.init();
            client_1.CachedChatSubscription.ready.set(true);
        }
    }, [accountsAllowAnonymousRead, userId]);
};
exports.useLoadRoomForAllowedAnonymousRead = useLoadRoomForAllowedAnonymousRead;
