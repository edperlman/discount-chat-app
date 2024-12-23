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
exports.reportMessage = void 0;
const apps_1 = require("@rocket.chat/apps");
const models_1 = require("@rocket.chat/models");
const canAccessRoom_1 = require("../../../app/authorization/server/functions/canAccessRoom");
const reportMessage = (messageId, description, uid) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!uid) {
        throw new Error('error-invalid-user');
    }
    if (!description.trim()) {
        throw new Error('error-invalid-description');
    }
    const message = yield models_1.Messages.findOneById(messageId);
    if (!message) {
        throw new Error('error-invalid-message_id');
    }
    const user = yield models_1.Users.findOneById(uid);
    if (!user) {
        throw new Error('error-invalid-user');
    }
    const { rid } = message;
    // If the user can't access the room where the message is, report that the message id is invalid
    const room = yield models_1.Rooms.findOneById(rid);
    if (!room || !(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, { _id: uid }))) {
        throw new Error('error-invalid-message_id');
    }
    const reportedBy = {
        _id: user._id,
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
    };
    const roomInfo = {
        _id: rid,
        name: room.name,
        t: room.t,
        federated: room.federated,
        fname: room.fname,
    };
    yield models_1.ModerationReports.createWithMessageDescriptionAndUserId(message, description, roomInfo, reportedBy);
    yield ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPostMessageReported, message, user, description));
    return true;
});
exports.reportMessage = reportMessage;
