"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const favicon_1 = require("@rocket.chat/favicon");
const meteor_1 = require("meteor/meteor");
const session_1 = require("meteor/session");
const tracker_1 = require("meteor/tracker");
const client_1 = require("../../app/models/client");
const client_2 = require("../../app/utils/client");
const fireGlobalEvent_1 = require("../lib/utils/fireGlobalEvent");
const fetchSubscriptions = () => client_1.Subscriptions.find({
    open: true,
    hideUnreadStatus: { $ne: true },
    archived: { $ne: true },
}, {
    fields: {
        unread: 1,
        alert: 1,
        rid: 1,
        t: 1,
        name: 1,
        ls: 1,
        unreadAlert: 1,
        fname: 1,
        prid: 1,
    },
}).fetch();
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        const userUnreadAlert = (0, client_2.getUserPreference)(meteor_1.Meteor.userId(), 'unreadAlert');
        let unreadAlert = false;
        const unreadCount = fetchSubscriptions().reduce((ret, subscription) => tracker_1.Tracker.nonreactive(() => {
            const room = client_1.Rooms.findOne({ _id: subscription.rid }, { fields: { usersCount: 1 } });
            (0, fireGlobalEvent_1.fireGlobalEvent)('unread-changed-by-subscription', Object.assign(Object.assign({}, subscription), { usersCount: room === null || room === void 0 ? void 0 : room.usersCount }));
            if (subscription.alert || subscription.unread > 0) {
                // Increment the total unread count.
                if (subscription.alert === true && subscription.unreadAlert !== 'nothing') {
                    if (subscription.unreadAlert === 'all' || userUnreadAlert !== false) {
                        unreadAlert = '•';
                    }
                }
                return ret + subscription.unread;
            }
            return ret;
        }), 0);
        if (unreadCount > 0) {
            if (unreadCount > 999) {
                session_1.Session.set('unread', '999+');
            }
            else {
                session_1.Session.set('unread', unreadCount);
            }
        }
        else if (unreadAlert !== false) {
            session_1.Session.set('unread', unreadAlert);
        }
        else {
            session_1.Session.set('unread', '');
        }
    });
});
meteor_1.Meteor.startup(() => {
    const updateFavicon = (0, favicon_1.manageFavicon)();
    tracker_1.Tracker.autorun(() => {
        const unread = session_1.Session.get('unread');
        (0, fireGlobalEvent_1.fireGlobalEvent)('unread-changed', unread);
        updateFavicon(unread);
    });
});
