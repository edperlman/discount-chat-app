"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoipRoomType = void 0;
const client_1 = require("../../../../app/authorization/client");
const client_2 = require("../../../../app/models/client");
const client_3 = require("../../../../app/settings/client");
const getAvatarURL_1 = require("../../../../app/utils/client/getAvatarURL");
const voip_1 = require("../../../../lib/rooms/roomTypes/voip");
const roomCoordinator_1 = require("../roomCoordinator");
exports.VoipRoomType = (0, voip_1.getVoipRoomType)(roomCoordinator_1.roomCoordinator);
roomCoordinator_1.roomCoordinator.add(Object.assign(Object.assign({}, exports.VoipRoomType), { label: 'Voip' }), {
    roomName(room) {
        return room.name || room.fname || room.label;
    },
    condition() {
        return client_3.settings.get('Livechat_enabled') && (0, client_1.hasPermission)('view-l-room');
    },
    getAvatarPath(room) {
        return (0, getAvatarURL_1.getAvatarURL)({ username: `@${this.roomName(room)}` }) || '';
    },
    findRoom(identifier) {
        return client_2.Rooms.findOne({ _id: identifier });
    },
    canSendMessage(_rid) {
        return false;
    },
    readOnly(_rid, _user) {
        return true;
    },
    getIcon() {
        return 'phone';
    },
    extractOpenRoomParams({ id }) {
        return { type: 'v', reference: id };
    },
});
