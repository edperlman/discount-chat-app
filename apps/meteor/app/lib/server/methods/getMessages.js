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
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
meteor_1.Meteor.methods({
    getMessages(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(messages, [String]);
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'getMessages' });
            }
            const msgs = yield models_1.Messages.findVisibleByIds(messages).toArray();
            const rids = yield Promise.all([...new Set(msgs.map((m) => m.rid))].map((_id) => (0, canAccessRoom_1.canAccessRoomIdAsync)(_id, uid)));
            if (!rids.every(Boolean)) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'getSingleMessage' });
            }
            return msgs;
        });
    },
});
