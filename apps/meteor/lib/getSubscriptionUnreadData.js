"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionUnreadData = void 0;
const getUnreadTitle = ({ mentions, threads, groupMentions, total, }, t) => {
    const title = [];
    if (mentions) {
        title.push(t('mentions_counter', { count: mentions }));
    }
    if (threads) {
        title.push(t('threads_counter', { count: threads }));
    }
    if (groupMentions) {
        title.push(t('group_mentions_counter', { count: groupMentions }));
    }
    const count = total - mentions - groupMentions - threads;
    if (count > 0) {
        title.push(t('unread_messages_counter', { count }));
    }
    return title.join(', ');
};
const getSubscriptionUnreadData = ({ userMentions, tunreadUser, tunread, unread, groupMentions, hideMentionStatus, hideUnreadStatus, alert }, t) => {
    const unreadCount = {
        mentions: userMentions + ((tunreadUser === null || tunreadUser === void 0 ? void 0 : tunreadUser.length) || 0),
        threads: (tunread === null || tunread === void 0 ? void 0 : tunread.length) || 0,
        groupMentions,
        total: unread + ((tunread === null || tunread === void 0 ? void 0 : tunread.length) || 0),
    };
    const unreadTitle = getUnreadTitle(unreadCount, t);
    const unreadVariant = (unreadCount.mentions && 'danger') || (unreadCount.threads && 'primary') || (unreadCount.groupMentions && 'warning') || 'secondary';
    const showUnread = (!hideUnreadStatus || (!hideMentionStatus && (Boolean(unreadCount.mentions) || Boolean(unreadCount.groupMentions)))) &&
        Boolean(unreadCount.total);
    const highlightUnread = Boolean(!hideUnreadStatus && (alert || unread));
    return { unreadTitle, unreadVariant, showUnread, unreadCount, highlightUnread };
};
exports.getSubscriptionUnreadData = getSubscriptionUnreadData;
