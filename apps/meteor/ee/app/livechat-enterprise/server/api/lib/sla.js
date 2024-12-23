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
exports.removeRoomSLA = exports.updateRoomSLA = void 0;
exports.findSLA = findSLA;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const SlaHelper_1 = require("../../lib/SlaHelper");
function findSLA(_a) {
    return __awaiter(this, arguments, void 0, function* ({ text, pagination: { offset, count, sort }, }) {
        const query = Object.assign({}, (text && { $or: [{ name: new RegExp((0, string_helpers_1.escapeRegExp)(text), 'i') }, { description: new RegExp((0, string_helpers_1.escapeRegExp)(text), 'i') }] }));
        const { cursor, totalCount } = yield models_1.OmnichannelServiceLevelAgreements.findPaginated(query, {
            sort: sort || { name: 1 },
            skip: offset,
            limit: count,
        });
        const [sla, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            sla,
            count: sla.length,
            offset,
            total,
        };
    });
}
const updateRoomSLA = (roomId, user, sla) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([(0, SlaHelper_1.updateInquiryQueueSla)(roomId, sla), (0, SlaHelper_1.updateRoomSlaWeights)(roomId, sla), (0, SlaHelper_1.addSlaChangeHistoryToRoom)(roomId, user, sla)]);
});
exports.updateRoomSLA = updateRoomSLA;
const removeRoomSLA = (roomId, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([(0, SlaHelper_1.removeInquiryQueueSla)(roomId), (0, SlaHelper_1.removeSlaFromRoom)(roomId), (0, SlaHelper_1.addSlaChangeHistoryToRoom)(roomId, user)]);
});
exports.removeRoomSLA = removeRoomSLA;
