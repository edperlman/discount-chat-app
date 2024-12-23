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
exports.changeContactBlockStatus = changeContactBlockStatus;
exports.ensureSingleContactLicense = ensureSingleContactLicense;
exports.closeBlockedRoom = closeBlockedRoom;
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const LivechatTyped_1 = require("../../../../../../app/livechat/server/lib/LivechatTyped");
const i18n_1 = require("../../../../../../server/lib/i18n");
function changeContactBlockStatus(_a) {
    return __awaiter(this, arguments, void 0, function* ({ block, visitor }) {
        const result = yield models_1.LivechatContacts.updateContactChannel(visitor, { blocked: block });
        if (!result.modifiedCount) {
            throw new Error('error-contact-not-found');
        }
    });
}
function ensureSingleContactLicense() {
    if (!license_1.License.hasModule('contact-id-verification')) {
        throw new Error('error-action-not-allowed');
    }
}
function closeBlockedRoom(association, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const visitor = yield models_1.LivechatVisitors.findOneById(association.visitorId);
        if (!visitor) {
            throw new Error('error-visitor-not-found');
        }
        const room = yield models_1.LivechatRooms.findOneOpenByContactChannelVisitor(association);
        if (!room) {
            return;
        }
        return LivechatTyped_1.Livechat.closeRoom({ room, visitor, comment: i18n_1.i18n.t('close-blocked-room-comment'), user });
    });
}
