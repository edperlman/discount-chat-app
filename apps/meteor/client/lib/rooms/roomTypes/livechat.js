"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivechatRoomType = void 0;
const client_1 = require("../../../../app/authorization/client");
const client_2 = require("../../../../app/models/client");
const client_3 = require("../../../../app/settings/client");
const getAvatarURL_1 = require("../../../../app/utils/client/getAvatarURL");
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const livechat_1 = require("../../../../lib/rooms/roomTypes/livechat");
const roomCoordinator_1 = require("../roomCoordinator");
exports.LivechatRoomType = (0, livechat_1.getLivechatRoomType)(roomCoordinator_1.roomCoordinator);
roomCoordinator_1.roomCoordinator.add(Object.assign(Object.assign({}, exports.LivechatRoomType), { label: 'Omnichannel' }), {
    allowRoomSettingChange(_room, setting) {
        switch (setting) {
            case IRoomTypeConfig_1.RoomSettingsEnum.JOIN_CODE:
                return false;
            default:
                return true;
        }
    },
    allowMemberAction(_room, action) {
        return [IRoomTypeConfig_1.RoomMemberActions.INVITE, IRoomTypeConfig_1.RoomMemberActions.JOIN].includes(action);
    },
    roomName(room) {
        return room.name || room.fname || room.label;
    },
    getUiText(context) {
        switch (context) {
            case IRoomTypeConfig_1.UiTextContext.HIDE_WARNING:
                return 'Hide_Livechat_Warning';
            case IRoomTypeConfig_1.UiTextContext.LEAVE_WARNING:
                return 'Hide_Livechat_Warning';
            default:
                return '';
        }
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
    isLivechatRoom() {
        return true;
    },
    canSendMessage(rid) {
        const room = client_2.Rooms.findOne({ _id: rid }, { fields: { open: 1 } });
        return Boolean(room === null || room === void 0 ? void 0 : room.open);
    },
    readOnly(rid, _user) {
        const room = client_2.Rooms.findOne({ _id: rid }, { fields: { open: 1, servedBy: 1 } });
        if (!(room === null || room === void 0 ? void 0 : room.open)) {
            return true;
        }
        const subscription = client_2.Subscriptions.findOne({ rid });
        return !subscription;
    },
    getIcon() {
        return 'livechat';
    },
    extractOpenRoomParams({ id }) {
        return { type: 'l', reference: id };
    },
});
