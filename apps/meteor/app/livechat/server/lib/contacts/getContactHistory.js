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
exports.getContactHistory = exports.fetchContactHistory = void 0;
const models_1 = require("@rocket.chat/models");
const patch_injection_1 = require("@rocket.chat/patch-injection");
exports.fetchContactHistory = (0, patch_injection_1.makeFunction)((_a) => __awaiter(void 0, [_a], void 0, function* ({ contactId, options, }) {
    return models_1.LivechatRooms.findClosedRoomsByContactPaginated({
        contactId,
        options,
    });
}));
exports.getContactHistory = (0, patch_injection_1.makeFunction)((params) => __awaiter(void 0, void 0, void 0, function* () {
    const { contactId, count, offset, sort } = params;
    const contact = yield models_1.LivechatContacts.findOneById(contactId, { projection: { _id: 1 } });
    if (!contact) {
        throw new Error('error-contact-not-found');
    }
    const options = {
        sort: sort || { closedAt: -1 },
        skip: offset,
        limit: count,
        projection: {
            fname: 1,
            ts: 1,
            v: 1,
            msgs: 1,
            servedBy: 1,
            closedAt: 1,
            closedBy: 1,
            closer: 1,
            tags: 1,
            source: 1,
            lastMessage: 1,
            verified: 1,
        },
    };
    const { totalCount, cursor } = yield (0, exports.fetchContactHistory)({
        contactId: contact._id,
        options,
        extraParams: params,
    });
    const [total, history] = yield Promise.all([totalCount, cursor.toArray()]);
    return {
        history,
        count: history.length,
        offset,
        total,
    };
}));
