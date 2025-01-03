"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const normalizeSidebarMessage_1 = require("./normalizeSidebarMessage");
const RoomIcon_1 = require("../../components/RoomIcon");
const roomCoordinator_1 = require("../../lib/rooms/roomCoordinator");
const isIOsDevice_1 = require("../../lib/utils/isIOsDevice");
const useOmnichannelPriorities_1 = require("../../omnichannel/hooks/useOmnichannelPriorities");
const RoomMenu_1 = __importDefault(require("../RoomMenu"));
const OmnichannelBadges_1 = require("../badges/OmnichannelBadges");
const getMessage = (room, lastMessage, t) => {
    var _a, _b;
    if (!lastMessage) {
        return t('No_messages_yet');
    }
    if ((0, core_typings_1.isVideoConfMessage)(lastMessage)) {
        return t('Call_started');
    }
    if (!lastMessage.u) {
        return (0, normalizeSidebarMessage_1.normalizeSidebarMessage)(lastMessage, t);
    }
    if (((_a = lastMessage.u) === null || _a === void 0 ? void 0 : _a.username) === ((_b = room.u) === null || _b === void 0 ? void 0 : _b.username)) {
        return `${t('You')}: ${(0, normalizeSidebarMessage_1.normalizeSidebarMessage)(lastMessage, t)}`;
    }
    if ((0, core_typings_1.isDirectMessageRoom)(room) && !(0, core_typings_1.isMultipleDirectMessageRoom)(room)) {
        return (0, normalizeSidebarMessage_1.normalizeSidebarMessage)(lastMessage, t);
    }
    return `${lastMessage.u.name || lastMessage.u.username}: ${(0, normalizeSidebarMessage_1.normalizeSidebarMessage)(lastMessage, t)}`;
};
const getBadgeTitle = (userMentions, threadUnread, groupMentions, unread, t) => {
    const title = [];
    if (userMentions) {
        title.push(t('mentions_counter', { count: userMentions }));
    }
    if (threadUnread) {
        title.push(t('threads_counter', { count: threadUnread }));
    }
    if (groupMentions) {
        title.push(t('group_mentions_counter', { count: groupMentions }));
    }
    const count = unread - userMentions - groupMentions;
    if (count > 0) {
        title.push(t('unread_messages_counter', { count }));
    }
    return title.join(', ');
};
function SideBarItemTemplateWithData({ room, id, selected, style, extended, SideBarItemTemplate, AvatarTemplate, t, isAnonymous, videoConfActions, }) {
    const { sidebar } = (0, ui_contexts_1.useLayout)();
    const href = roomCoordinator_1.roomCoordinator.getRouteLink(room.t, room) || '';
    const title = roomCoordinator_1.roomCoordinator.getRoomName(room.t, room) || '';
    const { lastMessage, hideUnreadStatus, hideMentionStatus, unread = 0, alert, userMentions, groupMentions, tunread = [], tunreadUser = [], rid, t: type, cl, } = room;
    const highlighted = Boolean(!hideUnreadStatus && (alert || unread));
    const icon = (
    // TODO: Remove icon='at'
    (0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.Item.Icon, { highlighted: highlighted, icon: 'at', children: (0, jsx_runtime_1.jsx)(RoomIcon_1.RoomIcon, { room: room, placement: 'sidebar', isIncomingCall: Boolean(videoConfActions) }) }));
    const actions = (0, react_1.useMemo)(() => videoConfActions && ((0, jsx_runtime_1.jsxs)(fuselage_1.SidebarItemActions, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.SidebarItemAction, { onClick: videoConfActions.acceptCall, secondary: true, success: true, icon: 'phone' }), (0, jsx_runtime_1.jsx)(fuselage_1.SidebarItemAction, { onClick: videoConfActions.rejectCall, secondary: true, danger: true, icon: 'phone-off' })] })), [videoConfActions]);
    const isQueued = (0, core_typings_1.isOmnichannelRoom)(room) && room.status === 'queued';
    const { enabled: isPriorityEnabled } = (0, useOmnichannelPriorities_1.useOmnichannelPriorities)();
    const message = extended && getMessage(room, lastMessage, t);
    const subtitle = message ? (0, jsx_runtime_1.jsx)("span", { className: 'message-body--unstyled', dangerouslySetInnerHTML: { __html: message } }) : null;
    const threadUnread = tunread.length > 0;
    const variant = ((userMentions || tunreadUser.length) && 'danger') || (threadUnread && 'primary') || (groupMentions && 'warning') || 'secondary';
    const isUnread = unread > 0 || threadUnread;
    const showBadge = !hideUnreadStatus || (!hideMentionStatus && (Boolean(userMentions) || tunreadUser.length > 0));
    const badgeTitle = getBadgeTitle(userMentions, tunread.length, groupMentions, unread, t);
    const badges = ((0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inlineStart: 8, children: [showBadge && isUnread && ((0, jsx_runtime_1.jsx)(fuselage_1.Badge, Object.assign({ role: 'status' }, { style: { display: 'inline-flex', flexShrink: 0 } }, { variant: variant, title: badgeTitle, children: unread + (tunread === null || tunread === void 0 ? void 0 : tunread.length) }))), (0, core_typings_1.isOmnichannelRoom)(room) && (0, jsx_runtime_1.jsx)(OmnichannelBadges_1.OmnichannelBadges, { room: room })] }));
    return ((0, jsx_runtime_1.jsx)(SideBarItemTemplate, { is: 'a', id: id, "data-qa": 'sidebar-item', "data-unread": highlighted, unread: highlighted, selected: selected, href: href, onClick: () => {
            !selected && sidebar.toggle();
        }, "aria-label": title, title: title, time: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.ts, subtitle: subtitle, icon: icon, style: style, badges: badges, avatar: AvatarTemplate && (0, jsx_runtime_1.jsx)(AvatarTemplate, Object.assign({}, room)), actions: actions, menu: !isIOsDevice_1.isIOsDevice &&
            !isAnonymous &&
            (!isQueued || (isQueued && isPriorityEnabled)) &&
            (() => ((0, jsx_runtime_1.jsx)(RoomMenu_1.default, { alert: alert, threadUnread: threadUnread, rid: rid, unread: !!unread, roomOpen: selected, type: type, cl: cl, name: title, hideDefaultOptions: isQueued }))) }));
}
function safeDateNotEqualCheck(a, b) {
    if (!a || !b) {
        return a !== b;
    }
    return new Date(a).toISOString() !== new Date(b).toISOString();
}
const keys = [
    'id',
    'style',
    'extended',
    'selected',
    'SideBarItemTemplate',
    'AvatarTemplate',
    't',
    'sidebarViewMode',
    'videoConfActions',
];
// eslint-disable-next-line react/no-multi-comp
exports.default = (0, react_1.memo)(SideBarItemTemplateWithData, (prevProps, nextProps) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (keys.some((key) => prevProps[key] !== nextProps[key])) {
        return false;
    }
    if (prevProps.room === nextProps.room) {
        return true;
    }
    if (prevProps.room._id !== nextProps.room._id) {
        return false;
    }
    if (((_a = prevProps.room._updatedAt) === null || _a === void 0 ? void 0 : _a.toISOString()) !== ((_b = nextProps.room._updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString())) {
        return false;
    }
    if (safeDateNotEqualCheck((_c = prevProps.room.lastMessage) === null || _c === void 0 ? void 0 : _c._updatedAt, (_d = nextProps.room.lastMessage) === null || _d === void 0 ? void 0 : _d._updatedAt)) {
        return false;
    }
    if (prevProps.room.alert !== nextProps.room.alert) {
        return false;
    }
    if ((0, core_typings_1.isOmnichannelRoom)(prevProps.room) && (0, core_typings_1.isOmnichannelRoom)(nextProps.room) && ((_f = (_e = prevProps.room) === null || _e === void 0 ? void 0 : _e.v) === null || _f === void 0 ? void 0 : _f.status) !== ((_h = (_g = nextProps.room) === null || _g === void 0 ? void 0 : _g.v) === null || _h === void 0 ? void 0 : _h.status)) {
        return false;
    }
    if (prevProps.room.teamMain !== nextProps.room.teamMain) {
        return false;
    }
    if ((0, core_typings_1.isOmnichannelRoom)(prevProps.room) &&
        (0, core_typings_1.isOmnichannelRoom)(nextProps.room) &&
        prevProps.room.priorityWeight !== nextProps.room.priorityWeight) {
        return false;
    }
    return true;
});