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
exports.useMarkAsUnreadMessageAction = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useMarkAsUnreadMutation_1 = require("../hooks/useMarkAsUnreadMutation");
const useMarkAsUnreadMessageAction = (message, { room, subscription }) => {
    const user = (0, ui_contexts_1.useUser)();
    const { mutateAsync: markAsUnread } = (0, useMarkAsUnreadMutation_1.useMarkAsUnreadMutation)();
    const router = (0, ui_contexts_1.useRouter)();
    if ((0, core_typings_1.isOmnichannelRoom)(room) || !user) {
        return null;
    }
    if (!subscription) {
        return null;
    }
    if (message.u._id === user._id) {
        return null;
    }
    return {
        id: 'mark-message-as-unread',
        icon: 'flag',
        label: 'Mark_unread',
        context: ['message', 'message-mobile', 'threads'],
        type: 'interaction',
        action() {
            return __awaiter(this, void 0, void 0, function* () {
                router.navigate('/home');
                yield markAsUnread({ message, subscription });
            });
        },
        order: 4,
        group: 'menu',
    };
};
exports.useMarkAsUnreadMessageAction = useMarkAsUnreadMessageAction;
