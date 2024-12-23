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
const meteor_1 = require("meteor/meteor");
const onClientMessageReceived_1 = require("../../../../client/lib/onClientMessageReceived");
const toast_1 = require("../../../../client/lib/toast");
const callbacks_1 = require("../../../../lib/callbacks");
const stringUtils_1 = require("../../../../lib/utils/stringUtils");
const client_1 = require("../../../models/client");
const client_2 = require("../../../settings/client");
const i18n_1 = require("../../../utils/lib/i18n");
meteor_1.Meteor.methods({
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid || (0, stringUtils_1.trim)(message.msg) === '') {
                return false;
            }
            const messageAlreadyExists = message._id && client_1.Messages.findOne({ _id: message._id });
            if (messageAlreadyExists) {
                return (0, toast_1.dispatchToastMessage)({ type: 'error', message: (0, i18n_1.t)('Message_Already_Sent') });
            }
            const user = meteor_1.Meteor.user();
            if (!(user === null || user === void 0 ? void 0 : user.username)) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'sendMessage' });
            }
            message.ts = new Date();
            message.u = {
                _id: uid,
                username: user.username,
                name: user.name || '',
            };
            message.temp = true;
            if (client_2.settings.get('Message_Read_Receipt_Enabled')) {
                message.unread = true;
            }
            // If the room is federated, send the message to matrix only
            const room = client_1.Rooms.findOne({ _id: message.rid }, { fields: { federated: 1, name: 1 } });
            if (room === null || room === void 0 ? void 0 : room.federated) {
                return;
            }
            yield (0, onClientMessageReceived_1.onClientMessageReceived)(message).then((message) => {
                client_1.Messages.insert(message);
                return callbacks_1.callbacks.run('afterSaveMessage', message, { room });
            });
        });
    },
});
