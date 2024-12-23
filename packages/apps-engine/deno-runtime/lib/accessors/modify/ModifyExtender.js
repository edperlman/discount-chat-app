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
exports.ModifyExtender = void 0;
const AppObjectRegistry_ts_1 = require("../../../AppObjectRegistry.ts");
const MessageExtender_ts_1 = require("../extenders/MessageExtender.ts");
const RoomExtender_ts_1 = require("../extenders/RoomExtender.ts");
const VideoConferenceExtend_ts_1 = require("../extenders/VideoConferenceExtend.ts");
const require_ts_1 = require("../../../lib/require.ts");
const { RocketChatAssociationModel } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/metadata/RocketChatAssociations.js');
class ModifyExtender {
    constructor(senderFn) {
        this.senderFn = senderFn;
    }
    extendMessage(messageId, updater) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.senderFn({
                method: 'bridges:getMessageBridge:doGetById',
                params: [messageId, AppObjectRegistry_ts_1.AppObjectRegistry.get('id')],
            });
            const msg = result.result;
            msg.editor = updater;
            msg.editedAt = new Date();
            return new MessageExtender_ts_1.MessageExtender(msg);
        });
    }
    extendRoom(roomId, _updater) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.senderFn({
                method: 'bridges:getRoomBridge:doGetById',
                params: [roomId, AppObjectRegistry_ts_1.AppObjectRegistry.get('id')],
            });
            const room = result.result;
            room.updatedAt = new Date();
            return new RoomExtender_ts_1.RoomExtender(room);
        });
    }
    extendVideoConference(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.senderFn({
                method: 'bridges:getVideoConferenceBridge:doGetById',
                params: [id, AppObjectRegistry_ts_1.AppObjectRegistry.get('id')],
            });
            const call = result.result;
            call._updatedAt = new Date();
            return new VideoConferenceExtend_ts_1.VideoConferenceExtender(call);
        });
    }
    finish(extender) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (extender.kind) {
                case RocketChatAssociationModel.MESSAGE:
                    yield this.senderFn({
                        method: 'bridges:getMessageBridge:doUpdate',
                        params: [extender.getMessage(), AppObjectRegistry_ts_1.AppObjectRegistry.get('id')],
                    });
                    break;
                case RocketChatAssociationModel.ROOM:
                    yield this.senderFn({
                        method: 'bridges:getRoomBridge:doUpdate',
                        params: [
                            extender.getRoom(),
                            extender.getUsernamesOfMembersBeingAdded(),
                            AppObjectRegistry_ts_1.AppObjectRegistry.get('id'),
                        ],
                    });
                    break;
                case RocketChatAssociationModel.VIDEO_CONFERENCE:
                    yield this.senderFn({
                        method: 'bridges:getVideoConferenceBridge:doUpdate',
                        params: [extender.getVideoConference(), AppObjectRegistry_ts_1.AppObjectRegistry.get('id')],
                    });
                    break;
                default:
                    throw new Error('Invalid extender passed to the ModifyExtender.finish function.');
            }
        });
    }
}
exports.ModifyExtender = ModifyExtender;
