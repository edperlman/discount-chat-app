"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const GenericTable_1 = require("../../../../../components/GenericTable");
const MarkdownText_1 = __importDefault(require("../../../../../components/MarkdownText"));
const RoomIcon_1 = require("../../../../../components/RoomIcon");
const useFormatDate_1 = require("../../../../../hooks/useFormatDate");
const roomCoordinator_1 = require("../../../../../lib/rooms/roomCoordinator");
const RoomTags_1 = __importDefault(require("../../../RoomTags"));
const TeamsTableRow = ({ onClick, team, mediaQuery }) => {
    const formatDate = (0, useFormatDate_1.useFormatDate)();
    const { _id, ts, t, name, fname, topic, roomsCount } = team;
    const avatarUrl = roomCoordinator_1.roomCoordinator.getRoomDirectives(t).getAvatarPath(team);
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { onKeyDown: onClick(name, t), onClick: onClick(name, t), tabIndex: 0, role: 'link', action: true, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 0, children: avatarUrl && (0, jsx_runtime_1.jsx)(fuselage_1.Avatar, { size: 'x40', title: fname || name, url: avatarUrl }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { flexGrow: 1, mi: 8, withTruncatedText: true, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(RoomIcon_1.RoomIcon, { room: team }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2m', mi: 4, children: fname || name }), (0, jsx_runtime_1.jsx)(RoomTags_1.default, { room: team })] }), topic && (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inlineWithoutBreaks', fontScale: 'p2', color: 'hint', withTruncatedText: true, content: topic })] })] }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'hint', withTruncatedText: true, children: roomsCount }), mediaQuery && ts && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'hint', withTruncatedText: true, children: formatDate(ts) }))] }, _id));
};
exports.default = TeamsTableRow;
