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
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../../lib/callbacks");
const isPlainObject_1 = require("../../../../../lib/utils/isPlainObject");
callbacks_1.callbacks.add('livechat.beforeRoom', (roomInfo, extraData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!extraData) {
        return roomInfo;
    }
    const { sla: searchTerm, customFields } = extraData;
    const roomInfoWithExtraData = Object.assign(Object.assign({}, roomInfo), ((0, isPlainObject_1.isPlainObject)(customFields) && { customFields }));
    if (!searchTerm) {
        return roomInfoWithExtraData;
    }
    const sla = yield models_1.OmnichannelServiceLevelAgreements.findOneByIdOrName(searchTerm);
    if (!sla) {
        throw new meteor_1.Meteor.Error('error-invalid-sla', 'Invalid sla', {
            function: 'livechat.beforeRoom',
        });
    }
    const { _id: slaId } = sla;
    return Object.assign(Object.assign({}, roomInfoWithExtraData), { slaId });
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-before-new-room');
