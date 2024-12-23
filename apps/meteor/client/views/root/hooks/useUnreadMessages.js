"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUnreadMessages = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const useUnreadMessages = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const unreadMessages = (0, ui_contexts_1.useSession)('unread');
    return (() => {
        // TODO: remove this when we have a better way to handle this
        if (typeof unreadMessages !== 'number') {
            return undefined;
        }
        return t('unread_messages_counter', { count: unreadMessages });
    })();
};
exports.useUnreadMessages = useUnreadMessages;
