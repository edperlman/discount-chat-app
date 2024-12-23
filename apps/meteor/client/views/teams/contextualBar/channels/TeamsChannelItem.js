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
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const TeamsChannelItemMenu_1 = __importDefault(require("./TeamsChannelItemMenu"));
const usePreventPropagation_1 = require("../../../../hooks/usePreventPropagation");
const roomCoordinator_1 = require("../../../../lib/rooms/roomCoordinator");
const TeamsChannelItem = ({ room, mainRoom, onClickView, reload }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const rid = room._id;
    const type = room.t;
    const [showButton, setShowButton] = (0, react_1.useState)();
    const canRemoveTeamChannel = (0, ui_contexts_1.usePermission)('remove-team-channel', mainRoom._id);
    const canEditTeamChannel = (0, ui_contexts_1.usePermission)('edit-team-channel', mainRoom._id);
    const canDeleteChannel = (0, ui_contexts_1.usePermission)(`delete-${type}`, rid);
    const canDeleteTeamChannel = (0, ui_contexts_1.usePermission)(`delete-team-${type === 'c' ? 'channel' : 'group'}`, mainRoom._id);
    const canDelete = canDeleteChannel && canDeleteTeamChannel;
    const isReduceMotionEnabled = (0, fuselage_hooks_1.usePrefersReducedMotion)();
    const handleMenuEvent = {
        [isReduceMotionEnabled ? 'onMouseEnter' : 'onTransitionEnd']: setShowButton,
    };
    const onClick = (0, usePreventPropagation_1.usePreventPropagation)();
    if (!room) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.OptionSkeleton, {});
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Option, Object.assign({ id: room._id, "data-rid": room._id }, handleMenuEvent, { onClick: () => onClickView(room), children: [(0, jsx_runtime_1.jsx)(fuselage_1.OptionAvatar, { children: (0, jsx_runtime_1.jsx)(ui_avatar_1.RoomAvatar, { room: room, size: 'x28' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.OptionColumn, { children: room.t === 'c' ? (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'hash', size: 'x15' }) : (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'hashtag-lock', size: 'x15' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.OptionContent, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'inline-flex', alignItems: 'center', children: [roomCoordinator_1.roomCoordinator.getRoomName(room.t, room), ' ', room.teamDefault ? ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 4, children: (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { children: t('Team_Auto-join') }) })) : ('')] }) }), (canRemoveTeamChannel || canEditTeamChannel || canDelete) && ((0, jsx_runtime_1.jsx)(fuselage_1.OptionMenu, { onClick: onClick, children: showButton ? (0, jsx_runtime_1.jsx)(TeamsChannelItemMenu_1.default, { room: room, mainRoom: mainRoom, reload: reload }) : (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { tiny: true, icon: 'kebab' }) }))] })));
};
exports.default = TeamsChannelItem;
