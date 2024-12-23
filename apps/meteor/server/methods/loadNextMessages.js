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
    loadNextMessages(rid_1, end_1) {
        return __awaiter(this, arguments, void 0, function* (rid, end, limit = 20) {
            (0, check_1.check)(rid, String);
            (0, check_1.check)(limit, Number);
            if (!meteor_1.Meteor.userId()) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'loadNextMessages',
                });
            }
            if (!rid) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'loadNextMessages' });
            }
            const fromId = meteor_1.Meteor.userId();
            if (!fromId || !(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(rid, fromId))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'loadNextMessages' });
            }
            let records;
            if (end) {
                records = yield models_1.Messages.findVisibleByRoomIdAfterTimestamp(rid, end, {
                    sort: {
                        ts: 1,
                    },
                    limit,
                }).toArray();
            }
            else {
                records = yield models_1.Messages.findVisibleByRoomId(rid, {
                    sort: {
                        ts: 1,
                    },
                    limit,
                }).toArray();
            }
            return {
                messages: yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)(records, fromId),
            };
        });
    },
});
