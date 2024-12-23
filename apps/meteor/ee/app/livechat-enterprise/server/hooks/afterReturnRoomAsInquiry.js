"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
server_1.settings.watch('Livechat_abandoned_rooms_action', (value) => {
    if (!value || value === 'none') {
        callbacks_1.callbacks.remove('livechat:afterReturnRoomAsInquiry', 'livechat-after-return-room-as-inquiry');
        return;
    }
    callbacks_1.callbacks.add('livechat:afterReturnRoomAsInquiry', ({ room }) => {
        var _a;
        if (!(room === null || room === void 0 ? void 0 : room._id) || !((_a = room === null || room === void 0 ? void 0 : room.omnichannel) === null || _a === void 0 ? void 0 : _a.predictedVisitorAbandonmentAt)) {
            return;
        }
        return models_1.LivechatRooms.unsetPredictedVisitorAbandonmentByRoomId(room._id);
    }, callbacks_1.callbacks.priority.HIGH, 'livechat-after-return-room-as-inquiry');
});
