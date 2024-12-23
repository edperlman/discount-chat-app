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
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const UserAvatarSuggestions_1 = __importDefault(require("./UserAvatarSuggestions"));
const readFileAsDataURL_1 = require("./readFileAsDataURL");
const useSingleFileInput_1 = require("../../../hooks/useSingleFileInput");
const isValidImageFormat_1 = require("../../../lib/utils/isValidImageFormat");
function UserAvatarEditor({ currentUsername, username, setAvatarObj, disabled, etag }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const rotateImages = (0, ui_contexts_1.useSetting)('FileUpload_RotateImages');
    const [avatarFromUrl, setAvatarFromUrl] = (0, react_1.useState)('');
    const [newAvatarSource, setNewAvatarSource] = (0, react_1.useState)();
    const imageUrlField = (0, fuselage_hooks_1.useUniqueId)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setUploadedPreview = (0, react_1.useCallback)((file, avatarObj) => __awaiter(this, void 0, void 0, function* () {
        setAvatarObj(avatarObj);
        try {
            const dataURL = yield (0, readFileAsDataURL_1.readFileAsDataURL)(file);
            if (yield (0, isValidImageFormat_1.isValidImageFormat)(dataURL)) {
                setNewAvatarSource(dataURL);
            }
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: t('Avatar_format_invalid') });
        }
    }), [setAvatarObj, t, dispatchToastMessage]);
    const [clickUpload] = (0, useSingleFileInput_1.useSingleFileInput)(setUploadedPreview);
    const handleAddUrl = () => {
        setNewAvatarSource(avatarFromUrl);
        setAvatarObj({ avatarUrl: avatarFromUrl });
    };
    const clickReset = () => {
        setNewAvatarSource(`/avatar/%40${username}`);
        setAvatarObj('reset');
    };
    const url = newAvatarSource;
    const handleAvatarFromUrlChange = (event) => {
        setAvatarFromUrl(event.currentTarget.value);
    };
    const handleSelectSuggestion = (0, react_1.useCallback)((suggestion) => {
        setAvatarObj(suggestion);
        setNewAvatarSource(suggestion.blob);
    }, [setAvatarObj, setNewAvatarSource]);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', fontScale: 'p2m', color: 'default', children: [t('Profile_picture'), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', mbs: 4, children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x124', url: url, "data-qa-id": 'UserAvatarEditor', username: currentUsername || '', etag: etag, style: {
                            imageOrientation: rotateImages ? 'from-image' : 'none',
                            objectFit: 'contain',
                        }, onError: () => dispatchToastMessage({ type: 'error', message: t('error-invalid-image-url') }) }, url), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', flexGrow: '1', justifyContent: 'space-between', mis: 4, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', mbs: 'none', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { square: true, disabled: disabled, mi: 4, title: t('Accounts_SetDefaultAvatar'), onClick: clickReset, children: (0, jsx_runtime_1.jsx)(fuselage_1.Avatar, { url: `/avatar/%40${username}` }) }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'upload', secondary: true, disabled: disabled, title: t('Upload'), mi: 4, onClick: clickUpload }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'permalink', secondary: true, disabled: disabled || !avatarFromUrl, title: t('Add_URL'), mi: 4, onClick: handleAddUrl, "data-qa-id": 'UserAvatarEditorSetAvatarLink' }), (0, jsx_runtime_1.jsx)(UserAvatarSuggestions_1.default, { disabled: disabled, onSelectOne: handleSelectSuggestion })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Label, { htmlFor: imageUrlField, mis: 4, children: t('Use_url_for_avatar') }), (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { "data-qa-id": 'UserAvatarEditorLink', id: imageUrlField, flexGrow: 0, placeholder: t('Use_url_for_avatar'), value: avatarFromUrl, mis: 4, onChange: handleAvatarFromUrlChange })] })] })] }));
}
exports.default = UserAvatarEditor;
