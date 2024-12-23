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
exports.IntegrationHistoryRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class IntegrationHistoryRaw extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'integration_history');
    }
    modelIndexes() {
        return [
            { key: { 'integration._id': 1, 'integration._createdBy._id': 1 } },
            { key: { _updatedAt: 1 }, expireAfterSeconds: 30 * 24 * 60 * 60 },
        ];
    }
    removeByIntegrationId(integrationId) {
        return this.deleteMany({ 'integration._id': integrationId });
    }
    findOneByIntegrationIdAndHistoryId(integrationId, historyId) {
        return this.findOne({ 'integration._id': integrationId, '_id': historyId });
    }
    create(integrationHistory) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.insertOne(Object.assign(Object.assign({}, integrationHistory), { _createdAt: new Date() }));
        });
    }
    updateById(_id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.findOneAndUpdate({ _id }, { $set: data }, Object.assign({ returnDocument: 'after' }, options));
            return response.value;
        });
    }
}
exports.IntegrationHistoryRaw = IntegrationHistoryRaw;
