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
exports.findEmojisCustom = findEmojisCustom;
const models_1 = require("@rocket.chat/models");
function findEmojisCustom(_a) {
    return __awaiter(this, arguments, void 0, function* ({ query = {}, pagination: { offset, count, sort }, }) {
        const { cursor, totalCount } = models_1.EmojiCustom.findPaginated(query, {
            sort: sort || { name: 1 },
            skip: offset,
            limit: count,
        });
        const [emojis, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            emojis,
            count: emojis.length,
            offset,
            total,
        };
    });
}
