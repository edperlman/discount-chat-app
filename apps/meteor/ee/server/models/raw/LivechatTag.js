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
exports.LivechatTagRaw = void 0;
const BaseRaw_1 = require("../../../../server/models/raw/BaseRaw");
class LivechatTagRaw extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'livechat_tag');
    }
    modelIndexes() {
        return [
            {
                key: {
                    name: 1,
                },
                unique: true,
            },
        ];
    }
    findOneById(_id, options) {
        const query = { _id };
        return this.findOne(query, options);
    }
    findInIds(ids, options) {
        const query = { _id: { $in: ids } };
        return this.find(query, options);
    }
    createOrUpdateTag(_id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (_id, { name, description }, departments = []) {
            const record = {
                name,
                description,
                numDepartments: departments.length,
                departments,
            };
            if (_id) {
                yield this.updateOne({ _id }, { $set: record });
            }
            else {
                _id = (yield this.insertOne(record)).insertedId;
            }
            return Object.assign(record, { _id });
        });
    }
    // REMOVE
    removeById(_id) {
        const query = { _id };
        return this.deleteOne(query);
    }
}
exports.LivechatTagRaw = LivechatTagRaw;
