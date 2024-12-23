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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useItemData = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const RoomIcon_1 = require("../../../../components/RoomIcon");
const roomCoordinator_1 = require("../../../../lib/rooms/roomCoordinator");
const SidebarItemTemplateWithData_1 = require("../../../../sidebarv2/RoomList/SidebarItemTemplateWithData");
const useAvatarTemplate_1 = require("../../../../sidebarv2/hooks/useAvatarTemplate");
const useUnreadDisplay_1 = require("../../../../sidebarv2/hooks/useUnreadDisplay");
const useItemData = (room, { openedRoom, viewMode }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const AvatarTemplate = (0, useAvatarTemplate_1.useAvatarTemplate)();
    const { unreadTitle, unreadVariant, showUnread, highlightUnread: highlighted, unreadCount } = (0, useUnreadDisplay_1.useUnreadDisplay)(room);
    const icon = (0, react_1.useMemo)(() => (0, jsx_runtime_1.jsx)(fuselage_1.SidebarV2ItemIcon, { highlighted: highlighted, icon: (0, jsx_runtime_1.jsx)(RoomIcon_1.RoomIcon, { room: room, placement: 'sidebar', size: 'x20' }) }), [highlighted, room]);
    const time = 'lastMessage' in room ? (_a = room.lastMessage) === null || _a === void 0 ? void 0 : _a.ts : undefined;
    const message = viewMode === 'extended' ? (0, SidebarItemTemplateWithData_1.getMessage)(room, room.lastMessage, t) : undefined;
    const badges = (0, react_1.useMemo)(() => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: showUnread && ((0, jsx_runtime_1.jsx)(fuselage_1.SidebarV2ItemBadge, { variant: unreadVariant, title: unreadTitle, role: 'status', children: unreadCount.total })) })), [showUnread, unreadCount.total, unreadTitle, unreadVariant]);
    const itemData = (0, react_1.useMemo)(() => ({
        unread: highlighted,
        selected: room.rid === openedRoom,
        href: roomCoordinator_1.roomCoordinator.getRouteLink(room.t, room) || '',
        title: roomCoordinator_1.roomCoordinator.getRoomName(room.t, room) || '',
        icon,
        time,
        badges,
        avatar: AvatarTemplate && (0, jsx_runtime_1.jsx)(AvatarTemplate, Object.assign({}, room)),
        subtitle: message ? (0, jsx_runtime_1.jsx)("span", { className: 'message-body--unstyled', dangerouslySetInnerHTML: { __html: message } }) : null,
    }), [AvatarTemplate, badges, highlighted, icon, message, openedRoom, room, time]);
    return itemData;
};
exports.useItemData = useItemData;
