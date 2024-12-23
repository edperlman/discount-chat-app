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
exports.AppsLogsModel = void 0;
const BaseRaw_1 = require("./BaseRaw");
class AppsLogsModel extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'apps_logs', undefined, { _updatedAtIndexOptions: { expireAfterSeconds: 60 * 60 * 24 * 30 } });
    }
    remove(query) {
        return this.col.deleteMany(query);
    }
    resetTTLIndex(expireAfterSeconds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.col.indexExists('_updatedAt_1')) {
                yield this.col.dropIndex('_updatedAt_1');
            }
            yield this.col.createIndex({ _updatedAt: 1 }, { expireAfterSeconds });
        });
    }
}
exports.AppsLogsModel = AppsLogsModel;
