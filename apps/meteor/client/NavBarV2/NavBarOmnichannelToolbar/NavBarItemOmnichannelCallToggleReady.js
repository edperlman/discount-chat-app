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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const CallContext_1 = require("../../contexts/CallContext");
const NavBarItemOmnichannelCallToggleReady = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const caller = (0, CallContext_1.useCallerInfo)();
    const unregister = (0, CallContext_1.useCallUnregisterClient)();
    const register = (0, CallContext_1.useCallRegisterClient)();
    const networkStatus = (0, CallContext_1.useVoipNetworkStatus)();
    const registered = !['ERROR', 'INITIAL', 'UNREGISTERED'].includes(caller.state);
    const inCall = ['IN_CALL'].includes(caller.state);
    const onClickVoipButton = (0, react_1.useCallback)(() => {
        if (registered) {
            unregister();
            return;
        }
        register();
    }, [registered, register, unregister]);
    const getTitle = () => {
        if (networkStatus === 'offline') {
            return t('Waiting_for_server_connection');
        }
        if (inCall) {
            return t('Cannot_disable_while_on_call');
        }
        if (registered) {
            return t('Turn_off_answer_calls');
        }
        return t('Turn_on_answer_calls');
    };
    const getIcon = () => {
        if (networkStatus === 'offline') {
            return 'phone-issue';
        }
        return registered ? 'phone' : 'phone-disabled';
    };
    return ((0, jsx_runtime_1.jsx)(fuselage_1.NavBarItem, Object.assign({ icon: getIcon(), disabled: inCall, "aria-checked": registered, "aria-label": t('VoIP_Toggle'), "data-tooltip": getTitle() }, props, { success: registered, warning: networkStatus === 'offline', onClick: onClickVoipButton })));
};
exports.default = NavBarItemOmnichannelCallToggleReady;
