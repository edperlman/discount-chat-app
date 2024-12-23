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
exports.useEditMessageAction = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const moment_1 = __importDefault(require("moment"));
const ChatContext_1 = require("../../../views/room/contexts/ChatContext");
const useEditMessageAction = (message, { room, subscription }) => {
    const user = (0, ui_contexts_1.useUser)();
    const chat = (0, ChatContext_1.useChat)();
    const isEditAllowed = (0, ui_contexts_1.useSetting)('Message_AllowEditing', true);
    const canEditMessage = (0, ui_contexts_1.usePermission)('edit-message', message.rid);
    const blockEditInMinutes = (0, ui_contexts_1.useSetting)('Message_AllowEditing_BlockEditInMinutes', 0);
    const canBypassBlockTimeLimit = (0, ui_contexts_1.usePermission)('bypass-time-limit-edit-and-delete', message.rid);
    if (!subscription) {
        return null;
    }
    const condition = (() => {
        if ((0, core_typings_1.isRoomFederated)(room)) {
            return message.u._id === (user === null || user === void 0 ? void 0 : user._id);
        }
        const editOwn = message.u && message.u._id === (user === null || user === void 0 ? void 0 : user._id);
        if (!canEditMessage && (!isEditAllowed || !editOwn)) {
            return false;
        }
        if (!canBypassBlockTimeLimit && blockEditInMinutes) {
            const msgTs = message.ts ? (0, moment_1.default)(message.ts) : undefined;
            const currentTsDiff = msgTs ? (0, moment_1.default)().diff(msgTs, 'minutes') : undefined;
            return typeof currentTsDiff === 'number' && currentTsDiff < blockEditInMinutes;
        }
        return true;
    })();
    if (!condition) {
        return null;
    }
    return {
        id: 'edit-message',
        icon: 'edit',
        label: 'Edit',
        context: ['message', 'message-mobile', 'threads', 'federated'],
        type: 'management',
        action() {
            return __awaiter(this, void 0, void 0, function* () {
                yield (chat === null || chat === void 0 ? void 0 : chat.messageEditing.editMessage(message));
            });
        },
        order: 8,
        group: 'menu',
    };
};
exports.useEditMessageAction = useEditMessageAction;
