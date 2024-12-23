"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const RoomForewordUsernameListItem_1 = __importDefault(require("./RoomForewordUsernameListItem"));
const roomCoordinator_1 = require("../../../../lib/rooms/roomCoordinator");
const RoomForewordUsernameList = ({ usernames }) => {
    const useRealName = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name', false);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inline: 4, children: usernames.map((username) => ((0, jsx_runtime_1.jsx)(RoomForewordUsernameListItem_1.default, { username: username, href: roomCoordinator_1.roomCoordinator.getRouteLink('d', { name: username }) || undefined, useRealName: useRealName }, username))) }));
};
exports.default = RoomForewordUsernameList;
