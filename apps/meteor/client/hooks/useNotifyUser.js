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
exports.useNotifyUser = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useEmbeddedLayout_1 = require("./useEmbeddedLayout");
const client_1 = require("../../app/models/client");
const KonchatNotification_1 = require("../../app/ui/client/lib/KonchatNotification");
const RoomManager_1 = require("../lib/RoomManager");
const fireGlobalEvent_1 = require("../lib/utils/fireGlobalEvent");
const useNotifyUser = () => {
    const user = (0, ui_contexts_1.useUser)();
    const router = (0, ui_contexts_1.useRouter)();
    const isLayoutEmbedded = (0, useEmbeddedLayout_1.useEmbeddedLayout)();
    const notifyUserStream = (0, ui_contexts_1.useStream)('notify-user');
    const muteFocusedConversations = (0, ui_contexts_1.useUserPreference)('muteFocusedConversations');
    const notifyNewRoom = (0, react_1.useCallback)((sub) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user || user.status === 'busy') {
            return;
        }
        if ((!router.getRouteParameters().name || router.getRouteParameters().name !== sub.name) && !sub.ls && sub.alert === true) {
            KonchatNotification_1.KonchatNotification.newRoom(sub.rid);
        }
    }), [router, user]);
    const notifyNewMessageAudio = (0, react_1.useCallback)((rid) => {
        const hasFocus = document.hasFocus();
        const messageIsInOpenedRoom = RoomManager_1.RoomManager.opened === rid;
        if (isLayoutEmbedded) {
            if (!hasFocus && messageIsInOpenedRoom) {
                // Play a notification sound
                void KonchatNotification_1.KonchatNotification.newMessage(rid);
            }
        }
        else if (!hasFocus || !messageIsInOpenedRoom || !muteFocusedConversations) {
            // Play a notification sound
            void KonchatNotification_1.KonchatNotification.newMessage(rid);
        }
    }, [isLayoutEmbedded, muteFocusedConversations]);
    (0, react_1.useEffect)(() => {
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            return;
        }
        notifyUserStream(`${user === null || user === void 0 ? void 0 : user._id}/notification`, (notification) => {
            const openedRoomId = ['channel', 'group', 'direct'].includes(router.getRouteName() || '') ? RoomManager_1.RoomManager.opened : undefined;
            const hasFocus = document.hasFocus();
            const messageIsInOpenedRoom = openedRoomId === notification.payload.rid;
            (0, fireGlobalEvent_1.fireGlobalEvent)('notification', {
                notification,
                fromOpenedRoom: messageIsInOpenedRoom,
                hasFocus,
            });
            if (isLayoutEmbedded) {
                if (!hasFocus && messageIsInOpenedRoom) {
                    // Show a notification.
                    KonchatNotification_1.KonchatNotification.showDesktop(notification);
                }
            }
            else if (!hasFocus || !messageIsInOpenedRoom) {
                // Show a notification.
                KonchatNotification_1.KonchatNotification.showDesktop(notification);
            }
            notifyNewMessageAudio(notification.payload.rid);
        });
        notifyUserStream(`${user === null || user === void 0 ? void 0 : user._id}/subscriptions-changed`, (action, sub) => {
            if (action === 'removed') {
                return;
            }
            void notifyNewRoom(sub);
        });
        client_1.CachedChatSubscription.collection.find().observe({
            changed: (sub) => {
                void notifyNewRoom(sub);
            },
        });
    }, [isLayoutEmbedded, notifyNewMessageAudio, notifyNewRoom, notifyUserStream, router, user === null || user === void 0 ? void 0 : user._id]);
};
exports.useNotifyUser = useNotifyUser;
