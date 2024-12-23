"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscussionBuilder = void 0;
const RoomBuilder_ts_1 = require("./RoomBuilder.ts");
const require_ts_1 = require("../../../lib/require.ts");
const { RocketChatAssociationModel } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/metadata/RocketChatAssociations.js');
const { RoomType } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/rooms/RoomType.js');
class DiscussionBuilder extends RoomBuilder_ts_1.RoomBuilder {
    constructor(data) {
        super(data);
        this.kind = RocketChatAssociationModel.DISCUSSION;
        this.room.type = RoomType.PRIVATE_GROUP;
    }
    setParentRoom(parentRoom) {
        this.room.parentRoom = parentRoom;
        return this;
    }
    getParentRoom() {
        return this.room.parentRoom;
    }
    setReply(reply) {
        this.reply = reply;
        return this;
    }
    getReply() {
        return this.reply;
    }
    setParentMessage(parentMessage) {
        this.parentMessage = parentMessage;
        return this;
    }
    getParentMessage() {
        return this.parentMessage;
    }
}
exports.DiscussionBuilder = DiscussionBuilder;
