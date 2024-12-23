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
const ui_composer_1 = require("@rocket.chat/ui-composer");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const E2ERoomState_1 = require("../../../../../app/e2e/client/E2ERoomState");
const RoomContext_1 = require("../../contexts/RoomContext");
const useE2EERoomState_1 = require("../../hooks/useE2EERoomState");
const MessageBoxHint = ({ isEditing, e2eEnabled, unencryptedMessagesAllowed, isMobile }) => {
    const room = (0, RoomContext_1.useRoom)();
    const isReadOnly = (room === null || room === void 0 ? void 0 : room.ro) || false;
    const { t } = (0, react_i18next_1.useTranslation)();
    const e2eRoomState = (0, useE2EERoomState_1.useE2EERoomState)(room._id);
    const isUnencryptedHintVisible = e2eEnabled &&
        unencryptedMessagesAllowed &&
        e2eRoomState &&
        e2eRoomState !== E2ERoomState_1.E2ERoomState.READY &&
        e2eRoomState !== E2ERoomState_1.E2ERoomState.DISABLED &&
        !isEditing &&
        !isReadOnly;
    if (!isEditing && !isUnencryptedHintVisible && !isReadOnly) {
        return null;
    }
    const renderHintText = () => {
        if (isEditing) {
            return t('Editing_message');
        }
        if (isReadOnly) {
            return t('This_room_is_read_only');
        }
        if (isUnencryptedHintVisible) {
            return t('E2EE_Composer_Unencrypted_Message');
        }
        return '';
    };
    return ((0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerHint, { icon: isEditing ? 'pencil' : undefined, helperText: isEditing && !isMobile ? (0, jsx_runtime_1.jsx)(react_i18next_1.Trans, { i18nKey: 'Editing_message_hint' }) : undefined, children: renderHintText() }));
};
exports.default = (0, react_1.memo)(MessageBoxHint);
