"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const RoomForewordUsernameList_1 = __importDefault(require("./RoomForewordUsernameList"));
const VoipRoomForeword_1 = require("../../../../components/voip/room/VoipRoomForeword");
const RoomForeword = ({ user, room }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    if ((0, core_typings_1.isVoipRoom)(room)) {
        return (0, jsx_runtime_1.jsx)(VoipRoomForeword_1.VoipRoomForeword, { room: room });
    }
    if (!(0, core_typings_1.isDirectMessageRoom)(room)) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'c1', color: 'default', display: 'flex', justifyContent: 'center', mb: 8, children: t('Start_of_conversation') }));
    }
    const usernames = (_a = room.usernames) === null || _a === void 0 ? void 0 : _a.filter((username) => username !== (user === null || user === void 0 ? void 0 : user.username));
    if (!usernames || usernames.length < 1) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'div', flexGrow: 1, display: 'flex', justifyContent: 'center', flexDirection: 'column', mb: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Flex.Item, { grow: 1, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', alignItems: 'center', justifyContent: 'center', children: usernames.map((username, index) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', mi: 4, children: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x48', username: username }) }, index))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', color: 'default', fontScale: 'h4', flexGrow: 1, justifyContent: 'center', mb: 16, children: t('Direct_message_you_have_joined') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'div', flexGrow: 1, display: 'flex', justifyContent: 'center', children: (0, jsx_runtime_1.jsx)(RoomForewordUsernameList_1.default, { usernames: usernames }) })] }));
};
exports.default = RoomForeword;
