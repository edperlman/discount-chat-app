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
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const canAccessRoom_1 = require("../../app/authorization/server/functions/canAccessRoom");
const normalizeMessagesForUser_1 = require("../../app/utils/server/lib/normalizeMessagesForUser");
meteor_1.Meteor.methods({
    loadSurroundingMessages(message_1) {
        return __awaiter(this, arguments, void 0, function* (message, limit = 50) {
            var _a;
            (0, check_1.check)(message, Object);
            (0, check_1.check)(limit, Number);
            if (!meteor_1.Meteor.userId()) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'loadSurroundingMessages',
                });
            }
            const fromId = (_a = meteor_1.Meteor.userId()) !== null && _a !== void 0 ? _a : undefined;
            if (!message._id) {
                return false;
            }
            const mainMessage = yield models_1.Messages.findOneById(message._id);
            if (!(mainMessage === null || mainMessage === void 0 ? void 0 : mainMessage.rid)) {
                return false;
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(mainMessage.rid, fromId))) {
                return false;
            }
            limit -= 1;
            const options = {
                sort: {
                    ts: -1,
                },
                limit: Math.ceil(limit / 2),
            };
            const messages = yield models_1.Messages.findVisibleByRoomIdBeforeTimestamp(mainMessage.rid, mainMessage.ts, options).toArray();
            const moreBefore = messages.length === options.limit;
            messages.push(mainMessage);
            options.sort = {
                ts: 1,
            };
            options.limit = Math.floor(limit / 2);
            const afterMessages = yield models_1.Messages.findVisibleByRoomIdAfterTimestamp(mainMessage.rid, mainMessage.ts, options).toArray();
            const moreAfter = afterMessages.length === options.limit;
            messages.push(...afterMessages);
            return {
                messages: fromId ? yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)(messages, fromId) : messages,
                moreBefore,
                moreAfter,
            };
        });
    },
});
