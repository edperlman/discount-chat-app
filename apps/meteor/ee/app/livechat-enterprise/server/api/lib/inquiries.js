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
exports.setSLAToInquiry = setSLAToInquiry;
const models_1 = require("@rocket.chat/models");
const sla_1 = require("./sla");
function setSLAToInquiry(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, roomId, sla }) {
        const inquiry = yield models_1.LivechatInquiry.findOneByRoomId(roomId, { projection: { status: 1 } });
        if (!inquiry || inquiry.status !== 'queued') {
            throw new Error('error-invalid-inquiry');
        }
        const slaData = sla && (yield models_1.OmnichannelServiceLevelAgreements.findOneByIdOrName(sla));
        if (!slaData) {
            throw new Error('error-invalid-sla');
        }
        const user = yield models_1.Users.findOneById(userId, { projection: { _id: 1, username: 1, name: 1 } });
        if (!(user === null || user === void 0 ? void 0 : user.username)) {
            throw new Error('error-invalid-user');
        }
        yield (0, sla_1.updateRoomSLA)(roomId, {
            _id: user._id,
            name: user.name || '',
            username: user.username,
        }, slaData);
    });
}
