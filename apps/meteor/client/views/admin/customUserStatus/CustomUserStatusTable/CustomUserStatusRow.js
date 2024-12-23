"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const GenericTable_1 = require("../../../../components/GenericTable");
const MarkdownText_1 = __importDefault(require("../../../../components/MarkdownText"));
const style = { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' };
const CustomUserStatusRow = ({ status, onClick }) => {
    const { _id, name, statusType } = status;
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { onKeyDown: () => onClick(_id), onClick: () => onClick(_id), tabIndex: 0, role: 'link', action: true, "qa-user-id": _id, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'default', style: style, children: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { content: name, parseEmoji: true, variant: 'inline' }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'default', style: style, children: statusType })] }, _id));
};
exports.default = CustomUserStatusRow;
