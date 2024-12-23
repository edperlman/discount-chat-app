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
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const canAccessRoom_1 = require("../../../app/authorization/server/functions/canAccessRoom");
const ReadReceipt_1 = require("../lib/message-read-receipt/ReadReceipt");
meteor_1.Meteor.methods({
    getReadReceipts(_a) {
        return __awaiter(this, arguments, void 0, function* ({ messageId }) {
            if (!license_1.License.hasModule('message-read-receipt')) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'This is an enterprise feature', { method: 'getReadReceipts' });
            }
            if (!messageId) {
                throw new meteor_1.Meteor.Error('error-invalid-message', "The required 'messageId' param is missing.", { method: 'getReadReceipts' });
            }
            (0, check_1.check)(messageId, String);
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'getReadReceipts' });
            }
            const message = yield models_1.Messages.findOneById(messageId);
            if (!message) {
                throw new meteor_1.Meteor.Error('error-invalid-message', 'Invalid message', {
                    method: 'getReadReceipts',
                });
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(message.rid, uid))) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'getReadReceipts' });
            }
            return ReadReceipt_1.ReadReceipt.getReceipts(message);
        });
    },
});
