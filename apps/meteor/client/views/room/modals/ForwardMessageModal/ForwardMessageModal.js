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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const UserAndRoomAutoCompleteMultiple_1 = __importDefault(require("../../../../components/UserAndRoomAutoCompleteMultiple"));
const QuoteAttachment_1 = require("../../../../components/message/content/attachments/QuoteAttachment");
const useUserDisplayName_1 = require("../../../../hooks/useUserDisplayName");
const prependReplies_1 = require("../../../../lib/utils/prependReplies");
const ForwardMessageModal = ({ onClose, permalink, message }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const getUserAvatarPath = (0, ui_contexts_1.useUserAvatarPath)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { copy, hasCopied } = (0, fuselage_hooks_1.useClipboard)(permalink);
    const usersAndRoomsField = (0, fuselage_hooks_1.useUniqueId)();
    const { control, watch } = (0, react_hook_form_1.useForm)({
        defaultValues: {
            rooms: [],
        },
    });
    const rooms = watch('rooms');
    const sendMessage = (0, ui_contexts_1.useEndpoint)('POST', '/v1/chat.postMessage');
    const sendMessageMutation = (0, react_query_1.useMutation)({
        mutationFn: () => __awaiter(void 0, void 0, void 0, function* () {
            const optionalMessage = '';
            const curMsg = yield (0, prependReplies_1.prependReplies)(optionalMessage, [message]);
            const sendPayload = {
                roomId: rooms,
                text: curMsg,
            };
            return sendMessage(sendPayload);
        }),
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Message_has_been_forwarded') });
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
        onSettled: () => {
            onClose();
        },
    });
    const avatarUrl = getUserAvatarPath(message.u.username);
    const displayName = (0, useUserDisplayName_1.useUserDisplayName)(message.u);
    const attachment = {
        author_name: String(displayName),
        author_link: '',
        author_icon: avatarUrl,
        message_link: '',
        text: message.msg,
        attachments: message.attachments,
        md: message.md,
    };
    const handleCopy = () => {
        if (!hasCopied) {
            copy();
        }
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Forward_message') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onClose, title: t('Close') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: usersAndRoomsField, children: t('Person_Or_Channel') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'rooms', control: control, render: ({ field: { name, value, onChange } }) => ((0, jsx_runtime_1.jsx)(UserAndRoomAutoCompleteMultiple_1.default, { id: usersAndRoomsField, "aria-describedby": `${usersAndRoomsField}-hint`, name: name, value: value, onChange: onChange })) }) }), !rooms.length && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${usersAndRoomsField}-hint`, children: t('Select_atleast_one_channel_to_forward_the_messsage_to') }))] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsx)(QuoteAttachment_1.QuoteAttachment, { attachment: attachment }) })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleCopy, disabled: hasCopied, children: hasCopied ? t('Copied') : t('Copy_Link') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { disabled: !rooms.length, loading: sendMessageMutation.isLoading, onClick: () => sendMessageMutation.mutate(), primary: true, children: t('Forward') })] }) })] }));
};
exports.default = (0, react_1.memo)(ForwardMessageModal);
