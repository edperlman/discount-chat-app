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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeleteMessageAction = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const roomCoordinator_1 = require("../../../lib/rooms/roomCoordinator");
const ChatContext_1 = require("../../../views/room/contexts/ChatContext");
const useDeleteMessageAction = (message, { room, subscription }) => {
    const user = (0, ui_contexts_1.useUser)();
    const chat = (0, ChatContext_1.useChat)();
    const { data: condition = false } = (0, react_query_1.useQuery)({
        queryKey: ['delete-message', message],
        queryFn: () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (!subscription) {
                return false;
            }
            if ((0, core_typings_1.isRoomFederated)(room)) {
                return message.u._id === (user === null || user === void 0 ? void 0 : user._id);
            }
            const isLivechatRoom = roomCoordinator_1.roomCoordinator.isLivechatRoom(room.t);
            if (isLivechatRoom) {
                return false;
            }
            return (_a = chat === null || chat === void 0 ? void 0 : chat.data.canDeleteMessage(message)) !== null && _a !== void 0 ? _a : false;
        }),
    });
    if (!condition) {
        return null;
    }
    return {
        id: 'delete-message',
        icon: 'trash',
        label: 'Delete',
        context: ['message', 'message-mobile', 'threads', 'federated', 'videoconf', 'videoconf-threads'],
        color: 'alert',
        type: 'management',
        action() {
            return __awaiter(this, void 0, void 0, function* () {
                yield (chat === null || chat === void 0 ? void 0 : chat.flows.requestMessageDeletion(message));
            });
        },
        order: 10,
        group: 'menu',
    };
};
exports.useDeleteMessageAction = useDeleteMessageAction;
