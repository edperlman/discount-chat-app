"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoomList = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useQueryOptions_1 = require("./useQueryOptions");
const VideoConfContext_1 = require("../../contexts/VideoConfContext");
const useOmnichannelEnabled_1 = require("../../hooks/omnichannel/useOmnichannelEnabled");
const useQueuedInquiries_1 = require("../../hooks/omnichannel/useQueuedInquiries");
const query = { open: { $ne: false } };
const emptyQueue = [];
const order = [
    'Incoming_Calls',
    'Incoming_Livechats',
    'Open_Livechats',
    'On_Hold_Chats',
    'Unread',
    'Favorites',
    'Teams',
    'Discussions',
    'Channels',
    'Direct_Messages',
    'Conversations',
];
const useRoomList = () => {
    var _a;
    const [roomList, setRoomList] = (0, fuselage_hooks_1.useDebouncedState)([], 150);
    const showOmnichannel = (0, useOmnichannelEnabled_1.useOmnichannelEnabled)();
    const sidebarGroupByType = (0, ui_contexts_1.useUserPreference)('sidebarGroupByType');
    const favoritesEnabled = (0, ui_contexts_1.useUserPreference)('sidebarShowFavorites');
    const sidebarOrder = (_a = (0, ui_contexts_1.useUserPreference)('sidebarSectionsOrder')) !== null && _a !== void 0 ? _a : order;
    const isDiscussionEnabled = (0, ui_contexts_1.useSetting)('Discussion_enabled');
    const sidebarShowUnread = (0, ui_contexts_1.useUserPreference)('sidebarShowUnread');
    const options = (0, useQueryOptions_1.useQueryOptions)();
    const rooms = (0, ui_contexts_1.useUserSubscriptions)(query, options);
    const inquiries = (0, useQueuedInquiries_1.useQueuedInquiries)();
    const incomingCalls = (0, VideoConfContext_1.useVideoConfIncomingCalls)();
    let queue = emptyQueue;
    if (inquiries.enabled) {
        queue = inquiries.queue;
    }
    (0, react_1.useEffect)(() => {
        setRoomList(() => {
            const incomingCall = new Set();
            const favorite = new Set();
            const team = new Set();
            const omnichannel = new Set();
            const unread = new Set();
            const channels = new Set();
            const direct = new Set();
            const discussion = new Set();
            const conversation = new Set();
            const onHold = new Set();
            rooms.forEach((room) => {
                if (room.archived) {
                    return;
                }
                if (incomingCalls.find((call) => call.rid === room.rid)) {
                    return incomingCall.add(room);
                }
                if (sidebarShowUnread && (room.alert || room.unread) && !room.hideUnreadStatus) {
                    return unread.add(room);
                }
                if (favoritesEnabled && room.f) {
                    return favorite.add(room);
                }
                if (sidebarGroupByType && room.teamMain) {
                    return team.add(room);
                }
                if (sidebarGroupByType && isDiscussionEnabled && room.prid) {
                    return discussion.add(room);
                }
                if (room.t === 'c' || room.t === 'p') {
                    channels.add(room);
                }
                if (room.t === 'l' && room.onHold) {
                    return showOmnichannel && onHold.add(room);
                }
                if (room.t === 'l') {
                    return showOmnichannel && omnichannel.add(room);
                }
                if (room.t === 'd') {
                    direct.add(room);
                }
                conversation.add(room);
            });
            const groups = new Map();
            incomingCall.size && groups.set('Incoming_Calls', incomingCall);
            showOmnichannel && inquiries.enabled && queue.length && groups.set('Incoming_Livechats', queue);
            showOmnichannel && omnichannel.size && groups.set('Open_Livechats', omnichannel);
            showOmnichannel && onHold.size && groups.set('On_Hold_Chats', onHold);
            sidebarShowUnread && unread.size && groups.set('Unread', unread);
            favoritesEnabled && favorite.size && groups.set('Favorites', favorite);
            sidebarGroupByType && team.size && groups.set('Teams', team);
            sidebarGroupByType && isDiscussionEnabled && discussion.size && groups.set('Discussions', discussion);
            sidebarGroupByType && channels.size && groups.set('Channels', channels);
            sidebarGroupByType && direct.size && groups.set('Direct_Messages', direct);
            !sidebarGroupByType && groups.set('Conversations', conversation);
            return sidebarOrder
                .map((key) => {
                const group = groups.get(key);
                if (!group) {
                    return [];
                }
                return [key, ...group];
            })
                .flat();
        });
    }, [
        rooms,
        showOmnichannel,
        incomingCalls,
        inquiries.enabled,
        queue,
        sidebarShowUnread,
        favoritesEnabled,
        sidebarGroupByType,
        setRoomList,
        isDiscussionEnabled,
        sidebarOrder,
    ]);
    return roomList;
};
exports.useRoomList = useRoomList;
