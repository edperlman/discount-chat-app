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
exports.saveReactWhenReadOnly = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const saveReactWhenReadOnly = function (rid_1, allowReact_1, user_1) {
    return __awaiter(this, arguments, void 0, function* (rid, allowReact, user, sendMessage = true) {
        if (!check_1.Match.test(rid, String)) {
            throw new meteor_1.Meteor.Error('invalid-room', 'Invalid room', {
                function: 'RocketChat.saveReactWhenReadOnly',
            });
        }
        const result = yield models_1.Rooms.setAllowReactingWhenReadOnlyById(rid, allowReact);
        if (result && sendMessage) {
            const type = allowReact ? 'room-allowed-reacting' : 'room-disallowed-reacting';
            yield core_services_1.Message.saveSystemMessage(type, rid, '', user);
        }
    });
};
exports.saveReactWhenReadOnly = saveReactWhenReadOnly;
