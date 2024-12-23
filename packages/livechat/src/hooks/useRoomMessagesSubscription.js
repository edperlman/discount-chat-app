"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoomMessagesSubscription = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const hooks_1 = require("preact/hooks");
const room_1 = require("../lib/room");
const useRoomMessagesSubscription = (rid, token) => {
    const stream = (0, ui_contexts_1.useStream)('room-messages');
    (0, hooks_1.useEffect)(() => {
        if (!rid) {
            return;
        }
        return stream(rid, (msg) => {
            (0, room_1.onMessage)(msg);
        });
    }, [rid, stream, token]);
};
exports.useRoomMessagesSubscription = useRoomMessagesSubscription;
