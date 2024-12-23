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
exports.BaseDummy = void 0;
const models_1 = require("@rocket.chat/models");
class BaseDummy {
    constructor(name) {
        this.name = name;
        this.collectionName = (0, models_1.getCollectionName)(name);
        this.col = undefined;
    }
    createIndexes() {
        return __awaiter(this, void 0, void 0, function* () {
            // nothing to do
        });
    }
    getUpdater() {
        return new models_1.UpdaterImpl();
    }
    updateFromUpdater(query, updater) {
        return this.updateOne(query, updater);
    }
    getCollectionName() {
        return this.collectionName;
    }
    findOneAndDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                value: null,
                ok: 1,
            };
        });
    }
    findOneAndUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                value: null,
                ok: 1,
            };
        });
    }
    findOneById(_id, _options) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    findOne(_query, _options) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    find(_query, _options) {
        return undefined;
    }
    findPaginated(_query, _options) {
        return {
            cursor: undefined,
            totalCount: Promise.resolve(0),
        };
    }
    update(filter, update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateOne(filter, update, options);
        });
    }
    updateOne(_filter, _update, _options) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                acknowledged: true,
                matchedCount: 0,
                modifiedCount: 0,
                upsertedCount: 0,
                upsertedId: '',
            };
        });
    }
    updateMany(filter, update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateOne(filter, update, options);
        });
    }
    insertMany(_docs, _options) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                acknowledged: true,
                insertedCount: 0,
                insertedIds: {},
            };
        });
    }
    insertOne(_doc, _options) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                acknowledged: true,
                insertedId: '',
            };
        });
    }
    removeById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                acknowledged: true,
                deletedCount: 0,
            };
        });
    }
    removeByIds(_ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                acknowledged: true,
                deletedCount: 0,
            };
        });
    }
    deleteOne(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteMany(filter, options);
        });
    }
    deleteMany(_filter, _options) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                acknowledged: true,
                deletedCount: 0,
            };
        });
    }
    // Trash
    trashFind(_query, _options) {
        return undefined;
    }
    trashFindOneById(_id, _options) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    trashFindDeletedAfter(_deletedAt, _query, _options) {
        return undefined;
    }
    trashFindPaginatedDeletedAfter(_deletedAt, _query, _options) {
        return {
            cursor: undefined,
            totalCount: Promise.resolve(0),
        };
    }
    watch(_pipeline) {
        return undefined;
    }
    countDocuments() {
        return __awaiter(this, void 0, void 0, function* () {
            return 0;
        });
    }
    estimatedDocumentCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return 0;
        });
    }
}
exports.BaseDummy = BaseDummy;
