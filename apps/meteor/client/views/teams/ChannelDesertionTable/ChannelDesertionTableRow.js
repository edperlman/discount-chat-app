"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const GenericTable_1 = require("../../../components/GenericTable");
const useFormatDateAndTime_1 = require("../../../hooks/useFormatDateAndTime");
const ChannelDesertionTableRow = ({ room, onChange, selected, lastOwnerWarning }) => {
    const { name, fname, ts, isLastOwner } = room;
    const formatDate = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const handleChange = (0, fuselage_hooks_1.useMutableCallback)(() => onChange(room));
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { action: true, children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableCell, { maxWidth: 'x300', withTruncatedText: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: selected, onChange: handleChange, disabled: room.isLastOwner }), (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inline: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: room.t === 'p' ? 'hashtag-lock' : 'hashtag' }), fname !== null && fname !== void 0 ? fname : name, isLastOwner && (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { size: 'x16', name: 'info-circled', color: 'status-font-on-danger', title: lastOwnerWarning })] })] }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { align: 'end', withTruncatedText: true, children: formatDate(ts) })] }));
};
exports.default = ChannelDesertionTableRow;
