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
const GenericTable_1 = require("../../../../components/GenericTable");
const OmnichannelRoomIcon_1 = require("../../../../components/RoomIcon/OmnichannelRoomIcon");
const CallContext_1 = require("../../../../contexts/CallContext");
const useTimeFromNow_1 = require("../../../../hooks/useTimeFromNow");
const useOmnichannelSource_1 = require("../../hooks/useOmnichannelSource");
const CallDialpadButton_1 = require("../components/CallDialpadButton");
const ContactTableRow = ({ _id, name, phones, contactManager, lastChat, channels }) => {
    const { getSourceLabel } = (0, useOmnichannelSource_1.useOmnichannelSource)();
    const getTimeFromNow = (0, useTimeFromNow_1.useTimeFromNow)(true);
    const directoryRoute = (0, ui_contexts_1.useRoute)('omnichannel-directory');
    const isCallReady = (0, CallContext_1.useIsCallReady)();
    const phoneNumber = (phones === null || phones === void 0 ? void 0 : phones.length) ? phones[0].phoneNumber : undefined;
    const latestChannel = channels === null || channels === void 0 ? void 0 : channels.sort((a, b) => {
        if (a.lastChat && b.lastChat) {
            return a.lastChat.ts > b.lastChat.ts ? -1 : 1;
        }
        return 0;
    })[0];
    const onRowClick = (0, fuselage_hooks_1.useEffectEvent)((id) => () => directoryRoute.push({
        id,
        tab: 'contacts',
        context: 'details',
    }));
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { action: true, tabIndex: 0, role: 'link', height: '40px', "qa-user-id": _id, "rcx-show-call-button-on-hover": true, onClick: onRowClick(_id), children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: name }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (latestChannel === null || latestChannel === void 0 ? void 0 : latestChannel.details) && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { withTruncatedText: true, display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(OmnichannelRoomIcon_1.OmnichannelRoomIcon, { size: 'x20', source: latestChannel === null || latestChannel === void 0 ? void 0 : latestChannel.details }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, mis: 8, children: getSourceLabel(latestChannel === null || latestChannel === void 0 ? void 0 : latestChannel.details) })] })) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: contactManager === null || contactManager === void 0 ? void 0 : contactManager.username }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: lastChat && getTimeFromNow(lastChat.ts) }), isCallReady && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsx)(CallDialpadButton_1.CallDialpadButton, { phoneNumber: phoneNumber }) }))] }, _id));
};
exports.default = ContactTableRow;
