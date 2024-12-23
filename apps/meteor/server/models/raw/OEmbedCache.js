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
exports.OEmbedCacheRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class OEmbedCacheRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'oembed_cache', trash);
    }
    modelIndexes() {
        return [{ key: { updatedAt: 1 } }];
    }
    createWithIdAndData(_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = {
                _id,
                data,
                updatedAt: new Date(),
            };
            record._id = (yield this.insertOne(record)).insertedId;
            return record;
        });
    }
    removeBeforeDate(date) {
        const query = {
            updatedAt: {
                $lte: date,
            },
        };
        return this.deleteMany(query);
    }
}
exports.OEmbedCacheRaw = OEmbedCacheRaw;
