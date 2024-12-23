"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const GenericTable_1 = require("../../../../../../components/GenericTable");
const RoomIcon_1 = require("../../../../../../components/RoomIcon");
const ChannelDeletionTableRow = ({ room, onChange, selected }) => {
    const { name, fname, usersCount } = room;
    const handleChange = (0, fuselage_hooks_1.useMutableCallback)(() => onChange(room));
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { action: true, children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableCell, { maxWidth: 'x300', withTruncatedText: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: selected, onChange: handleChange }), (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inline: 'x8', children: [(0, jsx_runtime_1.jsx)(RoomIcon_1.RoomIcon, { room: room }), fname !== null && fname !== void 0 ? fname : name] })] }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { align: 'end', withTruncatedText: true, children: usersCount })] }));
};
exports.default = ChannelDeletionTableRow;
