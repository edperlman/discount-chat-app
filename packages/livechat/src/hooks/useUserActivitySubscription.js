"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserActivitySubscription = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const hooks_1 = require("preact/hooks");
const room_1 = require("../lib/room");
const useUserActivitySubscription = (rid) => {
    const stream = (0, ui_contexts_1.useStream)('notify-room');
    (0, hooks_1.useEffect)(() => {
        if (!rid) {
            return;
        }
        return stream(`${rid}/user-activity`, (username, activities) => {
            (0, room_1.onUserActivity)(username, activities);
        });
    }, [rid, stream]);
};
exports.useUserActivitySubscription = useUserActivitySubscription;
