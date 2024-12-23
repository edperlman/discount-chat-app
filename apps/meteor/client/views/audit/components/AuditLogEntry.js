"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AuditFiltersDisplay_1 = __importDefault(require("./AuditFiltersDisplay"));
const GenericTable_1 = require("../../../components/GenericTable");
const useFormatDateAndTime_1 = require("../../../hooks/useFormatDateAndTime");
const AuditLogEntry = ({ value: { u, results, ts, _id, fields } }) => {
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const { username, name, avatarETag } = u;
    const { msg, users, room, startDate, endDate, type, filters } = fields;
    const when = (0, react_1.useMemo)(() => formatDateAndTime(ts), [formatDateAndTime, ts]);
    const mediaQuery = (0, fuselage_hooks_1.useMediaQuery)('(min-width: 1024px)');
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { tabIndex: 0, role: 'link', children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [username && (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: mediaQuery ? 'x28' : 'x40', title: username, username: username, etag: avatarETag }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', withTruncatedText: true, marginInline: 8, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', alignSelf: 'center', withTruncatedText: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2m', withTruncatedText: true, color: 'default', children: name || username }), name && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2', color: 'hint', withTruncatedText: true, children: [' ', `@${username}`, ' '] }))] }) })] }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2m', color: 'hint', withTruncatedText: true, children: type === 'room_member_list' ? t('Room_members_list') : msg }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: when }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: results }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'hint', withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(AuditFiltersDisplay_1.default, { users: users, room: room, startDate: startDate, endDate: endDate, filters: filters }) })] }, _id));
};
exports.default = (0, react_1.memo)(AuditLogEntry);
