"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const ModConsoleUserActions_1 = __importDefault(require("./ModConsoleUserActions"));
const GenericTable_1 = require("../../../../components/GenericTable");
const useFormatDateAndTime_1 = require("../../../../hooks/useFormatDateAndTime");
const UserColumn_1 = __importDefault(require("../helpers/UserColumn"));
const ModConsoleUserTableRow = ({ report, onClick, isDesktopOrLarger }) => {
    const { reportedUser, count, ts } = report;
    const { _id, username, name, createdAt, emails } = reportedUser;
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { onClick: () => onClick(_id), tabIndex: 0, role: 'link', action: true, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(UserColumn_1.default, { name: name, username: username, fontSize: 'micro', size: isDesktopOrLarger ? 'x20' : 'x40' }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: formatDateAndTime(createdAt) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: emails === null || emails === void 0 ? void 0 : emails[0].address }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: formatDateAndTime(ts) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: count }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { onClick: (e) => e.stopPropagation(), children: (0, jsx_runtime_1.jsx)(ModConsoleUserActions_1.default, { report: report, onClick: onClick }) })] }, _id));
};
exports.default = ModConsoleUserTableRow;
