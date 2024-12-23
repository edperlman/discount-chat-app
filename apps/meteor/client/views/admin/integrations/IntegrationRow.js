"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const GenericTable_1 = require("../../../components/GenericTable");
const useFormatDateAndTime_1 = require("../../../hooks/useFormatDateAndTime");
const IntegrationRow = ({ integration, onClick, isMobile }) => {
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const { _id, name, type, username, _createdAt, _createdBy, channel } = integration;
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { onKeyDown: onClick(_id, type), onClick: onClick(_id, type), tabIndex: 0, role: 'link', action: true, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: name }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: channel.join(', ') }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: _createdBy === null || _createdBy === void 0 ? void 0 : _createdBy.username }) }), !isMobile && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: formatDateAndTime(_createdAt) }) })), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: username }) })] }, _id));
};
exports.default = IntegrationRow;
