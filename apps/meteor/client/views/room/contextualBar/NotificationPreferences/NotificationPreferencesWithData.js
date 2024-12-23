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
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const NotificationPreferences_1 = __importDefault(require("./NotificationPreferences"));
const useEndpointAction_1 = require("../../../../hooks/useEndpointAction");
const RoomContext_1 = require("../../contexts/RoomContext");
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const NotificationPreferencesWithData = () => {
    var _a;
    const t = (0, ui_contexts_1.useTranslation)();
    const room = (0, RoomContext_1.useRoom)();
    const subscription = (0, RoomContext_1.useRoomSubscription)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const customSound = (0, ui_contexts_1.useCustomSound)();
    const saveSettings = (0, useEndpointAction_1.useEndpointAction)('POST', '/v1/rooms.saveNotification', {
        successMessage: t('Room_updated_successfully'),
    });
    const customSoundAsset = (_a = customSound === null || customSound === void 0 ? void 0 : customSound.getList()) === null || _a === void 0 ? void 0 : _a.map((value) => [value._id, value.name]);
    const defaultOption = [
        ['default', t('Default')],
        ['all', t('All_messages')],
        ['mentions', t('Mentions')],
        ['nothing', t('Nothing')],
    ];
    const defaultSoundOption = [
        ['none', t('None')],
        ['default', t('Default')],
    ];
    const notificationOptions = {
        alerts: defaultOption,
        sounds: customSoundAsset ? [...defaultSoundOption, ...customSoundAsset] : defaultSoundOption,
    };
    const methods = (0, react_hook_form_1.useForm)({
        defaultValues: {
            turnOn: !(subscription === null || subscription === void 0 ? void 0 : subscription.disableNotifications),
            muteGroupMentions: !!(subscription === null || subscription === void 0 ? void 0 : subscription.muteGroupMentions),
            showCounter: !(subscription === null || subscription === void 0 ? void 0 : subscription.hideUnreadStatus),
            showMentions: !(subscription === null || subscription === void 0 ? void 0 : subscription.hideMentionStatus),
            desktopAlert: ((subscription === null || subscription === void 0 ? void 0 : subscription.desktopPrefOrigin) === 'subscription' && subscription.desktopNotifications) || 'default',
            desktopSound: (subscription === null || subscription === void 0 ? void 0 : subscription.audioNotificationValue) || 'default',
            mobileAlert: ((subscription === null || subscription === void 0 ? void 0 : subscription.mobilePrefOrigin) === 'subscription' && subscription.mobilePushNotifications) || 'default',
            emailAlert: ((subscription === null || subscription === void 0 ? void 0 : subscription.emailPrefOrigin) === 'subscription' && subscription.emailNotifications) || 'default',
        },
    });
    const { desktopSound } = methods.watch();
    const handlePlaySound = () => {
        customSound.play(desktopSound);
    };
    const handleSave = methods.handleSubmit(({ turnOn, muteGroupMentions, showCounter, showMentions, desktopAlert, desktopSound, mobileAlert, emailAlert }) => {
        const notifications = {
            disableNotifications: turnOn ? '0' : '1',
            muteGroupMentions: muteGroupMentions ? '1' : '0',
            hideUnreadStatus: showCounter ? '0' : '1',
            hideMentionStatus: showMentions ? '0' : '1',
            desktopNotifications: desktopAlert,
            audioNotificationValue: desktopSound,
            mobilePushNotifications: mobileAlert,
            emailNotifications: emailAlert,
        };
        saveSettings({
            roomId: room._id,
            notifications,
        });
    });
    return ((0, jsx_runtime_1.jsx)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: (0, jsx_runtime_1.jsx)(NotificationPreferences_1.default, { handleClose: closeTab, handleSave: handleSave, handlePlaySound: handlePlaySound, notificationOptions: notificationOptions }) })));
};
exports.default = (0, react_1.memo)(NotificationPreferencesWithData);
