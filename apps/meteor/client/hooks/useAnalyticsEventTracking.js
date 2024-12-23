"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnalyticsEventTracking = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const callbacks_1 = require("../../lib/callbacks");
function trackEvent(category, action, label) {
    const { _paq, ga } = window;
    _paq === null || _paq === void 0 ? void 0 : _paq.push(['trackEvent', category, action, label]);
    ga === null || ga === void 0 ? void 0 : ga('send', 'event', category, action, label);
}
const useAnalyticsEventTracking = () => {
    const router = (0, ui_contexts_1.useRouter)();
    (0, react_1.useEffect)(() => router.subscribeToRouteChange(() => {
        const { _paq, ga } = window;
        if (_paq) {
            const http = location.protocol;
            const slashes = http.concat('//');
            const host = slashes.concat(location.hostname);
            _paq.push(['setCustomUrl', host + router.getLocationPathname()]);
            _paq.push(['trackPageView']);
        }
        ga === null || ga === void 0 ? void 0 : ga('send', 'pageview', router.getLocationPathname());
    }), [router]);
    (0, react_1.useEffect)(() => {
        callbacks_1.callbacks.add('loginPageStateChange', (state) => {
            trackEvent('Navigation', 'Login Page State Change', state);
        }, callbacks_1.callbacks.priority.MEDIUM, 'analytics-login-state-change');
        return () => {
            callbacks_1.callbacks.remove('loginPageStateChange', 'analytics-login-state-change');
        };
    }, []);
    const featuresMessages = (0, ui_contexts_1.useSetting)('Analytics_features_messages', true);
    (0, react_1.useEffect)(() => {
        if (!featuresMessages) {
            return;
        }
        callbacks_1.callbacks.add('afterSaveMessage', (_message, { room }) => {
            trackEvent('Message', 'Send', `${room.name} (${room._id})`);
        }, callbacks_1.callbacks.priority.LOW, 'trackEvents');
        return () => {
            callbacks_1.callbacks.remove('afterSaveMessage', 'trackEvents');
        };
    }, [featuresMessages]);
    const featuresRooms = (0, ui_contexts_1.useSetting)('Analytics_features_rooms', true);
    (0, react_1.useEffect)(() => {
        if (!featuresRooms) {
            return;
        }
        callbacks_1.callbacks.add('afterCreateChannel', (_owner, room) => {
            trackEvent('Room', 'Create', `${room.name} (${room._id})`);
        }, callbacks_1.callbacks.priority.MEDIUM, 'analytics-after-create-channel');
        callbacks_1.callbacks.add('roomNameChanged', (room) => {
            trackEvent('Room', 'Changed Name', `${room.name} (${room._id})`);
        }, callbacks_1.callbacks.priority.MEDIUM, 'analytics-room-name-changed');
        callbacks_1.callbacks.add('roomTopicChanged', (room) => {
            trackEvent('Room', 'Changed Topic', `${room.name} (${room._id})`);
        }, callbacks_1.callbacks.priority.MEDIUM, 'analytics-room-topic-changed');
        callbacks_1.callbacks.add('roomAnnouncementChanged', (room) => {
            trackEvent('Room', 'Changed Announcement', `${room.name} (${room._id})`);
        }, callbacks_1.callbacks.priority.MEDIUM, 'analytics-room-announcement-changed');
        callbacks_1.callbacks.add('roomTypeChanged', (room) => {
            trackEvent('Room', 'Changed Room Type', `${room.name} (${room._id})`);
        }, callbacks_1.callbacks.priority.MEDIUM, 'analytics-room-type-changed');
        callbacks_1.callbacks.add('archiveRoom', (room) => {
            trackEvent('Room', 'Archived', `${room.name} (${room._id})`);
        }, callbacks_1.callbacks.priority.MEDIUM, 'analytics-archive-room');
        callbacks_1.callbacks.add('unarchiveRoom', (room) => {
            trackEvent('Room', 'Unarchived', `${room.name} (${room._id})`);
        }, callbacks_1.callbacks.priority.MEDIUM, 'analytics-unarchive-room');
        callbacks_1.callbacks.add('roomAvatarChanged', (room) => {
            trackEvent('Room', 'Changed Avatar', `${room.name} (${room._id})`);
        }, callbacks_1.callbacks.priority.MEDIUM, 'analytics-room-avatar-changed');
        return () => {
            callbacks_1.callbacks.remove('afterCreateChannel', 'analytics-after-create-channel');
            callbacks_1.callbacks.remove('roomNameChanged', 'analytics-room-name-changed');
            callbacks_1.callbacks.remove('roomTopicChanged', 'analytics-room-topic-changed');
            callbacks_1.callbacks.remove('roomAnnouncementChanged', 'analytics-room-announcement-changed');
            callbacks_1.callbacks.remove('roomTypeChanged', 'analytics-room-type-changed');
            callbacks_1.callbacks.remove('archiveRoom', 'analytics-archive-room');
            callbacks_1.callbacks.remove('unarchiveRoom', 'analytics-unarchive-room');
            callbacks_1.callbacks.remove('roomAvatarChanged', 'analytics-room-avatar-changed');
        };
    }, [featuresRooms]);
    const featuresUsers = (0, ui_contexts_1.useSetting)('Analytics_features_users', true);
    (0, react_1.useEffect)(() => {
        if (!featuresUsers) {
            return;
        }
        callbacks_1.callbacks.add('userRegistered', () => {
            trackEvent('User', 'Registered');
        }, callbacks_1.callbacks.priority.MEDIUM, 'piwik-user-resitered');
        callbacks_1.callbacks.add('usernameSet', () => {
            trackEvent('User', 'Username Set');
        }, callbacks_1.callbacks.priority.MEDIUM, 'piweik-username-set');
        callbacks_1.callbacks.add('userPasswordReset', () => {
            trackEvent('User', 'Reset Password');
        }, callbacks_1.callbacks.priority.MEDIUM, 'piwik-user-password-reset');
        callbacks_1.callbacks.add('userConfirmationEmailRequested', () => {
            trackEvent('User', 'Confirmation Email Requested');
        }, callbacks_1.callbacks.priority.MEDIUM, 'piwik-user-confirmation-email-requested');
        callbacks_1.callbacks.add('userForgotPasswordEmailRequested', () => {
            trackEvent('User', 'Forgot Password Email Requested');
        }, callbacks_1.callbacks.priority.MEDIUM, 'piwik-user-forgot-password-email-requested');
        callbacks_1.callbacks.add('userStatusManuallySet', (status) => {
            trackEvent('User', 'Status Manually Changed', status);
        }, callbacks_1.callbacks.priority.MEDIUM, 'analytics-user-status-manually-set');
        callbacks_1.callbacks.add('userAvatarSet', (service) => {
            trackEvent('User', 'Avatar Changed', service);
        }, callbacks_1.callbacks.priority.MEDIUM, 'analytics-user-avatar-set');
        return () => {
            callbacks_1.callbacks.remove('userRegistered', 'piwik-user-resitered');
            callbacks_1.callbacks.remove('usernameSet', 'piweik-username-set');
            callbacks_1.callbacks.remove('userPasswordReset', 'piwik-user-password-reset');
            callbacks_1.callbacks.remove('userConfirmationEmailRequested', 'piwik-user-confirmation-email-requested');
            callbacks_1.callbacks.remove('userForgotPasswordEmailRequested', 'piwik-user-forgot-password-email-requested');
            callbacks_1.callbacks.remove('userStatusManuallySet', 'analytics-user-status-manually-set');
            callbacks_1.callbacks.remove('userAvatarSet', 'analytics-user-avatar-set');
        };
    }, [featuresUsers]);
    const uid = (0, ui_contexts_1.useUserId)();
    (0, react_1.useEffect)(() => {
        if (!featuresUsers) {
            return;
        }
        const { _paq } = window;
        trackEvent('User', 'Login', uid);
        _paq === null || _paq === void 0 ? void 0 : _paq.push(['setUserId', uid]);
        return () => {
            trackEvent('User', 'Logout', uid);
        };
    }, [featuresUsers, uid]);
};
exports.useAnalyticsEventTracking = useAnalyticsEventTracking;
