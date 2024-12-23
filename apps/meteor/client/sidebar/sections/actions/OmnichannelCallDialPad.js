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
exports.OmniChannelCallDialPad = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const CallContext_1 = require("../../../contexts/CallContext");
const useDialModal_1 = require("../../../hooks/useDialModal");
const OmniChannelCallDialPad = (_a) => {
    var props = __rest(_a, []);
    const { t } = (0, react_i18next_1.useTranslation)();
    const { openDialModal } = (0, useDialModal_1.useDialModal)();
    const { outBoundCallsAllowed, outBoundCallsEnabledForUser } = (0, CallContext_1.useVoipOutboundStates)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.TopBar.Action, Object.assign({ icon: 'dialpad', onClick: () => openDialModal(), disabled: !outBoundCallsEnabledForUser, "aria-label": t('Open_Dialpad'), "data-tooltip": outBoundCallsAllowed ? t('New_Call') : t('New_Call_Premium_Only') }, props)));
};
exports.OmniChannelCallDialPad = OmniChannelCallDialPad;
