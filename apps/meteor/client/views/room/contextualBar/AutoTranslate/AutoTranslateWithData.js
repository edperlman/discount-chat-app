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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AutoTranslate_1 = __importDefault(require("./AutoTranslate"));
const useEndpointAction_1 = require("../../../../hooks/useEndpointAction");
const useEndpointData_1 = require("../../../../hooks/useEndpointData");
const toast_1 = require("../../../../lib/toast");
const RoomContext_1 = require("../../contexts/RoomContext");
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const AutoTranslateWithData = () => {
    var _a;
    const room = (0, RoomContext_1.useRoom)();
    const subscription = (0, RoomContext_1.useRoomSubscription)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const userLanguage = (0, ui_contexts_1.useLanguage)();
    const [currentLanguage, setCurrentLanguage] = (0, react_1.useState)((_a = subscription === null || subscription === void 0 ? void 0 : subscription.autoTranslateLanguage) !== null && _a !== void 0 ? _a : '');
    const saveSettings = (0, useEndpointAction_1.useEndpointAction)('POST', '/v1/autotranslate.saveSettings');
    const { t } = (0, react_i18next_1.useTranslation)();
    const { value: translateData } = (0, useEndpointData_1.useEndpointData)('/v1/autotranslate.getSupportedLanguages', {
        params: (0, react_1.useMemo)(() => ({ targetLanguage: userLanguage }), [userLanguage]),
    });
    const languagesDict = translateData ? Object.fromEntries(translateData.languages.map((lang) => [lang.language, lang.name])) : {};
    const handleChangeLanguage = (0, fuselage_hooks_1.useMutableCallback)((value) => {
        setCurrentLanguage(value);
        saveSettings({
            roomId: room._id,
            field: 'autoTranslateLanguage',
            value,
        });
        (0, toast_1.dispatchToastMessage)({
            type: 'success',
            message: t('AutoTranslate_language_set_to', { language: languagesDict[value] }),
        });
    });
    const handleSwitch = (0, fuselage_hooks_1.useMutableCallback)((event) => {
        saveSettings({
            roomId: room._id,
            field: 'autoTranslate',
            value: event.target.checked,
        });
        (0, toast_1.dispatchToastMessage)({
            type: 'success',
            message: event.target.checked
                ? t('AutoTranslate_Enabled_for_room', { roomName: room.name })
                : t('AutoTranslate_Disabled_for_room', { roomName: room.name }),
        });
        if (event.target.checked && currentLanguage) {
            (0, toast_1.dispatchToastMessage)({
                type: 'success',
                message: t('AutoTranslate_language_set_to', { language: languagesDict[currentLanguage] }),
            });
        }
    });
    (0, react_1.useEffect)(() => {
        if (!(subscription === null || subscription === void 0 ? void 0 : subscription.autoTranslate)) {
            return;
        }
        if (!(subscription === null || subscription === void 0 ? void 0 : subscription.autoTranslateLanguage)) {
            handleChangeLanguage(userLanguage);
        }
    }, [subscription === null || subscription === void 0 ? void 0 : subscription.autoTranslate, subscription === null || subscription === void 0 ? void 0 : subscription.autoTranslateLanguage, handleChangeLanguage, userLanguage]);
    return ((0, jsx_runtime_1.jsx)(AutoTranslate_1.default, { language: currentLanguage, languages: translateData ? translateData.languages.map((language) => [language.language, language.name]) : [], handleSwitch: handleSwitch, handleChangeLanguage: handleChangeLanguage, translateEnable: !!(subscription === null || subscription === void 0 ? void 0 : subscription.autoTranslate), handleClose: closeTab }));
};
exports.default = (0, react_1.memo)(AutoTranslateWithData);
