"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericTable_1 = require("../../../../../components/GenericTable");
const OmnichannelRoomIcon_1 = require("../../../../../components/RoomIcon/OmnichannelRoomIcon");
const useTimeFromNow_1 = require("../../../../../hooks/useTimeFromNow");
const RoomActivityIcon_1 = require("../../../../../omnichannel/components/RoomActivityIcon");
const useOmnichannelPriorities_1 = require("../../../../../omnichannel/hooks/useOmnichannelPriorities");
const PriorityIcon_1 = require("../../../../../omnichannel/priorities/PriorityIcon");
const OmnichannelVerificationTag_1 = __importDefault(require("../../../components/OmnichannelVerificationTag"));
const RemoveChatButton_1 = __importDefault(require("../../../currentChats/RemoveChatButton"));
const useOmnichannelSource_1 = require("../../../hooks/useOmnichannelSource");
const ChatsTableRow = (room) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { _id, fname, tags, servedBy, ts, department, open, priorityWeight, lm, onHold, source, verified } = room;
    const { enabled: isPriorityEnabled } = (0, useOmnichannelPriorities_1.useOmnichannelPriorities)();
    const getTimeFromNow = (0, useTimeFromNow_1.useTimeFromNow)(true);
    const { getSourceLabel } = (0, useOmnichannelSource_1.useOmnichannelSource)();
    const canRemoveClosedChats = (0, ui_contexts_1.usePermission)('remove-closed-livechat-room');
    const directoryRoute = (0, ui_contexts_1.useRoute)('omnichannel-directory');
    const getStatusText = (open = false, onHold = false) => {
        if (!open) {
            return t('Closed');
        }
        if (open && !servedBy) {
            return t('Queued');
        }
        return onHold ? t('On_Hold_Chats') : t('Room_Status_Open');
    };
    const onRowClick = (0, fuselage_hooks_1.useEffectEvent)((id) => directoryRoute.push({
        tab: 'chats',
        context: 'info',
        id,
    }));
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { tabIndex: 0, role: 'link', onClick: () => onRowClick(_id), action: true, "qa-user-id": _id, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: fname }), tags && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'hint', display: 'flex', "flex-direction": 'row', children: tags.map((tag) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 4, mie: 4, withTruncatedText: true, overflow: tag.length > 10 ? 'hidden' : 'visible', children: (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { style: { display: 'inline' }, disabled: true, children: tag }) }, tag))) }))] }) }), isPriorityEnabled && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsx)(PriorityIcon_1.PriorityIcon, { level: priorityWeight }) })), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(OmnichannelRoomIcon_1.OmnichannelRoomIcon, { size: 'x20', source: source }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mis: 8, children: getSourceLabel(source) })] }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: servedBy === null || servedBy === void 0 ? void 0 : servedBy.username }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', children: (0, jsx_runtime_1.jsx)(OmnichannelVerificationTag_1.default, { verified: verified }) }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: department === null || department === void 0 ? void 0 : department.name }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: getTimeFromNow(ts) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: getTimeFromNow(lm) }), (0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: [(0, jsx_runtime_1.jsx)(RoomActivityIcon_1.RoomActivityIcon, { room: room }), getStatusText(open, onHold)] }), canRemoveClosedChats && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: !open && (0, jsx_runtime_1.jsx)(RemoveChatButton_1.default, { _id: _id }) })] }, _id));
};
exports.default = ChatsTableRow;
