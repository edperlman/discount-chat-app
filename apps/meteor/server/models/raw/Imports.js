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
exports.ImportsModel = void 0;
const BaseRaw_1 = require("./BaseRaw");
const arrayUtils_1 = require("../../../lib/utils/arrayUtils");
class ImportsModel extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'import');
    }
    modelIndexes() {
        return [{ key: { ts: -1 } }, { key: { valid: 1 } }];
    }
    findLastImport() {
        return __awaiter(this, void 0, void 0, function* () {
            const imports = yield this.find({}, { sort: { ts: -1 }, limit: 1 }).toArray();
            return imports.shift();
        });
    }
    hasValidOperationInStatus(allowedStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            return Boolean(yield this.findOne({
                valid: { $ne: false },
                status: { $in: allowedStatus },
            }, { projection: { _id: 1 } }));
        });
    }
    invalidateAllOperations() {
        return this.updateMany({ valid: { $ne: false } }, { $set: { valid: false } });
    }
    invalidateOperationsExceptId(id) {
        return this.updateMany({ valid: { $ne: false }, _id: { $ne: id } }, { $set: { valid: false } });
    }
    invalidateOperationsNotInStatus(status) {
        return this.updateMany({ valid: { $ne: false }, status: { $nin: (0, arrayUtils_1.ensureArray)(status) } }, { $set: { valid: false } });
    }
    findAllPendingOperations(options = {}) {
        return this.find({ valid: true }, options);
    }
    increaseTotalCount(id_1, recordType_1) {
        return __awaiter(this, arguments, void 0, function* (id, recordType, increaseBy = 1) {
            return this.updateOne({ _id: id }, {
                $inc: {
                    'count.total': increaseBy,
                    [`count.${recordType}`]: increaseBy,
                },
            });
        });
    }
    setOperationStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateOne({ _id: id }, {
                $set: {
                    status,
                },
            });
        });
    }
}
exports.ImportsModel = ImportsModel;
