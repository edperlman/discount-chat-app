"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const VideoConfContext_1 = require("../../../../../contexts/VideoConfContext");
const useTimeAgo_1 = require("../../../../../hooks/useTimeAgo");
const constants_1 = require("../../../../../lib/constants");
const useGoToRoom_1 = require("../../../hooks/useGoToRoom");
const VideoConfListItem = (_a) => {
    var { videoConfData, className = [], reload } = _a, props = __rest(_a, ["videoConfData", "className", "reload"]);
    const t = (0, ui_contexts_1.useTranslation)();
    const formatDate = (0, useTimeAgo_1.useTimeAgo)();
    const joinCall = (0, VideoConfContext_1.useVideoConfJoinCall)();
    const showRealName = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name', false);
    const { _id: callId, createdBy: { name, username, _id }, users, createdAt, endedAt, discussionRid, } = videoConfData;
    const joinedUsers = users.filter((user) => user._id !== _id);
    const hovered = (0, css_in_js_1.css) `
		&:hover,
		&:focus {
			background: ${fuselage_1.Palette.surface['surface-tint']};
			.rcx-message {
				background: ${fuselage_1.Palette.surface['surface-tint']};
			}
		}
	`;
    const handleJoinConference = (0, fuselage_hooks_1.useMutableCallback)(() => {
        joinCall(callId);
        return reload();
    });
    const goToRoom = (0, useGoToRoom_1.useGoToRoom)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'default', borderBlockEndWidth: 1, borderBlockEndColor: 'stroke-extra-light', borderBlockEndStyle: 'solid', className: [...className, hovered].filter(Boolean), pb: 8, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Message, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Message.LeftContainer, { children: username && (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: username, size: 'x36' }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Message.Container, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Message.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Message.Name, { title: username, children: showRealName ? name : username }), (0, jsx_runtime_1.jsx)(fuselage_1.Message.Timestamp, { children: formatDate(createdAt) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Message.Body, { clamp: 2 }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex' }), (0, jsx_runtime_1.jsxs)(fuselage_1.Message.Block, { flexDirection: 'row', alignItems: 'center', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { disabled: Boolean(endedAt), small: true, alignItems: 'center', display: 'flex', onClick: handleJoinConference, children: endedAt ? t('Call_ended') : t('Join_call') }), discussionRid && ((0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { small: true, icon: 'discussion', "data-drid": discussionRid, title: t('Join_discussion'), onClick: () => goToRoom(discussionRid) }))] }), joinedUsers.length > 0 && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mis: 8, fontScale: 'c1', display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Avatar.Stack, { children: joinedUsers.map((user, index) => user.username &&
                                                index + 1 <= constants_1.VIDEOCONF_STACK_MAX_USERS && ((0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { "data-tooltip": user.username, username: user.username, etag: user.avatarETag, size: 'x28' }, user.username))) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mis: 4, children: joinedUsers.length > constants_1.VIDEOCONF_STACK_MAX_USERS
                                                ? t('__usersCount__member_joined', { count: joinedUsers.length - constants_1.VIDEOCONF_STACK_MAX_USERS })
                                                : t('joined') })] })), joinedUsers.length === 0 && !endedAt && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mis: 8, fontScale: 'c1', children: t('Be_the_first_to_join') }))] })] })] })) }));
};
exports.default = VideoConfListItem;
