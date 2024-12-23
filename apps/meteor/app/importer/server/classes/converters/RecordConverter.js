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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordConverter = void 0;
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const mongodb_1 = require("mongodb");
const ConverterCache_1 = require("./ConverterCache");
class RecordConverter {
    constructor(options, logger, cache) {
        this.skippedCount = 0;
        this.failedCount = 0;
        this.aborted = false;
        const _a = options || {}, { workInMemory = false, deleteDbData = false } = _a, customOptions = __rest(_a, ["workInMemory", "deleteDbData"]);
        this._converterOptions = {
            workInMemory,
            deleteDbData,
        };
        this._options = customOptions;
        this._logger = logger || new logger_1.Logger(`Data Importer - ${this.constructor.name}`);
        this._cache = cache || new ConverterCache_1.ConverterCache();
        this._records = [];
    }
    skipMemoryRecord(_id) {
        const record = this.getMemoryRecordById(_id);
        if (!record) {
            return;
        }
        record.skipped = true;
    }
    skipDatabaseRecord(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.ImportData.updateOne({
                _id,
            }, {
                $set: {
                    skipped: true,
                },
            });
        });
    }
    skipRecord(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.skippedCount++;
            this.skipMemoryRecord(_id);
            if (!this._converterOptions.workInMemory) {
                return this.skipDatabaseRecord(_id);
            }
        });
    }
    saveErrorToMemory(importId, error) {
        const record = this.getMemoryRecordById(importId);
        if (!record) {
            return;
        }
        if (!record.errors) {
            record.errors = [];
        }
        record.errors.push({
            message: error.message,
            stack: error.stack,
        });
    }
    saveErrorToDatabase(importId, error) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.ImportData.updateOne({
                _id: importId,
            }, {
                $push: {
                    errors: {
                        message: error.message,
                        stack: error.stack,
                    },
                },
            });
        });
    }
    saveError(importId, error) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.error(error);
            this.saveErrorToMemory(importId, error);
            if (!this._converterOptions.workInMemory) {
                return this.saveErrorToDatabase(importId, error);
            }
        });
    }
    clearImportData() {
        return __awaiter(this, void 0, void 0, function* () {
            this._records = [];
            // On regular import operations this data will be deleted by the importer class with one single operation for all dataTypes (aka with no filter)
            if (!this._converterOptions.workInMemory && this._converterOptions.deleteDbData) {
                yield models_1.ImportData.col.deleteMany({ dataType: this.getDataType() });
            }
        });
    }
    clearSuccessfullyImportedData() {
        return __awaiter(this, void 0, void 0, function* () {
            this._records = this._records.filter((record) => { var _a; return !((_a = record.errors) === null || _a === void 0 ? void 0 : _a.length); });
            // On regular import operations this data will be deleted by the importer class with one single operation for all dataTypes (aka with no filter)
            if (!this._converterOptions.workInMemory && this._converterOptions.deleteDbData) {
                yield models_1.ImportData.col.deleteMany({ dataType: this.getDataType(), error: { $exists: false } });
            }
        });
    }
    getMemoryRecordById(id) {
        for (const record of this._records) {
            if (record._id === id) {
                return record;
            }
        }
        return undefined;
    }
    getDataType() {
        throw new Error('Unspecified type');
    }
    addObjectToDatabase(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, options = {}) {
            yield models_1.ImportData.col.insertOne({
                _id: new mongodb_1.ObjectId().toHexString(),
                data,
                dataType: this.getDataType(),
                options,
            });
        });
    }
    addObjectToMemory(data, options = {}) {
        this._records.push({
            _id: random_1.Random.id(),
            data,
            dataType: this.getDataType(),
            options,
        });
    }
    addObject(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, options = {}) {
            if (this._converterOptions.workInMemory) {
                return this.addObjectToMemory(data, options);
            }
            return this.addObjectToDatabase(data, options);
        });
    }
    getDatabaseDataToImport() {
        return models_1.ImportData.find({ dataType: this.getDataType() }).toArray();
    }
    getDataToImport() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._converterOptions.workInMemory) {
                return this._records;
            }
            const dbRecords = yield this.getDatabaseDataToImport();
            if (this._records.length) {
                return [...this._records, ...dbRecords];
            }
            return dbRecords;
        });
    }
    iterateRecords() {
        return __awaiter(this, arguments, void 0, function* ({ beforeImportFn, afterImportFn, onErrorFn, processRecord, } = {}) {
            var _a, e_1, _b, _c;
            const records = yield this.getDataToImport();
            this.skippedCount = 0;
            this.failedCount = 0;
            try {
                for (var _d = true, records_1 = __asyncValues(records), records_1_1; records_1_1 = yield records_1.next(), _a = records_1_1.done, !_a; _d = true) {
                    _c = records_1_1.value;
                    _d = false;
                    const record = _c;
                    const { _id } = record;
                    if (this.aborted) {
                        return;
                    }
                    try {
                        if (beforeImportFn && !(yield beforeImportFn(record))) {
                            yield this.skipRecord(_id);
                            continue;
                        }
                        const isNew = yield (processRecord || this.convertRecord).call(this, record);
                        if (typeof isNew === 'boolean' && afterImportFn) {
                            yield afterImportFn(record, isNew);
                        }
                    }
                    catch (e) {
                        this.failedCount++;
                        yield this.saveError(_id, e instanceof Error ? e : new Error(String(e)));
                        if (onErrorFn) {
                            yield onErrorFn();
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = records_1.return)) yield _b.call(records_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    convertData() {
        return __awaiter(this, arguments, void 0, function* (callbacks = {}) {
            return this.iterateRecords(callbacks);
        });
    }
    convertRecord(_record) {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
}
exports.RecordConverter = RecordConverter;
