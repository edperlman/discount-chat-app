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
meteor_1.Meteor.methods({
    loadMissedMessages(rid, start) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (0, check_1.check)(rid, String);
            (0, check_1.check)(start, Date);
            const fromId = (_a = meteor_1.Meteor.userId()) !== null && _a !== void 0 ? _a : undefined;
            if (!rid) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'getUsersOfRoom' });
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(rid, fromId))) {
                return false;
            }
            return models_1.Messages.findVisibleByRoomIdAfterTimestamp(rid, start, {
                sort: {
                    ts: -1,
                },
            }).toArray();
        });
    },
});
