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
exports.ServiceLevelAgreements = void 0;
const BaseRaw_1 = require("../../../../server/models/raw/BaseRaw");
class ServiceLevelAgreements extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'omnichannel_service_level_agreements');
    }
    modelIndexes() {
        return [
            { key: { name: 1 }, unique: true },
            { key: { dueTimeInMinutes: 1 }, unique: true },
        ];
    }
    findDuplicate(_id, name, dueTimeInMinutes) {
        return this.findOne(Object.assign(Object.assign({}, (_id && { _id: { $ne: _id } })), { $or: [{ name }, { dueTimeInMinutes }] }), { projection: { _id: 1 } });
    }
    findOneByIdOrName(_idOrName, options = {}) {
        const query = {
            $or: [
                {
                    _id: _idOrName,
                },
                {
                    name: _idOrName,
                },
            ],
        };
        return this.findOne(query, options);
    }
    createOrUpdatePriority(_a, _id_1) {
        return __awaiter(this, arguments, void 0, function* ({ name, description, dueTimeInMinutes }, _id) {
            const record = {
                name,
                description,
                dueTimeInMinutes: parseInt(`${dueTimeInMinutes}`),
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
}
exports.ServiceLevelAgreements = ServiceLevelAgreements;
