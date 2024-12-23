"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_i18next_1 = require("react-i18next");
const VoipActionButton_1 = __importDefault(require("../VoipActionButton"));
const isIncoming = (props) => 'onDecline' in props && 'onAccept' in props && !('onEndCall' in props);
const isOngoing = (props) => 'onEndCall' in props && !('onAccept' in props && 'onDecline' in props);
const VoipActions = (_a) => {
    var { isMuted, isHeld, isDTMFActive, isTransferActive } = _a, events = __rest(_a, ["isMuted", "isHeld", "isDTMFActive", "isTransferActive"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { large: true, children: [isIncoming(events) && (0, jsx_runtime_1.jsx)(VoipActionButton_1.default, { danger: true, label: t('Decline'), icon: 'phone-off', onClick: events.onDecline }), (0, jsx_runtime_1.jsx)(VoipActionButton_1.default, { label: isMuted ? t('Turn_on_microphone') : t('Turn_off_microphone'), icon: 'mic-off', pressed: isMuted, disabled: !events.onMute, onClick: () => { var _a; return (_a = events.onMute) === null || _a === void 0 ? void 0 : _a.call(events, !isMuted); } }), !isIncoming(events) && ((0, jsx_runtime_1.jsx)(VoipActionButton_1.default, { label: isHeld ? t('Resume') : t('Hold'), icon: 'pause-shape-unfilled', pressed: isHeld, disabled: !events.onHold, onClick: () => { var _a; return (_a = events.onHold) === null || _a === void 0 ? void 0 : _a.call(events, !isHeld); } })), (0, jsx_runtime_1.jsx)(VoipActionButton_1.default, { label: isDTMFActive ? t('Close_Dialpad') : t('Open_Dialpad'), icon: 'dialpad', pressed: isDTMFActive, disabled: !events.onDTMF, onClick: events.onDTMF }), (0, jsx_runtime_1.jsx)(VoipActionButton_1.default, { label: t('Transfer_call'), icon: 'arrow-forward', pressed: isTransferActive, disabled: !events.onTransfer, onClick: events.onTransfer }), isOngoing(events) && (0, jsx_runtime_1.jsx)(VoipActionButton_1.default, { danger: true, label: t('End_call'), icon: 'phone-off', disabled: isHeld, onClick: events.onEndCall }), isIncoming(events) && (0, jsx_runtime_1.jsx)(VoipActionButton_1.default, { success: true, label: t('Accept'), icon: 'phone', onClick: events.onAccept })] }));
};
exports.default = VoipActions;
