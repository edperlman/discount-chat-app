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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericTable_1 = require("../../../components/GenericTable");
const useFormatDate_1 = require("../../../hooks/useFormatDate");
const roomCoordinator_1 = require("../../../lib/rooms/roomCoordinator");
const roomTypeI18nMap = {
    l: 'Omnichannel',
    c: 'Channel',
    d: 'Direct_Message',
    p: 'Private_Channel',
};
const getRoomDisplayName = (room) => { var _a; return room.t === 'd' ? (_a = room.usernames) === null || _a === void 0 ? void 0 : _a.join(' x ') : roomCoordinator_1.roomCoordinator.getRoomName(room.t, room); };
const RoomRow = ({ room }) => {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const mediaQuery = (0, fuselage_hooks_1.useMediaQuery)('(min-width: 1024px)');
    const router = (0, ui_contexts_1.useRouter)();
    const formatDate = (0, useFormatDate_1.useFormatDate)();
    const { _id, t: type, usersCount, msgs, default: isDefault, featured, ts } = room, args = __rest(room, ["_id", "t", "usersCount", "msgs", "default", "featured", "ts"]);
    const icon = (_b = (_a = roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t)).getIcon) === null || _b === void 0 ? void 0 : _b.call(_a, room);
    const roomName = getRoomDisplayName(room);
    const getRoomType = (room) => {
        if (room.teamMain) {
            return room.t === 'c' ? 'Teams_Public_Team' : 'Teams_Private_Team';
        }
        if ((0, core_typings_1.isDiscussion)(room)) {
            return 'Discussion';
        }
        return roomTypeI18nMap[room.t];
    };
    const onClick = (0, react_1.useCallback)((rid) => () => router.navigate({
        name: 'admin-rooms',
        params: {
            context: 'edit',
            id: rid,
        },
    }), [router]);
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { action: true, onKeyDown: onClick(_id), onClick: onClick(_id), tabIndex: 0, role: 'link', "qa-room-id": _id, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignContent: 'center', children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.RoomAvatar, { size: mediaQuery ? 'x28' : 'x40', room: Object.assign({ type, name: roomName, _id }, args) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexGrow: 1, flexShrink: 1, flexBasis: '0%', flexDirection: 'row', alignSelf: 'center', alignItems: 'center', withTruncatedText: true, children: [icon && (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { mi: 4, name: icon, fontScale: 'p2m', color: 'hint' }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2m', withTruncatedText: true, color: 'default', "qa-room-name": roomName, children: roomName })] })] }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'hint', fontScale: 'p2m', withTruncatedText: true, children: t(getRoomType(room)) }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: usersCount }), mediaQuery && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: msgs }), mediaQuery && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: isDefault ? t('True') : t('False') }), mediaQuery && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: featured ? t('True') : t('False') }), mediaQuery && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: ts ? formatDate(ts) : '' })] }, _id));
};
exports.default = RoomRow;
