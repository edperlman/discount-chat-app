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
exports.getRoomMessages = getRoomMessages;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
function getRoomMessages(_a) {
    return __awaiter(this, arguments, void 0, function* ({ rid }) {
        const room = yield models_1.Rooms.findOneById(rid, { projection: { t: 1 } });
        if ((room === null || room === void 0 ? void 0 : room.t) !== 'l') {
            throw new meteor_1.Meteor.Error('invalid-room');
        }
        const ignoredMessageTypes = [
            'livechat_navigation_history',
            'livechat_transcript_history',
            'command',
            'livechat-close',
            'livechat-started',
            'livechat_video_call',
        ];
        return models_1.Messages.findVisibleByRoomIdNotContainingTypes(rid, ignoredMessageTypes, {
            sort: { ts: 1 },
        });
    });
}
