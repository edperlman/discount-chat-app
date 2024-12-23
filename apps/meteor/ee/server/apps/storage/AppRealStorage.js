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
exports.AppRealStorage = void 0;
const storage_1 = require("@rocket.chat/apps-engine/server/storage");
class AppRealStorage extends storage_1.AppMetadataStorage {
    constructor(db) {
        super('mongodb');
        this.db = db;
    }
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.createdAt = new Date();
            item.updatedAt = new Date();
            const doc = yield this.db.findOne({ $or: [{ id: item.id }, { 'info.nameSlug': item.info.nameSlug }] });
            if (doc) {
                throw new Error('App already exists.');
            }
            const id = (yield this.db.insertOne(item)).insertedId;
            item._id = id;
            return item;
        });
    }
    retrieveOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.findOne({ $or: [{ _id: id }, { id }] });
        });
    }
    retrieveAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield this.db.find({}).toArray();
            const items = new Map();
            docs.forEach((i) => items.set(i.id, i));
            return items;
        });
    }
    retrieveAllPrivate() {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield this.db.find({ installationSource: 'private' }).toArray();
            const items = new Map();
            docs.forEach((i) => items.set(i.id, i));
            return items;
        });
    }
    update(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.updateOne({ id: item.id, _id: item._id }, { $set: item });
            return this.retrieveOne(item.id);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.deleteOne({ id });
            return { success: true };
        });
    }
}
exports.AppRealStorage = AppRealStorage;
