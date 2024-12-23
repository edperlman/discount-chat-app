"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const ModerationConsoleActions_1 = __importDefault(require("./ModerationConsoleActions"));
const UserColumn_1 = __importDefault(require("./helpers/UserColumn"));
const GenericTable_1 = require("../../../components/GenericTable");
const useFormatDateAndTime_1 = require("../../../hooks/useFormatDateAndTime");
const ModerationConsoleTableRow = ({ report, onClick, isDesktopOrLarger }) => {
    const { userId: _id, rooms, name, count, username, ts } = report;
    const roomNames = rooms.map((room) => {
        if (room.t === 'd') {
            return room.name || 'Private';
        }
        return room.fname || room.name;
    });
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const concatenatedRoomNames = roomNames.join(', ');
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { onClick: () => onClick(_id), tabIndex: 0, role: 'link', action: true, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(UserColumn_1.default, { username: username, name: name, fontSize: 'micro', size: isDesktopOrLarger ? 'x20' : 'x40' }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: concatenatedRoomNames }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: formatDateAndTime(ts) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: count }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { onClick: (e) => e.stopPropagation(), children: (0, jsx_runtime_1.jsx)(ModerationConsoleActions_1.default, { report: report, onClick: onClick }) })] }, _id));
};
exports.default = ModerationConsoleTableRow;
