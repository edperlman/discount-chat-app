"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const OTREstablished_1 = __importDefault(require("./components/OTREstablished"));
const OTRStates_1 = __importDefault(require("./components/OTRStates"));
const OtrRoomState_1 = require("../../../../../app/otr/lib/OtrRoomState");
const Contextualbar_1 = require("../../../../components/Contextualbar");
const RoomContext_1 = require("../../contexts/RoomContext");
const OTR = ({ isOnline, onClickClose, onClickStart, onClickEnd, onClickRefresh, otrState, peerUsername }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const room = (0, RoomContext_1.useRoom)();
    const renderOTRState = () => {
        switch (otrState) {
            case OtrRoomState_1.OtrRoomState.NOT_STARTED:
                return ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClickStart, primary: true, children: t('Start_OTR') }));
            case OtrRoomState_1.OtrRoomState.ESTABLISHING:
                return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', children: t('Please_wait_while_OTR_is_being_established') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: 16, children: (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, {}) })] }));
            case OtrRoomState_1.OtrRoomState.ESTABLISHED:
                return (0, jsx_runtime_1.jsx)(OTREstablished_1.default, { onClickEnd: onClickEnd, onClickRefresh: onClickRefresh });
            case OtrRoomState_1.OtrRoomState.DECLINED:
                return ((0, jsx_runtime_1.jsx)(OTRStates_1.default, { title: t('OTR_Chat_Declined_Title'), description: t('OTR_Chat_Declined_Description', { postProcess: 'sprintf', sprintf: [peerUsername || ''] }), icon: 'cross', onClickStart: onClickStart }));
            case OtrRoomState_1.OtrRoomState.TIMEOUT:
                return ((0, jsx_runtime_1.jsx)(OTRStates_1.default, { title: t('OTR_Chat_Timeout_Title'), description: t('OTR_Chat_Timeout_Description', { postProcess: 'sprintf', sprintf: [peerUsername || ''] }), icon: 'clock', onClickStart: onClickStart }));
            default:
                return ((0, jsx_runtime_1.jsx)(OTRStates_1.default, { title: t('OTR_Chat_Error_Title'), description: t('OTR_Chat_Error_Description'), icon: 'warning', onClickStart: onClickStart }));
        }
    };
    const renderOTRBody = () => {
        if (room.encrypted) {
            return ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { title: t('OTR_not_available'), type: 'warning', children: t('OTR_not_available_e2ee') }));
        }
        if (!isOnline) {
            return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2m', children: t('OTR_is_only_available_when_both_users_are_online') });
        }
        return renderOTRState();
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'stopwatch' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('OTR') }), onClickClose && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClickClose })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarScrollableContent, { p: 24, color: 'default', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h4', children: t('Off_the_record_conversation') }), renderOTRBody()] })] }));
};
exports.default = OTR;
