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
exports.saveRoomSystemMessages = void 0;
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const MessageTypes_1 = require("../../../lib/lib/MessageTypes");
const saveRoomSystemMessages = function (rid, systemMessages) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!check_1.Match.test(rid, String)) {
            throw new meteor_1.Meteor.Error('invalid-room', 'Invalid room', {
                function: 'RocketChat.saveRoomSystemMessages',
            });
        }
        if (systemMessages &&
            (!check_1.Match.test(systemMessages, [String]) || systemMessages.some((value) => !MessageTypes_1.MessageTypesValues.map(({ key }) => key).includes(value)))) {
            throw new meteor_1.Meteor.Error('invalid-room', 'Invalid option', {
                function: 'RocketChat.saveRoomSystemMessages',
            });
        }
        return models_1.Rooms.setSystemMessagesById(rid, systemMessages);
    });
};
exports.saveRoomSystemMessages = saveRoomSystemMessages;
