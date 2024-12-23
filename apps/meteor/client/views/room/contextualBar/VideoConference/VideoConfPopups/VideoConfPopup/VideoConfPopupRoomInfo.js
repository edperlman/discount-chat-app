"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const ui_video_conf_1 = require("@rocket.chat/ui-video-conf");
const react_1 = __importDefault(require("react"));
const RoomIcon_1 = require("../../../../../../components/RoomIcon");
const ReactiveUserStatus_1 = __importDefault(require("../../../../../../components/UserStatus/ReactiveUserStatus"));
const useVideoConfRoomName_1 = require("../../hooks/useVideoConfRoomName");
const VideoConfPopupRoomInfo = ({ room }) => {
    var _a;
    const ownUser = (0, ui_contexts_1.useUser)();
    const [userId] = ((_a = room === null || room === void 0 ? void 0 : room.uids) === null || _a === void 0 ? void 0 : _a.filter((uid) => uid !== (ownUser === null || ownUser === void 0 ? void 0 : ownUser._id))) || [];
    const roomName = (0, useVideoConfRoomName_1.useVideoConfRoomName)(room);
    const avatar = (0, jsx_runtime_1.jsx)(ui_avatar_1.RoomAvatar, { room: room, size: 'x40' });
    if ((0, core_typings_1.isDirectMessageRoom)(room)) {
        return ((0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfPopupInfo, Object.assign({ avatar: avatar }, (userId && {
            icon: (0, core_typings_1.isMultipleDirectMessageRoom)(room) ? (0, jsx_runtime_1.jsx)(RoomIcon_1.RoomIcon, { placement: 'default', room: room }) : (0, jsx_runtime_1.jsx)(ReactiveUserStatus_1.default, { uid: userId }),
        }), { children: roomName })));
    }
    return ((0, jsx_runtime_1.jsx)(ui_video_conf_1.VideoConfPopupInfo, { avatar: avatar, icon: (0, jsx_runtime_1.jsx)(RoomIcon_1.RoomIcon, { placement: 'default', room: room }), children: roomName }));
};
exports.default = VideoConfPopupRoomInfo;
