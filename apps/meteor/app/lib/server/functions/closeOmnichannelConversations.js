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
exports.closeOmnichannelConversations = void 0;
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../lib/callbacks");
const i18n_1 = require("../../../../server/lib/i18n");
const LivechatTyped_1 = require("../../../livechat/server/lib/LivechatTyped");
const server_1 = require("../../../settings/server");
const closeOmnichannelConversations = (user, subscribedRooms) => __awaiter(void 0, void 0, void 0, function* () {
    const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
    const roomsInfo = yield models_1.LivechatRooms.findByIds(subscribedRooms.map(({ rid }) => rid), {}, extraQuery);
    const language = server_1.settings.get('Language') || 'en';
    const comment = i18n_1.i18n.t('Agent_deactivated', { lng: language });
    const promises = [];
    yield roomsInfo.forEach((room) => {
        promises.push(LivechatTyped_1.Livechat.closeRoom({ user, room, comment }));
    });
    yield Promise.all(promises);
});
exports.closeOmnichannelConversations = closeOmnichannelConversations;
