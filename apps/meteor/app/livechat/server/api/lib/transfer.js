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
exports.findLivechatTransferHistory = findLivechatTransferHistory;
const models_1 = require("@rocket.chat/models");
const normalizeTransferHistory = ({ transferData }) => transferData;
const removeNulls = (value) => value != null;
function findLivechatTransferHistory(_a) {
    return __awaiter(this, arguments, void 0, function* ({ rid, pagination: { offset, count, sort }, }) {
        const { cursor, totalCount } = models_1.Messages.findPaginated({ rid, t: 'livechat_transfer_history' }, {
            projection: { transferData: 1 },
            sort: sort || { ts: 1 },
            skip: offset,
            limit: count,
        });
        const [history, total] = yield Promise.all([cursor.map(normalizeTransferHistory).toArray(), totalCount]);
        return {
            history: history.filter(removeNulls),
            count: history.length,
            offset,
            total,
        };
    });
}
