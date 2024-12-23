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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const ui_voip_1 = require("@rocket.chat/ui-voip");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useMediaPermissions_1 = require("../../../views/room/composer/messageBox/hooks/useMediaPermissions");
const RoomContext_1 = require("../../../views/room/contexts/RoomContext");
const useUserInfoQuery_1 = require("../../useUserInfoQuery");
const useVoipMenuOptions = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { uids = [] } = (0, RoomContext_1.useRoom)();
    const ownUserId = (0, ui_contexts_1.useUserId)();
    const [isMicPermissionDenied] = (0, useMediaPermissions_1.useMediaPermissions)('microphone');
    const { isEnabled, isRegistered, isInCall } = (0, ui_voip_1.useVoipState)();
    const { makeCall } = (0, ui_voip_1.useVoipAPI)();
    const members = (0, react_1.useMemo)(() => uids.filter((uid) => uid !== ownUserId), [uids, ownUserId]);
    const remoteUserId = members[0];
    const { data: { user: remoteUser } = {}, isLoading } = (0, useUserInfoQuery_1.useUserInfoQuery)({ userId: remoteUserId }, { enabled: Boolean(remoteUserId) });
    const isRemoteRegistered = !!(remoteUser === null || remoteUser === void 0 ? void 0 : remoteUser.freeSwitchExtension);
    const isDM = members.length === 1;
    const disabled = isMicPermissionDenied || !isDM || !isRemoteRegistered || !isRegistered || isInCall || isLoading;
    const title = (0, react_1.useMemo)(() => {
        if (isMicPermissionDenied) {
            return t('Microphone_access_not_allowed');
        }
        if (isInCall) {
            return t('Unable_to_make_calls_while_another_is_ongoing');
        }
        return disabled ? t('Voice_calling_disabled') : '';
    }, [disabled, isInCall, isMicPermissionDenied, t]);
    return (0, react_1.useMemo)(() => {
        const items = [
            {
                id: 'start-voip-call',
                icon: 'phone',
                disabled,
                onClick: () => makeCall(remoteUser === null || remoteUser === void 0 ? void 0 : remoteUser.freeSwitchExtension),
                content: ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', title: title, children: t('Voice_call') })),
            },
        ];
        return {
            items: isEnabled ? items : [],
            groups: ['direct'],
            disabled,
            allowed: isEnabled,
            order: 4,
        };
    }, [disabled, title, t, isEnabled, makeCall, remoteUser === null || remoteUser === void 0 ? void 0 : remoteUser.freeSwitchExtension]);
};
exports.default = useVoipMenuOptions;
