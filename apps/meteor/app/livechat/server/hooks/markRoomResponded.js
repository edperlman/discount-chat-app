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
exports.markRoomResponded = markRoomResponded;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const moment_1 = __importDefault(require("moment"));
const callbacks_1 = require("../../../../lib/callbacks");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
function markRoomResponded(message, room, roomUpdater) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if ((0, core_typings_1.isSystemMessage)(message) || (0, core_typings_1.isEditedMessage)(message) || (0, core_typings_1.isMessageFromVisitor)(message)) {
            return;
        }
        const monthYear = (0, moment_1.default)().format('YYYY-MM');
        const isVisitorActive = yield models_1.LivechatVisitors.isVisitorActiveOnPeriod(room.v._id, monthYear);
        // Case: agent answers & visitor is not active, we mark visitor as active
        if (!isVisitorActive) {
            yield models_1.LivechatVisitors.markVisitorActiveForPeriod(room.v._id, monthYear);
        }
        if (!((_b = (_a = room.v) === null || _a === void 0 ? void 0 : _a.activity) === null || _b === void 0 ? void 0 : _b.includes(monthYear))) {
            models_1.LivechatRooms.getVisitorActiveForPeriodUpdateQuery(monthYear, roomUpdater);
            const livechatInquiry = yield models_1.LivechatInquiry.markInquiryActiveForPeriod(room._id, monthYear);
            if (livechatInquiry) {
                void (0, notifyListener_1.notifyOnLivechatInquiryChanged)(livechatInquiry, 'updated', { v: livechatInquiry.v });
            }
        }
        if (!room.waitingResponse) {
            // case where agent sends second message or any subsequent message in a room before visitor responds to the first message
            // in this case, we just need to update the lastMessageTs of the responseBy object
            if (room.responseBy) {
                models_1.LivechatRooms.getAgentLastMessageTsUpdateQuery(roomUpdater);
            }
            return room.responseBy;
        }
        // Since we're updating the whole object anyways, we re-use the same values from object (or from message if not present)
        // And then we update the lastMessageTs, which is the only thing that should be updating here
        const { responseBy: { _id, username, firstResponseTs } = {} } = room;
        const responseBy = {
            _id: _id || message.u._id,
            username: username || message.u.username,
            firstResponseTs: firstResponseTs || new Date(message.ts),
            lastMessageTs: new Date(message.ts),
        };
        models_1.LivechatRooms.getResponseByRoomIdUpdateQuery(responseBy, roomUpdater);
        return responseBy;
    });
}
callbacks_1.callbacks.add('afterOmnichannelSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room, roomUpdater }) {
    if (!message || (0, core_typings_1.isEditedMessage)(message) || (0, core_typings_1.isMessageFromVisitor)(message) || (0, core_typings_1.isSystemMessage)(message)) {
        return;
    }
    yield markRoomResponded(message, room, roomUpdater);
}), callbacks_1.callbacks.priority.HIGH, 'markRoomResponded');
