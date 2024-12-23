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
exports.saveRoomReadOnly = saveRoomReadOnly;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
function saveRoomReadOnly(rid_1, readOnly_1, user_1) {
    return __awaiter(this, arguments, void 0, function* (rid, readOnly, user, sendMessage = true) {
        if (!check_1.Match.test(rid, String)) {
            throw new meteor_1.Meteor.Error('invalid-room', 'Invalid room', {
                function: 'RocketChat.saveRoomReadOnly',
            });
        }
        const result = yield models_1.Rooms.setReadOnlyById(rid, readOnly);
        if (result && sendMessage) {
            if (readOnly) {
                yield core_services_1.Message.saveSystemMessage('room-set-read-only', rid, '', user);
            }
            else {
                yield core_services_1.Message.saveSystemMessage('room-removed-read-only', rid, '', user);
            }
        }
        return result;
    });
}
