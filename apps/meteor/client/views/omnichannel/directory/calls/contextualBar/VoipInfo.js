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
exports.VoipInfo = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const InfoField_1 = require("./InfoField");
const VoipInfoCallButton_1 = require("./VoipInfoCallButton");
const Contextualbar_1 = require("../../../../../components/Contextualbar");
const InfoPanel_1 = require("../../../../../components/InfoPanel");
const UserStatus_1 = require("../../../../../components/UserStatus");
const CallContext_1 = require("../../../../../contexts/CallContext");
const parseOutboundPhoneNumber_1 = require("../../../../../lib/voip/parseOutboundPhoneNumber");
const AgentInfoDetails_1 = __importDefault(require("../../../components/AgentInfoDetails"));
const AgentField_1 = __importDefault(require("../../components/AgentField"));
const VoipInfo = ({ room, onClickClose /* , onClickReport  */ }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const isCallReady = (0, CallContext_1.useIsCallReady)();
    const { servedBy, queue, v, fname, name, callDuration, callTotalHoldTime, closedAt, callWaitingTime, tags, lastMessage } = room;
    const duration = callDuration && moment_1.default.utc(callDuration).format('HH:mm:ss');
    const waiting = callWaitingTime && moment_1.default.utc(callWaitingTime).format('HH:mm:ss');
    const hold = callTotalHoldTime && moment_1.default.utc(callTotalHoldTime).format('HH:mm:ss');
    const endedAt = closedAt && (0, moment_1.default)(closedAt).format('LLL');
    const phoneNumber = Array.isArray(v === null || v === void 0 ? void 0 : v.phone) ? (_a = v === null || v === void 0 ? void 0 : v.phone[0]) === null || _a === void 0 ? void 0 : _a.phoneNumber : v === null || v === void 0 ? void 0 : v.phone;
    const shouldShowWrapup = (0, react_1.useMemo)(() => (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.t) === 'voip-call-wrapup' && (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.msg), [lastMessage]);
    const shouldShowTags = (0, react_1.useMemo)(() => tags && tags.length > 0, [tags]);
    const _name = fname || name;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { expanded: true, children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'phone' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Call_Information') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClickClose })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanel, { children: [(0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Channel') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'default', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { size: 'x24', name: 'phone', verticalAlign: 'middle' }), t('Voice_Call')] })] }), servedBy && (0, jsx_runtime_1.jsx)(AgentField_1.default, { isSmall: true, agent: servedBy }), v && _name && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Contact') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x28', username: _name }), (0, jsx_runtime_1.jsx)(AgentInfoDetails_1.default, { mis: 8, name: (0, parseOutboundPhoneNumber_1.parseOutboundPhoneNumber)(_name), status: (0, jsx_runtime_1.jsx)(UserStatus_1.UserStatus, { status: v === null || v === void 0 ? void 0 : v.status }) })] })] })), phoneNumber && (0, jsx_runtime_1.jsx)(InfoField_1.InfoField, { label: t('Caller_Id'), info: (0, parseOutboundPhoneNumber_1.parseOutboundPhoneNumber)(phoneNumber) }), queue && (0, jsx_runtime_1.jsx)(InfoField_1.InfoField, { label: t('Queue'), info: queue }), endedAt && (0, jsx_runtime_1.jsx)(InfoField_1.InfoField, { label: t('Last_Call'), info: endedAt }), (0, jsx_runtime_1.jsx)(InfoField_1.InfoField, { label: t('Waiting_Time'), info: waiting || t('Not_Available') }), (0, jsx_runtime_1.jsx)(InfoField_1.InfoField, { label: t('Talk_Time'), info: duration || t('Not_Available') }), (0, jsx_runtime_1.jsx)(InfoField_1.InfoField, { label: t('Hold_Time'), info: hold || t('Not_Available') }), (0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Wrap_Up_Notes') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { withTruncatedText: false, children: shouldShowWrapup ? lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.msg : t('Not_Available') }), shouldShowTags && ((0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', children: tags === null || tags === void 0 ? void 0 : tags.map((tag) => ((0, jsx_runtime_1.jsx)(fuselage_1.Chip, { mie: 4, value: tag, children: tag }, tag))) }) }))] })] }) }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: isCallReady && (0, jsx_runtime_1.jsx)(VoipInfoCallButton_1.VoipInfoCallButton, { phoneNumber: phoneNumber }) }) })] }));
};
exports.VoipInfo = VoipInfo;
