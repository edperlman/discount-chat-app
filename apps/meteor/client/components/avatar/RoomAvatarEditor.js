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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const getAvatarURL_1 = require("../../../app/utils/client/getAvatarURL");
const useSingleFileInput_1 = require("../../hooks/useSingleFileInput");
const isValidImageFormat_1 = require("../../lib/utils/isValidImageFormat");
const RoomAvatarEditor = ({ disabled = false, room, roomAvatar, onChangeAvatar }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const handleChangeAvatar = (0, fuselage_hooks_1.useMutableCallback)((file) => __awaiter(void 0, void 0, void 0, function* () {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => __awaiter(void 0, void 0, void 0, function* () {
            const { result } = reader;
            if (typeof result === 'string' && (yield (0, isValidImageFormat_1.isValidImageFormat)(result))) {
                onChangeAvatar(result);
                return;
            }
            dispatchToastMessage({ type: 'error', message: t('Avatar_format_invalid') });
        });
    }));
    const [clickUpload, reset] = (0, useSingleFileInput_1.useSingleFileInput)(handleChangeAvatar);
    const clickReset = (0, fuselage_hooks_1.useMutableCallback)(() => {
        reset();
        onChangeAvatar(null);
    });
    (0, react_1.useEffect)(() => {
        !roomAvatar && reset();
    }, [roomAvatar, reset]);
    const defaultUrl = room.prid ? (0, getAvatarURL_1.getAvatarURL)({ roomId: room.prid }) : (0, getAvatarURL_1.getAvatarURL)({ username: `@${room.name}` }); // Discussions inherit avatars from the parent room
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { borderRadius: 'x2', maxWidth: 'x332', w: 'full', position: 'relative', children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.RoomAvatar, Object.assign({}, (roomAvatar !== undefined && { url: roomAvatar === null ? defaultUrl : roomAvatar }), { room: room, size: 'x332' })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: [
                    (0, css_in_js_1.css) `
						bottom: 0;
						right: 0;
					`,
                ], position: 'absolute', m: 12, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'upload', disabled: (0, core_typings_1.isRoomFederated)(room) || disabled, small: true, title: t('Upload_user_avatar'), onClick: clickUpload, children: t('Upload') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, danger: true, icon: 'trash', title: t('Accounts_SetDefaultAvatar'), disabled: !roomAvatar || (0, core_typings_1.isRoomFederated)(room) || disabled, onClick: clickReset })] }) })] }));
};
exports.default = RoomAvatarEditor;
