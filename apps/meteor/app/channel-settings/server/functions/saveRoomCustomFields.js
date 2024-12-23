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
exports.saveRoomCustomFields = void 0;
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const saveRoomCustomFields = function (rid, roomCustomFields) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!check_1.Match.test(rid, String)) {
            throw new meteor_1.Meteor.Error('invalid-room', 'Invalid room', {
                function: 'RocketChat.saveRoomCustomFields',
            });
        }
        if (!check_1.Match.test(roomCustomFields, Object)) {
            throw new meteor_1.Meteor.Error('invalid-roomCustomFields-type', 'Invalid roomCustomFields type', {
                function: 'RocketChat.saveRoomCustomFields',
            });
        }
        const ret = yield models_1.Rooms.setCustomFieldsById(rid, roomCustomFields);
        // Update customFields of any user's Subscription related with this rid
        const { modifiedCount } = yield models_1.Subscriptions.updateCustomFieldsByRoomId(rid, roomCustomFields);
        if (modifiedCount) {
            void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(rid);
        }
        return ret;
    });
};
exports.saveRoomCustomFields = saveRoomCustomFields;
