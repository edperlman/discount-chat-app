"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useOmnichannelContactLabel_1 = require("./hooks/useOmnichannelContactLabel");
const VoipFooter = ({ caller, callerState, callActions, title, subtitle, muted, paused, toggleMic, togglePause, createRoom, openRoom, callsInQueue, dispatchEvent, openedRoomInfo, isEnterprise = false, children, options, }) => {
    const contactLabel = (0, useOmnichannelContactLabel_1.useOmnichannelContactLabel)(caller);
    const { t } = (0, react_i18next_1.useTranslation)();
    const cssClickable = callerState === 'IN_CALL' || callerState === 'ON_HOLD'
        ? (0, css_in_js_1.css) `
					cursor: pointer;
				`
        : '';
    const handleHold = (e) => {
        e.stopPropagation();
        const eventName = paused ? 'VOIP-CALL-UNHOLD' : 'VOIP-CALL-ON-HOLD';
        dispatchEvent({ event: core_typings_1.VoipClientEvents[eventName], rid: openedRoomInfo.rid });
        togglePause(!paused);
    };
    const holdTitle = (() => {
        if (!isEnterprise) {
            return t('Hold_Premium_only');
        }
        return paused ? t('Resume') : t('Hold');
    })();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.SidebarFooter, { elevated: true, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { className: cssClickable, onClick: () => {
                    if (callerState === 'IN_CALL' || callerState === 'ON_HOLD') {
                        openRoom(openedRoomInfo.rid);
                    }
                }, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', fontScale: 'c1', color: 'font-default', mbe: '14px', children: callsInQueue }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', h: '24px', mi: '16px', mbs: '12px', mbe: '8px', justifyContent: 'space-between', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'font-default', fontScale: 'c2', withTruncatedText: true, children: title }), (callerState === 'IN_CALL' || callerState === 'ON_HOLD') && ((0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { small: true, disabled: paused, icon: muted ? 'mic-off' : 'mic', color: muted ? 'disabled' : 'hint', "data-tooltip": muted ? t('Turn_on_microphone') : t('Turn_off_microphone'), onClick: (e) => {
                                            e.stopPropagation();
                                            toggleMic(!muted);
                                        } }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { small: true, "data-tooltip": holdTitle, disabled: !isEnterprise, icon: paused ? 'pause' : 'pause-unfilled', color: paused ? 'disabled' : 'hint', onClick: handleHold }), options && (0, jsx_runtime_1.jsx)(fuselage_1.Menu, { color: 'disabled', "data-tooltip": t('More_options'), options: options })] }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', mi: '16px', mbe: '12px', justifyContent: 'space-between', alignItems: 'center', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'font-default', fontScale: 'p2', withTruncatedText: true, children: contactLabel || t('Anonymous') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'font-default', fontScale: 'c1', withTruncatedText: true, children: subtitle })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(callerState === 'IN_CALL' || callerState === 'ON_HOLD' || callerState === 'OFFER_SENT') && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, square: true, danger: true, icon: 'phone-off', disabled: paused, "aria-label": t('End_call'), "data-tooltip": t('End_Call'), onClick: (e) => {
                                            e.stopPropagation();
                                            muted && toggleMic(false);
                                            paused && togglePause(false);
                                            return callActions.end();
                                        } })), callerState === 'OFFER_RECEIVED' && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'phone-off', "data-tooltip": t('Decline'), "aria-label": t('Decline'), small: true, square: true, danger: true, onClick: callActions.reject })), callerState === 'OFFER_RECEIVED' && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, square: true, success: true, icon: 'phone', "data-tooltip": t('Accept'), onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                                            callActions.pickUp();
                                            const rid = yield createRoom(caller);
                                            dispatchEvent({ event: core_typings_1.VoipClientEvents['VOIP-CALL-STARTED'], rid });
                                        }) }))] })] })] }), children] }));
};
exports.default = VoipFooter;
