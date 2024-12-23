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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_typings_1 = require("@rocket.chat/core-typings");
const moment_1 = __importDefault(require("moment"));
const markRoomResponded_1 = require("../../../../../app/livechat/server/hooks/markRoomResponded");
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
const Helper_1 = require("../lib/Helper");
function shouldSaveInactivity(message) {
    if (message.t || (0, core_typings_1.isEditedMessage)(message) || (0, core_typings_1.isMessageFromVisitor)(message)) {
        return false;
    }
    const abandonedRoomsAction = server_1.settings.get('Livechat_abandoned_rooms_action');
    const visitorInactivityTimeout = server_1.settings.get('Livechat_visitor_inactivity_timeout');
    if (!abandonedRoomsAction || abandonedRoomsAction === 'none' || visitorInactivityTimeout <= 0) {
        return false;
    }
    return true;
}
callbacks_1.callbacks.remove('afterOmnichannelSaveMessage', 'markRoomResponded');
callbacks_1.callbacks.add('afterOmnichannelSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room, roomUpdater }) {
    const responseBy = yield (0, markRoomResponded_1.markRoomResponded)(message, room, roomUpdater);
    if (!shouldSaveInactivity(message)) {
        return message;
    }
    if (!responseBy) {
        return;
    }
    if ((0, moment_1.default)(responseBy.firstResponseTs).isSame((0, moment_1.default)(message.ts))) {
        yield (0, Helper_1.setPredictedVisitorAbandonmentTime)(Object.assign(Object.assign({}, room), { responseBy }), roomUpdater);
    }
}), callbacks_1.callbacks.priority.MEDIUM, 'save-visitor-inactivity');
