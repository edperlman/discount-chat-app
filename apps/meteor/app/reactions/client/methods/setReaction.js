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
const roomCoordinator_1 = require("../../../../client/lib/rooms/roomCoordinator");
const client_1 = require("../../../emoji/client");
const client_2 = require("../../../models/client");
meteor_1.Meteor.methods({
    setReaction(reaction, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!meteor_1.Meteor.userId()) {
                throw new meteor_1.Meteor.Error(203, 'User_logged_out');
            }
            const user = meteor_1.Meteor.user();
            if (!(user === null || user === void 0 ? void 0 : user.username)) {
                return false;
            }
            const message = client_2.Messages.findOne({ _id: messageId });
            if (!message) {
                return false;
            }
            const room = client_2.Rooms.findOne({ _id: message.rid });
            if (!room) {
                return false;
            }
            if (message.private) {
                return false;
            }
            if (!client_1.emoji.list[reaction]) {
                return false;
            }
            if (roomCoordinator_1.roomCoordinator.readOnly(room._id, user)) {
                return false;
            }
            if (!client_2.Subscriptions.findOne({ rid: message.rid })) {
                return false;
            }
            if (((_a = message.reactions) === null || _a === void 0 ? void 0 : _a[reaction]) && message.reactions[reaction].usernames.indexOf(user.username) !== -1) {
                message.reactions[reaction].usernames.splice(message.reactions[reaction].usernames.indexOf(user.username), 1);
                if (message.reactions[reaction].usernames.length === 0) {
                    delete message.reactions[reaction];
                }
                if (!message.reactions || typeof message.reactions !== 'object' || Object.keys(message.reactions).length === 0) {
                    delete message.reactions;
                    client_2.Messages.update({ _id: messageId }, { $unset: { reactions: 1 } });
                }
                else {
                    client_2.Messages.update({ _id: messageId }, { $set: { reactions: message.reactions } });
                }
            }
            else {
                if (!message.reactions) {
                    message.reactions = {};
                }
                if (!message.reactions[reaction]) {
                    message.reactions[reaction] = {
                        usernames: [],
                    };
                }
                message.reactions[reaction].usernames.push(user.username);
                client_2.Messages.update({ _id: messageId }, { $set: { reactions: message.reactions } });
            }
        });
    },
});
