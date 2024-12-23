"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsAppStorage = void 0;
const Datastore = __importStar(require("nedb"));
const storage_1 = require("../../../src/server/storage");
class TestsAppStorage extends storage_1.AppMetadataStorage {
    constructor() {
        super('nedb');
        this.db = new Datastore({ filename: 'tests/test-data/dbs/apps.nedb', autoload: true });
        this.db.ensureIndex({ fieldName: 'id', unique: true });
    }
    create(item) {
        return new Promise((resolve, reject) => {
            item.createdAt = new Date();
            item.updatedAt = new Date();
            this.db.findOne({ $or: [{ id: item.id }, { 'info.nameSlug': item.info.nameSlug }] }, (err, doc) => {
                if (err) {
                    reject(err);
                }
                else if (doc) {
                    reject(new Error('App already exists.'));
                }
                else {
                    this.db.insert(item, (err2, doc2) => {
                        if (err2) {
                            reject(err2);
                        }
                        else {
                            resolve(doc2);
                        }
                    });
                }
            });
        });
    }
    retrieveOne(id) {
        return new Promise((resolve, reject) => {
            this.db.findOne({ id }, (err, doc) => {
                if (err) {
                    reject(err);
                }
                else if (doc) {
                    resolve(doc);
                }
                else {
                    reject(new Error(`No App found by the id: ${id}`));
                }
            });
        });
    }
    retrieveAll() {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err, docs) => {
                if (err) {
                    reject(err);
                }
                else {
                    const items = new Map();
                    docs.forEach((i) => items.set(i.id, i));
                    resolve(items);
                }
            });
        });
    }
    retrieveAllPrivate() {
        return new Promise((resolve, reject) => {
            this.db.find({ installationSource: 'private' }, (err, docs) => {
                if (err) {
                    reject(err);
                }
                else {
                    const items = new Map();
                    docs.forEach((i) => items.set(i.id, i));
                    resolve(items);
                }
            });
        });
    }
    update(item) {
        return new Promise((resolve, reject) => {
            this.db.update({ id: item.id }, item, {}, (err, numOfUpdated) => {
                if (err) {
                    reject(err);
                }
                else {
                    this.retrieveOne(item.id)
                        .then((updated) => resolve(updated))
                        .catch((err2) => reject(err2));
                }
            });
        });
    }
    remove(id) {
        return new Promise((resolve, reject) => {
            this.db.remove({ id }, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({ success: true });
                }
            });
        });
    }
}
exports.TestsAppStorage = TestsAppStorage;
